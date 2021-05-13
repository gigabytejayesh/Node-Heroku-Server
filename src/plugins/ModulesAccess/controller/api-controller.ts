import * as Hapi from "@hapi/hapi";
import * as Joi from "joi";
import { APIService } from "../services/api-services";

export class APIController {
    apiService = new APIService();

    public getAPIData(): Hapi.RouteOptions {
        return {
            handler: (request: Hapi.Request, h: any) => {
                // return "Hello Forks, Welcome to SmartHM server";
                return h.file("./public/index.html");
            },
        };
    }

    public importSchema(): Hapi.RouteOptions {
        return {
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                return await this.apiService.importSchema();
            },
            tags: ["api", "ModulesAccess", "GET"],
            description: "Import Database Schema",
        };
    }

    public createObject(): Hapi.RouteOptions {
        return {
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                let objectData = request.payload;
                let objectClass = request.params.objectClass;
                let result = await this.apiService.createObject(
                    objectClass,
                    objectData
                );
                return result;
            },
            validate: {
                payload: Joi.object(),
                params: Joi.object({
                    objectClass: Joi.string()
                        .required()
                        .description("Table name"),
                }),
            },
            tags: ["api", "ModulesAccess", "POST"],
            description: "Create new object",
        };
    }

    public updateObjectByID(): Hapi.RouteOptions {
        return {
            handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                return "UPDATE OBJECT BY ID";
            },
            tags: ["api", "ModulesAccess", "PUT"],
            description: "Update object by ID",
        };
    }
}

// {
//     objectData: Joi.object().description("Object data"),
// }
