import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions, Response } from '@angular/http'; // <-- for future Usage
import { User } from '../../models/index';

@Injectable()
export class UserService {
    users: User[] = [];

    private _defaultUsers: User[]= [
      { id:0, username:'rackhd', password:'rackhd', email:'rackhd@emc.com', initialSetupShowed: false},
      { id: 1, username: 'admin', password: 'admin', email: 'admin@aaa.com', initialSetupShowed: false }
    ];

    /* Stub, to store user data in localStorage */
    userKey        = 'StubUsers';
    loginedUserKey = 'loginedUserName';

    constructor() {
        this.getAllUsers();
    }

    private getUsersFromBackend(){
        this.users = [];
        let str = localStorage.getItem(this.userKey);
        this.users = JSON.parse(str);
        if( ! this.users) {
            // json decoder found nothing..
            this.users = [];
        }
        this.users = this.users.concat( this._defaultUsers );
    }

    getAllUsers() {
        this.getUsersFromBackend();
        return this.users;
    }

    putLoginedUser( username:string){
        localStorage.setItem( this.loginedUserKey, username);
    }

    getLoginedUser(): string{
        let uname = localStorage.getItem( this.loginedUserKey);
        return this.getUserByName(uname).username;
    }

    getCurrentUser(): User{
        let uname = localStorage.getItem( this.loginedUserKey);
        return this.getUserByName(uname);
    }

    getUserById(id: number): User {
        return this.users.find( u =>  (u.id == id) ) ;
    }
    getUserByName(name: string):User {
        return  this.users.find( u => { return u.username == name });
    }

    createUser(user: User) {
        user.initialSetupShowed = false;
        this.users.push( user );
        localStorage.setItem( this.userKey , JSON.stringify(this.users));
        this.getUsersFromBackend();
    }

    updateUser(user: User) {
        // FIXME -  the filter doesn't take effect. but the array element does change to new value after filter....
        this.users = this.users.filter( obj => obj.username != user.username ); // remove old user obj
        this.users.push( user ); // add new user obj
        localStorage.setItem( this.userKey , JSON.stringify(this.users));
        this.getUsersFromBackend();
    }

    deleteUser( name:string ) {
        this.users = this.users.filter( obj => obj.username !== name );
        this.getUsersFromBackend();
    }

    private jwt() {
       // PLACE HOLDER
       // reference http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial#user-service-ts
    }
}
