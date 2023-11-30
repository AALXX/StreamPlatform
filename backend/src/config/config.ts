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


//* Scylla Config
const SCYLLA_HOST: string[] = [(process.env.SCYLLA_HOST as string) || '0.0.0.0'];
const SCYLLA_DATAC_CENTER:string = process.env.SCYLLA_DATAC_CENTER || 'datacenter1';
const SCYLLA_KEY_SPACE:string = process.env.SCYLLA_KEY_SPACE || 'gh_platform';

const SCYLLA = {
    contactPoints: SCYLLA_HOST,
    localDataCenter: SCYLLA_DATAC_CENTER,
    keyspace: SCYLLA_KEY_SPACE,
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
    scylla: SCYLLA,
    server: SERVER,
};

export default config;
