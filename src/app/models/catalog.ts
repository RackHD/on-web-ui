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
    catalogs: '/catalogs',
    catalogsById: '/catalogs/',
}