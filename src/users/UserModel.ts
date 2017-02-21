/**
 * created by waweru
*/

import { IUserModel, userModel as db } from './UserSchema';

export type editedUser =  {
    done: boolean; 
    user: IUserModel | null;
};

export type User = {
    user: IUserModel  
    jwt_token: string;
};

export class UserModel {
    /**
     * @docs:
     *     user module model for dealing with user related data and data manipulation plus storage
    */
    protected registerUser(): User {
        return <User>{};
    }
    protected loginUser(): User {
        return <User>{};
    }
    protected updateUser(): editedUser {
        return <editedUser>{};
    }
    protected diableUser(): editedUser {
        return <editedUser>{};
    }
    
    static getOneUser(): IUserModel {
        return <IUserModel>{};
    }
}