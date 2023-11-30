import mysql from 'mysql';
import config from './config';
import logging from './logging';

const params = {
    multipleStatements: true,
    user: config.mysql.user,
    password: config.mysql.password,
    host: config.mysql.host,
    database: config.mysql.database,
};

const createPool = () => {
    const pool = mysql.createPool({
        connectionLimit: 10, // Adjust the connection limit as needed
        multipleStatements: true,
        user: config.mysql.user,
        password: config.mysql.password,
        host: config.mysql.host,
        database: config.mysql.database,
    });

    // Optional: Handle connection errors
    pool.on('error', (err) => {
        console.error('MySQL Pool Error:', err.message);
    });

    return pool;
};

const query = async (pool: mysql.Pool, queryString: string, values?: any[]): Promise<any> => {
    const NAMESPACE='MYSQL_QUERY_FUNC'
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            connection.query(queryString, values, (queryErr, result) => {
                connection.release();

                if (queryErr) {
                    logging.error(NAMESPACE, queryErr.message);
                    reject(queryErr);
                    return;
                }

                resolve(result);
            });
        });
    });
};


/**
 * connects to an sql server
 * @return {Promise<mysql.Connection>}
 */
const oldConnect = async () =>
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

/**
 * query an sql string
 * @param {mysql.Connection} connection
 * @param {string} query
 * @returns
 */
const oldQuery = async (connection: mysql.Connection, query: string) =>
    new Promise((resolve, reject) => {
        connection.query(query, connection, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });

export { oldConnect, oldQuery, query, createPool };
