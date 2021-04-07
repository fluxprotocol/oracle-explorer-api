import { gql } from 'apollo-server';

const typeDef = gql`
    type OutcomeStake {
        id: String
        data_request_id: String
        round: Int
        outcome: String
        total_stake: String
    }
`;

export default typeDef;
