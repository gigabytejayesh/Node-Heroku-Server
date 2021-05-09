import { APIController } from "../controller/api-controller";

export default function (server: any) {
    let apiController = new APIController();

    server.route({
        method: "GET",
        path: "/",
        options: apiController.getAPIData(),
    });
}
