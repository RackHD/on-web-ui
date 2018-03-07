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
    getAllTemplates: '/profiles/metadata',
    templateByName: '/profiles/library/',
}
