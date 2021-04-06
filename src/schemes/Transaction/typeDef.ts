import { gql } from 'apollo-server';

const typeDef = gql`
    type Transaction {
        account_id: String
        input: String
        output: String
        data_request_id: String
        round: Int
        date: String
        block_height: String
        extra_info: String
        type: String
    }

    type TransactionPaginationResult {
        items: [Transaction]
        total: Int
    }

    extend type Query {
        getTransaction(id: String!): Transaction
        getTransactions(limit: Int, offset: Int): TransactionPaginationResult
    }
`;

export default typeDef;
