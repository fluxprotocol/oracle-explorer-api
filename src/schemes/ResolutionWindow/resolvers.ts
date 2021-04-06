import { Context } from "../../main";
import { ResolutionWindow } from "../../models/ResolutionWindow";
import { queryOutcomeStakes } from "../../services/OutcomeStakeService";

export default {
    ResolutionWindow: {
        outcome_stakes: async (parent: ResolutionWindow, args: {}, context: Context) => {
            if (parent.outcome_stakes) {
                return parent.outcome_stakes;
            }

            return queryOutcomeStakes(context.db, {
                data_request_id: parent.dr_id,
                round: parent.round,
            }).toArray();
        },
    },
}