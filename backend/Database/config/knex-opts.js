const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_HOST } = process.env;
console.log({ DB_NAME, DB_USERNAME, DB_PORT, DB_HOST });

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_NAME
        },
        debug:false,
    },
    production: {
        client: 'pg',
        connection: {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_NAME
        },
        debug:false,
    }
};