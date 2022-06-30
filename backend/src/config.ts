
export interface envTS {
    [key: string]: {
        [key: string]: (number | string)
    },
}

const env: envTS = {
    dev: {
        port: 3001,
        evnName: 'dev env',

        user: 'admin',
        host: 'localhost',
        database: 'infotech_test_db',
        dbPassword: "789",
        dbPort: 5432,
        dbSecretKey: 'LbSxPF9WPYEpIqYWkk36Haq0RYNBEXuY',
    },

    prod: {
        port: 5000,
        evnName: 'prod env',

        user: 'admin',
        host: 'localhost',
        database: 'infotech_test_db',
        dbPassword: "789",
        dbPort: 5432,
        dbSecretKey: 'LbSxPF9WPYEpIqYWkk36Haq0RYNBEXuY',
    },
}


export const currentEnv = typeof (process.env.NODE_ENV) === 'string' ? env[process.env.NODE_ENV.toLowerCase()] : env.dev