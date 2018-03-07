/*
 This defines the data model of RackHD profiles.
*/
export class File {
    id: string;
    name: string;
    hash: string;
    scope: string;
}

export const FILE_URL = {
    getAllfiles: '/files',
    filesById: '/files/',
}
