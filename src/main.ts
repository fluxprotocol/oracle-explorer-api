import { ApolloServer, gql } from 'apollo-server-express';
import { Db } from 'mongodb';
import express from 'express';
import fetch from 'node-fetch';

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

import bootDatabase from './database';
import { APP_PORT } from './constants';

// @ts-ignore
import httpProxy from 'http-proxy';
import bodyParser from 'body-parser';

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
        ],
        tracing: false,
        debug: false,
        context: {
            db: database,
        }
    });

    const app = express();
    server.applyMiddleware({ app });
    app.use(express.static('public', {
        setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
    }));

    app.use(bodyParser.json());

    const proxy = httpProxy.createProxyServer({});

    app.options('/proxy/', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.status(200).send();
    });

    app.post('/proxy/', async (req, res) => {
        try {
            const url = req.query.url as string;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');

            const result = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: {
                    'Content-type': "application/json"
                }
            });

            const body = await result.text();
            res.status(result.status).send(body);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });

    app.listen(APP_PORT, () => {
        console.info(`🚀 GraphQL listening on ${process.env.APP_PORT}`);
    });
}

main();
