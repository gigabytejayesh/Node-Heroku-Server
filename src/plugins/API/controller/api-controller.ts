import * as Hapi from "@hapi/hapi";

export class APIController {
    public getAPIData(): Hapi.RouteOptions {
        return {
            handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                return "Hello Forks, Welcome to SmartHM server";
            },
        };
    }
}
