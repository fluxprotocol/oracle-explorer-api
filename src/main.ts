import { ApolloServer, gql } from 'apollo-server-express';
import { Db } from 'mongodb';
import express from 'express';
// @ts-ignore
import s3Proxy from 's3-proxy';

import * as analytics from './schemes/Analytics';
import * as dataRequest from './schemes/DataRequest';
import * as oracleConfig from './schemes/OracleConfig';
import * as resolutionWindow from './schemes/ResolutionWindow';
import * as userStake from './schemes/UserStake';
import * as outcomeStake from './schemes/OutcomeStake';
import * as transactions from './schemes/Transaction';
import * as whitelist from './schemes/WhitelistItem';
import * as account from './schemes/Account';
import * as claim from './schemes/Claim';
import * as validator from './schemes/Validators';

import bootDatabase from './database';
import { APP_PORT } from './constants';

export interface Context {
    db: Db;
}

async function main() {
    console.info('🚀 Booting GraphQL server..');

    const database = await bootDatabase();    
    const typeDef = gql`
        type Query
    `;

    const server = new ApolloServer({
        uploads: true,
        typeDefs: [
            typeDef,
            dataRequest.typeDef,
            oracleConfig.typeDef,
            resolutionWindow.typeDef,
            userStake.typeDef,
            outcomeStake.typeDef,
            transactions.typeDef,
            whitelist.typeDef,
            account.typeDef,
            claim.typeDef,
            analytics.typeDef,
            validator.typeDef,
        ],
        resolvers: [
            dataRequest.resolvers,
            oracleConfig.resolvers,
            resolutionWindow.resolvers,
            transactions.resolvers,
            whitelist.resolvers,
            userStake.resolvers,
            account.resolvers,
            analytics.resolvers,
            validator.resolvers,
        ],
        tracing: false,
        debug: false,
        context: {
            db: database,
        }
    });

    const app = express();
    server.applyMiddleware({ app });

    app.get('/*', (req, res, next) => {
        // Fix issue where query params could crash s3proxy
        if (req.originalUrl.includes('?')) {
            req.originalUrl = '';
        }

        return s3Proxy({
            bucket: process.env.S3_BUCKET_NAME,
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET,
            overrideCacheControl: 'max-age=100000',
            defaultKey: 'index.html'
        })(req, res, next);
    });

    app.listen(APP_PORT, () => {
        console.info(`🚀 GraphQL listening on ${process.env.APP_PORT}`);
    });
}

main();
