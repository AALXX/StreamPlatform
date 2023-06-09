import dotenv from 'dotenv';

dotenv.config();

//* MySql Config
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'stream_platform';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';

const MYSQL = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
};

//* API config
const SERVER_HSOTNAME = process.env.SERVER_HSOTNAME || 'localhost';
const SERVER_PORT = process.env.PORT || 7000;

const SERVER = {
    hostname: SERVER_HSOTNAME,
    port: SERVER_PORT,
};

const config = {
    mysql: MYSQL,
    server: SERVER,
};

export default config;
