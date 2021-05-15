import { APIController } from "../controller/api-controller";

export default function (server: any) {
    let apiController = new APIController();

    server.route({
        method: "GET",
        path: "/{file*}",
        handler: {
            directory: {
                path: "public",
            },
        },
    });

    server.route({
        method: "GET",
        path: "/api/import",
        options: apiController.importSchema(),
    });

    server.route({
        method: "POST",
        path: "/api/{objectClass}",
        options: apiController.createObject(),
    });

    server.route({
        method: "PUT",
        path: "/api/{objectClass}/{objectID}",
        options: apiController.updateObjectByID(),
    });

    server.route({
        method: "GET",
        path: "/api/{objectClass}/{objectID}",
        options: apiController.getObjectByID(),
    });
}
