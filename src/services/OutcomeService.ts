import { Outcome } from "../models/Outcome";


export function transformOutcomeToString(outcome: Outcome) {
    // For Invalid outcomes
    if (outcome === 'Invalid' || typeof outcome === 'string') return outcome;

    return JSON.stringify(outcome);
}