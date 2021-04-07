import { Context } from "../../main";
import { OutcomeStake } from "../../models/OutcomeStake";
import { ResolutionWindow } from "../../models/ResolutionWindow";
import { UserStake } from "../../models/UserStake";
import { transformOutcomeToString } from "../../services/OutcomeService";
import { queryOutcomeStakes } from "../../services/OutcomeStakeService";
import { queryUserStakes } from "../../services/UserStakesService";

export default {
    ResolutionWindow: {
        outcome_stakes: async (parent: ResolutionWindow, args: {}, context: Context): Promise<OutcomeStake[]> => {
            if (parent.outcome_stakes) {
                return parent.outcome_stakes;
            }

            const result = await queryOutcomeStakes(context.db, {
                data_request_id: parent.dr_id,
                round: parent.round,
            }).toArray();

            return result.map((os) => ({
                ...os,
                outcome: transformOutcomeToString(os.outcome),
            }));
        },
        
        user_stakes: async (parent: ResolutionWindow, args: {}, context: Context): Promise<UserStake[]> => {
            if (parent.user_stakes) {
                return parent.user_stakes;
            }

            const result = await queryUserStakes(context.db, {
                data_request_id: parent.dr_id,
                round: parent.round,
            }).toArray();

            return result.map((os) => ({
                ...os,
                outcome: transformOutcomeToString(os.outcome),
            }));
        },
    },
}