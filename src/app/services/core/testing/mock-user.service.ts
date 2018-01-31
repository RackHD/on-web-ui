import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions, Response } from '@angular/http'; // <-- for future Usage
import { User } from '../../../models/index';
export { User } from '../../../models/index';
import { UserService } from '../user.service';
export { UserService } from '../user.service';

@Injectable()
export class MockUserService extends UserService {
    users: User[] = [];
    userKey="StubUsers";
    loginedUserKey = "loginedUserName";

    existingDefaultUser = "default";

    constructor() {
      super();
    }

    getAllUsers(): User[] {
        return;
    }

    putLoginedUser( username:string){
    }

    getLoginedUser(): string{
        return;
    }

    getUserById(id: number): User{
        return;
    }
    getUserByName(name: string): User {
        return ( name== this.existingDefaultUser ?  new User() : null ) ;
    }

    createUser(user: User) {
    }

    updateUser(user: User) {
    }

    deleteUser( name:string ) {
    }

}
