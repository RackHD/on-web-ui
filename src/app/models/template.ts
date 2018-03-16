/*
 This defines the data model of RackHD templates.
*/
export class Template {
    id: string;
    name: string;
    hash: string;
    scope: string;
}

export const TEMPLATE_URL = {
    getAllUrl: '/templates/metadata',
    getByIdentifierUrl: '/templates/library/',
    getMetadataUrl: '/templates/metadata/',
}
