import { savedForm } from './FormsModel';
/**
 * created by waweru
*/

import * as mongoose from 'mongoose';
import * as _ from 'lodash';   
import { logger as log } from '../logger';
import { formsModel as db, IFormsModel } from './FormsSchema';

type ObjectId = mongoose.Schema.Types.ObjectId | string;

export interface updateNotify {
    done: boolean; 
    timestamp: Date;
};

export interface savedForm extends IFormsModel{
    createdAt: Date;
    updatedAt: Date;
}

export interface formUser {
    account_id: ObjectId;
    account: string
}

export interface IContributor{
    name: string;
    gender: string;
    _id: ObjectId;
}

export namespace Forms {

    export let create = (newForm: IFormsModel): Promise<savedForm> => (
        new db(newForm).save().catch((err: Error) => { log.error(err); return Promise.reject(err) })
    );
    
    export let getAll = (): Promise<savedForm[]> => (
        // find all forms if user is an author or a contributor
        db
        .find()
        .limit(10)
        .sort({ 'createdAt': -1 })
        .populate({
            path: 'author',
            select: '_id name gender dob'
        })
        .populate({
            path: 'contributors',
            select: '_id name gender dob'
        })
        .exec().catch((err: Error) => { log.error(err); return Promise.reject(err) })
    );
    
    export let getOne = (id: ObjectId, form_user: formUser): Promise<savedForm> => (
        // return a form
        db.findOne({
            _id: id,
            [form_user.account]: (form_user.account==='author') ?  form_user.account_id : { $in: [form_user.account_id] }
        })
        .populate({
            path: 'author',
            select: '_id name gender'
        })
        .populate({
            path: 'contributors',
            select: '_id name gender'
        })
        .exec().catch((err: Error) => { log.error(err); return Promise.reject(err) })
    );
    
    export let update = (id: ObjectId, form_user: formUser, updates: any): Promise<savedForm> => (
        // find form if a user is the author or a contributor
        db.findOne({
            _id: id,
            [form_user.account]: (form_user.account==='author') ?  form_user.account_id : { $in: [form_user.account_id] }
        })
        .exec()
        .then((data: any) => {
            for (let key in updates) {
                data[key] = updates[key]
            }
            data.updatedAt = new Date();
            return data.save();
        })
        .catch((err: Error) => {
            log.error(err);
            return Promise.reject(err);
        })
    );
    
    export let remove = (id: ObjectId, author: ObjectId): Promise<updateNotify> => (
            // update document to deletion to avoid mismatch of indexes
        db
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
        })
    );

}

export namespace FormContributors {
    
    export let add = (id: ObjectId, author: ObjectId, contributor: ObjectId | ObjectId[]): Promise<savedForm> => (
        // find form by id
        db
        .findOne({ _id: id, author: author })
        .exec()
        .then((data) => {
            //#then check if form exists
            if (_.isEmpty(data)) {
                let date = new Date();
                let err = new Error(`[${date}] could not access form. check your permissions`);
                log.error(err);
                return Promise.reject(err);
            }
            return Promise.resolve(data);
        })
        .then((data) => {
            //#then add contributor(s) and save
            let contributors = data.contributors;
            let newContributors: ObjectId[] = (data.contributors || <ObjectId[]>[]).concat(contributor);
            if (data.contributors.length > 0) {
                newContributors = <ObjectId[]>[].concat(_.uniq(newContributors));
            }
            data.contributors = <ObjectId[]>[].concat(newContributors);
            return data.save();
        })
        .catch((err: Error) => {
            // otherwise return error if something goes wrong
            log.error(err);
            return Promise.reject(err);
        })
    );

    export let getAll = (id: ObjectId): Promise<IContributor[]> => (
        // find form and return list of all contributors
        db
        .findOne({
            _id: id
        })
        .populate({
            path: 'author',
            select: '_id name gender'
        })
        .populate({
            path: 'contributors',
            select: '_id name gender'
        })
        .exec()
        .then((data: any) => {
            return Promise.resolve(data.contributors);
        })
        .catch((err: Error) => {
            // otherwise return error if something goes wrong
            log.error(err);
            return Promise.reject(err);
        })
    );

    export let remove = (id: ObjectId, author: ObjectId, contributor: ObjectId) => (
        db
        .findOne({ _id: id, author: author })
        .exec()
        .then((data) => {
            //#then check if form exists
            if (_.isEmpty(data)) {
                let date = new Date();
                let err = new Error(`[${date}] could not access form. check your permissions`);
                log.error(err);
                return Promise.reject(err);
            }
            return Promise.resolve(data);
        })
        .then((data) => {
            //#then remove contributor and save
            data.contributors.remove(contributor);
            return data.save();
        })
        .catch((err: Error) => {
            // otherwise return error if something goes wrong
            log.error(err);
            return Promise.reject(err);
        })  
    );

}