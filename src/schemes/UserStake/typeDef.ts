import { gql } from 'apollo-server';

const typeDef = gql`
    type UserStake {
        id: String
        data_request_id: String
        round: Int
        outcome: String
        account_id: String
        total_stake: String

        data_request: DataRequest
    }

    type UserStakePaginationResult {
        items: [UserStake]
        total: Int
    }

    extend type Query {
        getUserStakesByRequestId(id: String!, accountId: String): [UserStake]
        getUserStakes(accountId: String!, limit: Int, offset: Int): UserStakePaginationResult
        getUnclaimedStakes(accountId: String!): [UserStake]
    }
`;

export default typeDef;
