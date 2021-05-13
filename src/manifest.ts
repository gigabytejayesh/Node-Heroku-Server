const Config = require("config");

export = {
    server: {
        // host: process.env.HOST || process.env.host || "smart-hm.herokuapp.com",
        port: process.env.PORT,
        // host: "localhost",
        // port: 8080,
    },
    register: {
        plugins: [
            "@hapi/inert",
            "@hapi/vision",
            {
                plugin: "./build/plugins/ModulesAccess/plugin",
            },
        ],
    },
};
