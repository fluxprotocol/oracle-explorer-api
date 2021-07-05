export interface OutcomeNumber {
    Number: {
        value: string;
        multiplier: string;
        negative: boolean;
    }
}

export interface OutcomeString {
    String: string;
}

export interface ValidOutcome {
    Answer: OutcomeNumber | OutcomeString;
}

export type Outcome = string | 'Invalid' | ValidOutcome;

export function isSameOutcome(a: Outcome, b: Outcome): boolean {
    if (typeof a === 'string' && typeof b !== 'string') {
        return false;
    }

    if (typeof a === 'string' || typeof b === 'string') {
        return a === b;
    }

    console.log('[] a, b -> ', a, b);
    
    return JSON.stringify(a) === JSON.stringify(b);
}