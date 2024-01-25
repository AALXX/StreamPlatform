import { Client, auth } from 'cassandra-driver';
import config from './config';

let client = new Client({
    contactPoints: config.scylla.contactPoints, // Replace with your ScyllaDB node's IP or hostname
    localDataCenter: config.scylla.localDataCenter, // Replace with your local data center name
    keyspace: config.scylla.keyspace,
});

/**
 * Connect to ScyllaDB
 */
const SCYconnect = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error('Connection error', error);
        setTimeout(() => {
            client = new Client({
                contactPoints: config.scylla.contactPoints, // Replace with your ScyllaDB node's IP or hostname
                localDataCenter: config.scylla.localDataCenter, // Replace with your local data center name
                keyspace: config.scylla.keyspace,
            });
        }, 5000);
    }
};

/**
 * Execute query
 * @param {string} query
 * @returns
 */
async function SCYquery(query: string) {
    try {
        const result = await client.execute(query);
        // console.log('Query result:', result.rows);
        return result;
    } catch (error) {
        console.error('Query error', error);
    }
}

export { SCYconnect, SCYquery };
