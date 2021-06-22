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