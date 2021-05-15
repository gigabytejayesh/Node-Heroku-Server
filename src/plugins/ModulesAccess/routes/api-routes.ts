import { APIController } from "../controller/api-controller";

export default function (server: any) {
    let apiController = new APIController();

    // server.views({
    //     engines: {
    //         html: require("handlpoebars"),
    //     },
    //     relativeTo: __dirname,
    //     path: "../../../../public",
    // });

    server.route({
        method: "GET",
        path: "/{file*}",
        handler: {
            directory: {
                path: "public",
            },
        },
        // options: apiController.getAPIData(),
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
