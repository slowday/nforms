import { IUser } from '../src/users/UserSchema';
import { AuthData } from '../src/users/UserModel';

export let password: string = 'metoyoupassword';
export let newUser: IUser = <IUser>{
    name: 'John Waweru',
    email: 'waweruj00@gmail.com',
    phone: '+254714224735',
    gender: 'male'
};
export let authData: AuthData = <AuthData>{
    email: newUser.email,
    password,
    phone: newUser.phone
};
export let updates = {
    email: 'example@domain.net',
    dob: new Date('1997-9-12'),
    password: 'qweerttyuuiop'
};
    