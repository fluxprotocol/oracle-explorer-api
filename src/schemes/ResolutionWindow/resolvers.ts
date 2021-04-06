import { Context } from "../../main";
import { OutcomeStake } from "../../models/OutcomeStake";
import { ResolutionWindow } from "../../models/ResolutionWindow";
import { UserStake } from "../../models/UserStake";
import { queryOutcomeStakes } from "../../services/OutcomeStakeService";
import { queryUserStakes } from "../../services/UserStakesService";

export default {
    ResolutionWindow: {
        outcome_stakes: async (parent: ResolutionWindow, args: {}, context: Context): Promise<OutcomeStake[]> => {
            if (parent.outcome_stakes) {
                return parent.outcome_stakes;
            }

            return queryOutcomeStakes(context.db, {
                data_request_id: parent.dr_id,
                round: parent.round,
            }).toArray();
        },
        
        user_stakes: async (parent: ResolutionWindow, args: {}, context: Context): Promise<UserStake[]> => {
            if (parent.user_stakes) {
                return parent.user_stakes;
            }

            return queryUserStakes(context.db, {
                data_request_id: parent.dr_id,
                round: parent.round,
            }).toArray();
        },
    },
}