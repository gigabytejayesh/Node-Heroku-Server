import { Database } from "../../../libraries/database/database";
import { DatabaseAccess } from "../../../libraries/database/database-access";

export class APIService {
    dataAccess = new DatabaseAccess();

    public async importSchema() {
        let schema = [
            "CREATE TABLE IF NOT EXISTS User (ID VARCHAR(255) PRIMARY KEY, MOBILENUMBER INT UNIQUE, FIRST_NAME VARCHAR(255), LAST_NAME VARCHAR(255), EMAIL VARCHAR(255));",
            "CREATE TABLE IF NOT EXISTS Room (ID VARCHAR(255) PRIMARY KEY, MAC_ID VARCHAR(255) UNIQUE, NAME VARCHAR(255) UNIQUE, USER_ID VARCHAR(255) NOT NULL, FOREIGN KEY(USER_ID) REFERENCES User(ID));",
            "CREATE TABLE IF NOT EXISTS Button (ID VARCHAR(255) PRIMARY KEY, NAME VARCHAR(255) UNIQUE, BUTTON_NAME VARCHAR(255) UNIQUE, BUTTON_ICON_FAMILY VARCHAR(255) NOT NULL, BUTTON_COLOR VARCHAR(255) NOT NULL, PIN_ID VARCHAR(255) NOT NULL, CURRENT_FLAG VARCHAR(255) NOT NULL, USER_ID VARCHAR(255) NOT NULL, ROOM_ID VARCHAR(255) NOT NULL, FOREIGN KEY(USER_ID) REFERENCES User(ID), FOREIGN KEY(ROOM_ID) REFERENCES Room(ID));",
        ];
        for (const iterator of schema) {
            try {
                await Database.Instance.DB.query(iterator);
                return "Database Schema Imported";
            } catch (error) {
                console.log(error);
                return "Failed to Import Database Schema";
            }
        }
    }

    public async createObject(objectClass: string, objectData: any) {
        let result = await this.dataAccess.createObject(
            objectClass,
            objectData
        );
        return result;
    }
}
