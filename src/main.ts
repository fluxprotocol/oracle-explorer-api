import { ApolloServer, gql } from 'apollo-server-express';
import { Db } from 'mongodb';
import express from 'express';

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
        ],
        resolvers: [
            dataRequest.resolvers,
            oracleConfig.resolvers,
            resolutionWindow.resolvers,
            transactions.resolvers,
            whitelist.resolvers,
            userStake.resolvers,
            account.resolvers,
        ],
        tracing: true,
        debug: true,
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

    const proxy = httpProxy.createProxyServer({});

    app.get('/proxy/', (req, res) => {
        try {
            const url = req.query.url;
            console.log(url);
            proxy.web(req, res, { target: url }, () => {
                res.status(500).send('Server error');
            });

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
