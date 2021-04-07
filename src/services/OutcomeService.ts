export function transformOutcomeToString(outcome: string | { Answer: string }) {
    if (typeof outcome === 'string') return outcome;
    return `Answer(${outcome.Answer})`;
}