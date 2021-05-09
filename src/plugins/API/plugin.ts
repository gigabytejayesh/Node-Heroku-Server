import * as Hapi from "@hapi/hapi";
import apiRoute from "./routes/api-routes";

exports.plugin = {
    register: async (server: Hapi.Server, options: any) => {
        try {
            apiRoute(server);
            console.log("API plugin registered successfully.");
        } catch (error) {
            console.log("Error occur while registering API plugin.", error);
        }
    },
    name: "API plugin",
    version: "1.0.0",
};
