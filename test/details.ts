import { IUser } from '../src/users/UserSchema';
import { AuthData } from '../src/users/UserModel';

export let password: string = 'metoyoupassword';
export let authorUser: IUser = <IUser>{
    name: 'John Waweru',
    email: 'waweruj00@gmail.com',
    phone: '+254-714224735',
    gender: 'male'
};
export let authorAuthData: AuthData = <AuthData>{
    email: authorUser.email,
    password,
    phone: authorUser.phone
};
export let contributorUser: IUser = <IUser>{
    name: 'Lola Vivian',
    email: 'lol.v90@gmail.com',
    phone: '+101-71430135',
    gender: 'female'
};
export let contributorAuthData: AuthData = <AuthData>{
    email: contributorUser.email,
    password,
    phone: contributorUser.phone
};