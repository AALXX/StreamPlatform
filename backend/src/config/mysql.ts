import mysql from 'mysql';
import config from './config';

const params = {
    multipleStatements: true,
    user: config.mysql.user,
    password: config.mysql.password,
    host: config.mysql.host,
    database: config.mysql.database,
};

const connect = async () =>
    new Promise<mysql.Connection>((resolve, reject) => {
        const connection = mysql.createConnection(params);
        connection.connect((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(connection);
        });
    });

const query = async (connection: mysql.Connection, query: string) =>
    new Promise((resolve, reject) => {
        connection.query(query, connection, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });

export { connect, query };
