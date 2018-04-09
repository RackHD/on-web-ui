/*
 This defines the data model of Node's catalog.
*/
export class Catalog {
    id: string;
    node: string;
    source: string;
    data: any; // {} or []
}

export const CATALOG_URL = {
    getAllUrl: '/catalogs',
    getByIdentifierUrl: '/catalogs/',
}
