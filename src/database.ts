import { MongoClient, Db } from 'mongodb';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from './constants';

export default async function bootDatabase(): Promise<Db> {
    const mongoUrl = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
    const connection = await MongoClient.connect(mongoUrl, {
        useUnifiedTopology: true,
    });

    return connection.db(DB_NAME);
}
