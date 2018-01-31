/*
 This defines the data model of web user.
*/
export class User {
    id: number;
    username:  string;
    password:  string;
    email:     string;
    otherInfo?: string;
    initialSetupShowed: boolean;
}
