import { Database } from "./database";
import { v4 as uuidv4 } from "uuid";
export class DatabaseAccess {
    constructor() {}

    public async createObject(table: string, data: any) {
        try {
            if (!data.ID || !data.id) {
                data["id"] = uuidv4();
            }
            //Validate the uuid if exists for any object
            let isExist = await this.getObjectByID(table, data["id"], "*");
            if (isExist) {
                throw new Error(`Object already exist for ID ${data["id"]}`);
            }
            let objectToAdd = this.getDataCreate(data);
            const query = `INSERT INTO "${table}"(${objectToAdd.keys}) VALUES(${objectToAdd.placeHolders}) RETURNING * `;
            console.log(`Database: createObject`, { query: query });
            let insertedObject = await Database.Instance.DB.query(
                query,
                objectToAdd.values
            );
            return insertedObject["rows"][0];
        } catch (error) {
            console.log(`Error in createObject`, { error: error });
            throw error;
        }
    }

    private getDataCreate(data: any) {
        let objectKeys: string[] = Object.keys(data);
        let placeHolders: string[] = [];
        let values = [];
        let keys = [];
        for (let index = 0; index < objectKeys.length; index++) {
            let key = objectKeys[index];
            keys.push(`"${key}"`);
            placeHolders.push(`$${index + 1} `);
            values.push(data[key]);
        }
        return {
            placeHolders,
            keys,
            values,
        };
    }

    public async getObjectByConditions(
        table: string,
        projection: string,
        condition?: string,
        joins?: string,
        parentAliasName?: string
    ) {
        try {
            //set default values
            let filter: string = condition ? `WHERE ${condition}` : "";
            projection = projection || "*";
            //build query
            joins = joins || ``;
            //build query
            if (parentAliasName) {
                parentAliasName = `AS ${parentAliasName}`;
            } else {
                parentAliasName = ``;
            }
            const query = `SELECT ${projection} FROM "${table}" ${parentAliasName} ${joins} ${filter};`;
            console.log(`getObjectByConditions:`, { query });
            let data = await Database.Instance.DB.query(query);
            let result: any;
            result["data"] = data.rows;
            //Get count if demand by user
            return result;
        } catch (error) {
            console.log(`Error in getObjectByConditions`, {
                error: error,
            });
            throw error;
        }
    }

    public async getObjectByID(
        table: string,
        objectID: string,
        projection?: any
    ) {
        if (!projection) {
            projection = "*";
        }
        let query = `SELECT ${projection} FROM ${table} WHERE "id" = ${objectID}`;
        console.log("getObjectByID", query);
        let result = await Database.Instance.DB.query(query);
        return result["rows"][0];
    }

    public async updateObjectByID(table: string, objectID: any, data: any) {
        try {
            let updates = this.getDataForUpdate(data);
            let condition = `"id" = ${objectID}`;
            const query = `UPDATE "${table}" SET ${updates} WHERE ${condition} RETURNING *; `;
            console.log(`Update Object by ID: `, query);
            let updatedObject = await Database.Instance.DB.query(query);
            return updatedObject["rows"][0];
        } catch (error) {
            console.log("Error occur while querying updateObjectByID", error);
            throw error;
        }
    }

    private getDataForUpdate(data: any): string[] {
        let objectKeys: string[] = Object.keys(data);
        let updates = [];
        for (let index = 0; index < objectKeys.length; index++) {
            let key = objectKeys[index];
            let value = data[key];
            if (Array.isArray(value)) {
                let elements = [];
                let elementType = typeof value[0];
                if (elementType === "object") {
                    for (let element of value) {
                        elements.push(`'${JSON.stringify(element)}'`);
                    }
                    updates.push(`"${key}" = ARRAY[${elements}]:: json[]`);
                } else {
                    for (let element of value) {
                        elements.push(`"${element}"`);
                    }
                    updates.push(`"${key}" = '{${elements}}'`);
                }
            } else if (typeof value === "number") {
                updates.push(`"${key}" = ${value} `);
            } else {
                //TODO: need to handle apostrophe. use reference from escape characters from string utils if it is string.
                updates.push(`"${key}" = '${value}'`);
            }
        }
        return updates;
    }
}
