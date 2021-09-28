import { WhitelistItem } from "./WhitelistItem";

export interface Account {
    account_id: string;
    active_staking: string;
    total_staked: string;
    total_claimed: string;
    total_disputes: string;
    total_amount_slashed: string;
    times_slashed: string;
    has_stakes: boolean;
    has_requests: boolean;
    whitelist_item?: WhitelistItem;
}