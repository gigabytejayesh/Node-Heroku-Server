import { Client } from "pg";

const Path = require("path");

/**
 * Singleton class to configure and expose postgreSQL client.
 *
 * @export
 * @class Database
 */
export class Database {
    private static _instance: Database;
    private db: any;
    private configured: boolean;

    private constructor() {
        this.configured = false;
    }

    /**
     * Get instance of Database class
     *
     * @readonly
     * @static
     * @memberof Database
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /**
     * Get database connection instance.
     *
     * @readonly
     * @type {Client} - PG client instance
     * @memberof Database
     */
    public get DB(): Client {
        if (this.configured) {
            return this.db;
        } else {
            throw new Error("The database connector is not configured.");
        }
    }

    /**
     * Configure database
     *  - Check database exist or not.
     *  - If exits return PG clint connection instance
     *  - If not exist then create database schema using notification-schema.sql.
     *      - Do not add any comments in sql file
     *
     * @param {*} dbConfiguration - Database connection values
     *                              - Eg.
     *                                  {
     *                                      host: 'database host',
     *                                      port: 'database port',
     *                                      database: 'database name',
     *                                      user: 'database username',
     *                                      password: 'database password'
     *                                  };
     * @returns {Promise<any>}
     * @memberof Database
     */
    public async configure(dbConfiguration: any): Promise<any> {
        if (!this.configured) {
            try {
                //Connect with database
                return await this.getConnection(dbConfiguration);
            } catch (error) {
                console.log(`Failed to create database.`, {
                    error: error,
                });
                throw error;
            }
        } else {
            throw new Error("The database connector is already configured.");
        }
    }

    /**
     * Connect to postgreSQL database.
     *  - Initialize the connection instance
     *
     * @private
     * @param {DatabaseConfig} configuration - Database connection values
     * @returns Client - PG connection
     * @memberof Database
     */
    private async getConnection(configuration: any): Promise<any> {
        try {
            let client = new Client(configuration);
            await client.connect();
            this.db = client;
            this.configured = true;
            return client;
        } catch (error) {
            if (error.code === "ECONNREFUSED") {
                console.log("Waiting for db host.");
                // database server is down, wait for database host to be up
                await new Promise(done =>
                    setTimeout(function () {
                        done(true);
                    }, 10000)
                );
                console.log("Checking again for database host connection.");
                return await this.getConnection(configuration);
            }
            throw error;
        }
    }
}
