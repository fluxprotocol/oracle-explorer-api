import { MongoClient, Db } from 'mongodb';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from './constants';
import { DataRequest } from './models/DataRequest';
import { DATA_REQUEST_COLLECTION_NAME } from './services/DataRequestService';

export default async function bootDatabase(): Promise<Db> {
    const mongoUrl = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
    const connection = await MongoClient.connect(mongoUrl, {
        useUnifiedTopology: true,
    });

    const db = connection.db(DB_NAME);

    await db.collection<DataRequest>(DATA_REQUEST_COLLECTION_NAME).createIndex({
        date: 1,
        requester_account_id: 1,
        finalized_outcome: 1,
    })

    return db;
}
