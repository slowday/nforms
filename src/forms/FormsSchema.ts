/**
 * created by waweru
*/

import * as mongoose from 'mongoose';

let FormsSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    form_state: {
        type: String,
        enum: {
            values: 'draft,closed,ready'.split(','),
            message: 'status not recongnized'
        },
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'missing author of the form'],
        ref: 'user-accounts'
    },
    questions: { type: Array, default: [] },
    
    /*    
    //# will be uncommented once responding to forms is done
        responses: { type: Array, default: [] },
        respondants: { type: Array, default: [] },
    */

    contributors: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'missing author of the form'],
        ref: 'user-accounts'
    }],
    creation_date: {
        type: Date,
        default: new Date()
    },
    modification_date: {
        type: Date
    },
    deletion: {
        type: Boolean,
        default: false
    }
}, {
    strict: false,
    timestamps: true
}); 

export interface IFormsModel extends mongoose.Document{
    name: string
    form_state: string
    author: mongoose.Schema.Types.ObjectId | string;
    questions: any[];
    /*    
    //# will be uncommented once responding to forms is done
        responses: { type: Array, default: [] },
        respondants: { type: Array, default: [] },
    */
    contributors: mongoose.Schema.Types.Array | any; // suppress error while doing array manipulation
    deletion: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
// export forms model after schema compilation
export let formsModel = mongoose.model<IFormsModel>('forms', FormsSchema);

