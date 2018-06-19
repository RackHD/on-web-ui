/*
 This defines the data model of RackHD profiles.
*/
export class Profile {
    id: string;
    name: string;
    hash: string;
    scope: string;
}

export const PROFILE_URL = {
    getAllUrl: '/profiles/metadata',
    getByIdentifierUrl: '/profiles/library/',
    getMetadataUrl: '/profiles/metadata/'
}
