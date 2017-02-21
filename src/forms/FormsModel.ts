import { savedForm } from './FormsModel';
/**
 * created by waweru
*/

import * as mongoose from 'mongoose';
import * as _ from 'lodash';    
import { logger as log } from '../logger';
import { formsModel as db } from './FormsSchema';

type ObjectId = mongoose.Schema.Types.ObjectId | string;

export interface updateNotify {
    done: boolean; 
    timestamp: Date;
};

export interface form {
    name: string;
    questions: any[];
    author: ObjectId;
    contributors: ObjectId[];
}

export interface savedForm extends form{
    createdAt?: Date;
}

export interface formUser {
    account_id: ObjectId;
    account: string
}
export class FormsModel {
    protected createForm(newForm: form): Promise<savedForm> {
        let form = new db(newForm);
        return form.save();
    }
    protected getAllForms(form_user: formUser): Promise<savedForm[]> {
        // generate contributors query obj
        let contributorsQuery = {
            $in: [form_user.account_id]
        };
        return db.find({
            [form_user.account]: ((form_user.account==='author') ?  form_user.account_id : contributorsQuery)
        })
        .populate({
            path: 'author',
            select: '_id name gender dob'
        })
        .populate({
            path: 'contributors',
            select: '_id name gender dob'
        })
        .exec();
    }
    protected getOneForm(id: ObjectId): Promise<savedForm> {
        return db.findById(id)
            .populate({
                path: 'author',
                select: '_id name gender'
            })
            .populate({
                path: 'contributors',
                select: '_id name gender'
            })
            .exec();
    }
    protected updateForm(id: ObjectId, form_user: formUser, updates: any): Promise<savedForm> {
        // generate contributors query obj
        let contributorsQuery = {
            $in: [form_user.account_id]
        };
    
        return db.findOne({
            _id: id,
            [form_user.account]: (form_user.account==='author') ?  form_user.account_id : contributorsQuery
        })
        .exec()
        .then((data) => {
            for (let key in updates) {
                data[key] = updates[key]
            }
            data.updatedAt = new Date();
            return data.save();
        })
        .catch((err: Error) => {
            log.error(err);
            return Promise.reject(err);
        });
    }
    protected deleteForm(id: ObjectId, author: ObjectId): Promise<updateNotify> {
        
        return db
            .update(
                { 
                    _id: id, 
                    author: author 
                }, 
                { $set: 
                    {
                        deletion: true,
                        updatedAt: new Date()
                    }
                }, 
                {
                    safe: true,                
                    multi: false,
                    runValidators: true
                }
            )
            .exec()
            .then((updated) => {
                if (updated.ok === 1 && updated.nModified === 1) {
                    return Promise.resolve({
                        done: true,
                        timestamp: new Date()
                    });
                }
                else {
                    return Promise.resolve({
                        done: false,
                        timestamp: new Date()
                    });
                }
            })
            .catch((err: Error) => {
                // otherwise return error if something goes wrong
                log.error(err);
                return Promise.reject(err);
            });
    }
}