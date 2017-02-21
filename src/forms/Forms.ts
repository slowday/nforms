/**
 * created by waweru
*/

import * as express from 'express';
import * as _ from 'lodash';
import Auth from '../auth';
import { 
    FormsModel, 
    FormContributors,
    formUser
} from './FormsModel';

export class Form extends FormsModel{
    
    public router: express.Router = express.Router();

    public constructor() {
        super();

        //#test route
        this.router.get('/test', (request: express.Request, response: express.Response, next: express.NextFunction) => {
            response.json({
                name: 'zushar-api',
                message: 'Hello! Welcome to zushar api. You are at the forms module section of the api',
                timestamp: new Date().toDateString()
            });
        })
        //#contributors endpoints
        let miniRouter: express.Router = express.Router();
        miniRouter.post('/:form_id', this._addContributor);
        miniRouter.get('/:form_id', this._getContributors);
        miniRouter.delete('/:form_id', this._removeContributor);

        //#install routes
        this.router.use(Auth.authJWT, Auth.getLoggedInUser);
        this.router.use('/contributor', miniRouter);
        this.router.post('/', this._createForm);
        this.router.get('/', this._getAllForms);
        this.router.get('/form_id/:form_user_type', this._getOneForm);
        this.router.put('/form_id/:form_user_type', this._updateForm);
        this.router.delete('/form_id/:form_user_type', this._removeForm);
    }

    private _createForm(request: any, response: express.Response, next: express.NextFunction): void {
        /* *
         * @body: form<Object>
        */
        super.createForm(
            _.assign({}, request.body.form, {
                author: request.zushar_auth.id,
                contributors: []
            })
        )
        .then((data) => {
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _getAllForms(request: any, response: express.Response, next: express.NextFunction): void {
        super
        .getAllForms()
        .then((data)=>{
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _getOneForm(request: any, response: express.Response, next: express.NextFunction) {
        /* *
         * @param: form_id, form_user_type
        */

        // implement the form user validation data structure
        let form_auth: formUser = {
            account_id: request.zushar_auth.id,
            account: request.params.form_user_type
        };
        super.getOneForm(
            request.params.form_id,
            form_auth
        )
        .then((data)=>{
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _updateForm(request: any, response: express.Response, next: express.NextFunction): void {
        /* *
         * @param: form_id, form_user_type
         * @body: updates<Object>
        */

        // implement the form user validation data structure
        let form_auth: formUser = {
            account_id: request.zushar_auth.id,
            account: request.params.form_user_type
        };
        super.updateForm(
            request.params.form_id, 
            form_auth,
            request.body.updates
        )
        .then((data)=>{
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _removeForm(request: any, response: express.Response, next: express.NextFunction): void {
        /* *
         * @param: form_id, form_user_type
        */
        super.deleteForm(
            request.params.form_id, 
            request.zushar_auth.id
        )
        .then((data)=>{
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _addContributor(request: any, response: express.Response, next: express.NextFunction): void {
        /* *
         * @param: form_id
         * @body: payload
        */
        FormContributors.addContributor(
            request.params.form_id,
            request.zushar_auth.id,
            request.body.payload
        )
        .then((data)=>{
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _getContributors(request: any, response: express.Response, next: express.NextFunction): void {
        /* *
         * @param: form_id
        */
        FormContributors.getContributors(
            request.params.form_id
        )
        .then((data)=>{
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _removeContributor(request: any, response: express.Response, next: express.NextFunction): void {
        /* *
         * @param: form_id, form_user_type
         * @body: contributor
        */
        FormContributors.removeContributor(
            request.params.form_id,
            request.zushar_auth.id,
            request.body.contributor
        )
        .then((data)=>{
            response.json(data);
        })
        .catch((err: Error) => {
            next(err);
        });
    }
}