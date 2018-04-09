/*
 This defines the data model of RackHD profiles.
*/
export class File {
    uuid: string;
    version: string;
    sha256: string;
    md5: string;
    filename: string;
    basename: string;
}

export const FILE_URL = {
    getAllUrl: '/files',
    getByIdentifierUrl: '/files/',
    getMetadataUrl: '/files/'
}
