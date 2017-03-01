/**
 * created by waweru
*/

import * as express from 'express';
import * as _ from 'lodash';
import Auth from '../auth';
import { 
    Forms, 
    FormContributors,
    formUser
} from './FormsModel';

export class Form{
    
    public router: express.Router = express.Router();

    public constructor() {
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
        miniRouter.post('/:id', this._addContributor);
        miniRouter.get('/:id', this._getContributors);
        miniRouter.delete('/:id', this._removeContributor);

        //#install routes
        this.router.use(Auth.authJWT, Auth.getLoggedInUser);
        this.router.post('/', this._createForm);
        this.router.get('/', this._getAllForms);
        this.router.get('/:id', this._getOneForm);
        this.router.put('/:id', this._updateForm);
        this.router.delete('/:id', this._removeForm);
        this.router.use('/contributors', miniRouter);
    }

    private _createForm(request: any, response: express.Response, next: express.NextFunction): void {
        //@body: form<Object>
        Forms.create(
            _.assign({}, request.body.form, {
                author: request.zushar_auth.id,
                contributors: []
            })
        )
        .then((data) => {
            response.json({
                message: `${data.name} is created successfully`,
                timestamp: new Date().toDateString(),
                form: data
            });
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _getAllForms(request: any, response: express.Response, next: express.NextFunction): void {
        Forms
        .getAll()
        .then((data)=>{
            response.json({
                message: `${data.length} forms retrieved`,
                timestamp: new Date().toDateString(),
                forms: data
            });
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _getOneForm(request: any, response: express.Response, next: express.NextFunction): void {
        //@param: id
        //@query: user_type
        let form_auth: formUser = {
            account_id: request.zushar_auth.id,
            account: <string>request.query.user_type
        };

        Forms.getOne(
            request.params.id,
            form_auth
        )
        .then((data)=>{
            if (!_.isNull(data)) {
                response.json({
                    message: `${data.name} is retrieved`,
                    timestamp: new Date().toDateString(),
                    form: data
                });
            }
            else {
                response.json({
                    message: `Could not retrieve requested form`,
                    timestamp: new Date().toDateString(),
                    form: null
                });
            }
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _updateForm(request: any, response: express.Response, next: express.NextFunction): void {
        //@param: id
        //@query: user_type
        //@body: updates<Object>
        let form_auth: formUser = {
            account_id: request.zushar_auth.id,
            account: request.query.user_type
        };
        Forms.update(
            request.params.id, 
            form_auth,
            request.body.updates
        )
        .then((data)=>{
            response.json({
                message: `${data.name} is retrieved`,
                timestamp: new Date().toDateString(),
                form: data
            });
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _removeForm(request: any, response: express.Response, next: express.NextFunction): void {
        //@param: id
        Forms.remove(
            request.params.id, 
            request.zushar_auth.id
        )
        .then((data)=>{
            response.json({
                message: `form deleted`,
                timestamp: new Date().toDateString(),
                data
            });
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _addContributor(request: any, response: express.Response, next: express.NextFunction): void {
        //@param: form_id
        //@body: payload
        FormContributors.add(
            request.params.id,
            request.zushar_auth.id,
            request.body.contributor
        )
        .then((data)=>{
            response.json({
                message: `Contributors list had an addition`,
                timestamp: new Date().toDateString(),
                contributors: data
            });
        })
        .catch((err: Error) => {
            next(err);
        });
    }

    private _getContributors(request: any, response: express.Response, next: express.NextFunction): void {
        /* *
         * @param: form_id
        */
        FormContributors.getAll(
            request.params.id
        )
        .then((data)=>{
            response.json({
                message: `retrieved ${data.length} contributors`,
                timestamp: new Date().toDateString(),
                contributors: data
            });
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
        FormContributors.remove(
            request.params.id,
            request.zushar_auth.id,
            request.body.contributor
        )
        .then((data)=>{
            response.json({
                message: `contributor list shrinked`,
                timestamp: new Date().toDateString(),
                contributors: data
            });
        })
        .catch((err: Error) => {
            next(err);
        });
    }
}