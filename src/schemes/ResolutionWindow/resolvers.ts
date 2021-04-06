import { Context } from "node:vm";
import { ResolutionWindow } from "../../models/ResolutionWindow";

export default {
    ResolutionWindow: {
        outcome_stakes: async (parent: ResolutionWindow, args: {}, context: Context) => {
            if (parent.outcome_stakes) {
                return parent.outcome_stakes;
            }

            return [];
        },
    },
}