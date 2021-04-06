import { gql } from 'apollo-server';

const typeDef = gql`
    type ResolutionWindow {
        id: String
        dr_id: String
        round: Int
        end_time: String
        bond_size: String
        # bonded_outcome: IETS
        date: String
        block_height: String

        outcome_stakes: [OutcomeStake]
        user_stakes: [UserStake]
    }
`;

export default typeDef;
