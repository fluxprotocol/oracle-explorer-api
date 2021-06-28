import { WhitelistItem } from "./WhitelistItem";

export interface Account {
    active_staking: string;
    total_staked: string;
    total_claimed: string;
    whitelist_item?: WhitelistItem;
}