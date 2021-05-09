const Config = require("config");
const Package = require("../package.json");
import { compose } from "@hapi/glue";
import * as Hapi from "@hapi/hapi";

export class Server {
    public async startHapiServer() {
        const options = {
            relativeTo: __dirname + "/..",
        };
        const Manifest = require("./manifest");
        const server = await compose(Manifest, options);
        await this.onGlueComposeCompleted(server);
        return server;
    }

    public async onGlueComposeCompleted(server: Hapi.Server) {
        await server.initialize();
        if (!this.start) {
            return;
        }
        await server.start();
        this.logServerDetails(server);
        server.events.on("response", (request: any) => {
            console.log(
                `${
                    request.info.remoteAddress
                }: ${request.method.toUpperCase()}  ${
                    request.url.path || request.url.pathname
                } --> ${request.response.statusCode}`
            );
        });
    }

    public async start() {
        try {
            // await this.connectToDB();
            return await this.startHapiServer();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async connectToDB() {
        // let dbConfiguration = {
        //     name: Config.DB_NAME,
        //     host: Config.DB_HOST, // server name or IP address;
        //     port: Config.DB_PORT,
        // };
        // await Database.Instance.configure(dbConfiguration);
    }

    private logServerDetails(server: Hapi.Server) {
        console.log("====================================================");
        console.log(`Server: ${Package.name}`);
        console.log(`Version: ${Package.version}`);
        console.log(`Server running at: ${server.info.uri}`);
        console.log("====================================================");
    }
}

if (!module.parent) {
    startServer();
}

async function startServer() {
    try {
        let server: Server = new Server();
        server.start();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
