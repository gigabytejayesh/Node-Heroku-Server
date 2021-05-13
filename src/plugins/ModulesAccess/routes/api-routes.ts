import { APIController } from "../controller/api-controller";

export default function (server: any) {
    let apiController = new APIController();

    server.route({
        method: "GET",
        path: "/",
        options: apiController.getAPIData(),
    });

    server.route({
        method: "GET",
        path: "/import",
        options: apiController.importSchema(),
    });

    server.route({
        method: "POST",
        path: "/{objectClass}",
        options: apiController.createObject(),
    });

    // server.route({
    //     method: "PUT",
    //     path: "/",
    //     options: apiController.updateObjectByID(),
    // });
}
