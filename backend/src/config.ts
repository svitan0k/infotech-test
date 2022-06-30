
export interface envTS {
    [key: string]: {
        [key: string]: (number | string)
    },
}

const env: envTS = {
    dev: {
        httpPort: 3001,
        httpsPort: 3002,
        webSocketPort: 3003,
        evnName: 'dev env',

        // db credentials
        user: 'admin',
        host: 'localhost',
        database: 'infotech',
        dbPassword: "789",
        dbPort: 5432,
        dbSecretKey: 'LbSxPF9WPYEpIqYWkk36Haq0RYNBEXuY',
    },

    // the values are the same, but this is file is just for demonstration anyway
    prod: {
        httpPort: 3001,
        httpsPort: 3002,
        webSocketPort: 3003,
        evnName: 'prod env',

        // db credentials
        user: 'admin',
        host: 'localhost',
        database: 'infotech',
        dbPassword: "789",
        dbPort: 5432,
        dbSecretKey: 'LbSxPF9WPYEpIqYWkk36Haq0RYNBEXuY',
    },
}


export const currentEnv = typeof (process.env.NODE_ENV) === 'string' ? env[process.env.NODE_ENV.toLowerCase()] : env.dev