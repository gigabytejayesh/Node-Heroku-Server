import { Database } from "./database";

export class DatabaseAccess {
    constructor() {}

    public async createObject(table: string, data: any) {
        try {
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
}
