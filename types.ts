
export enum Page {
    Login = 'LOGIN',
    Registration = 'REGISTRATION',
    Home = 'HOME',
    Stake = 'STAKE',
    Deposit = 'DEPOSIT',
    CardSelection = 'CARD_SELECTION',
    CardView = 'CARD_VIEW',
    Game = 'GAME',
    Leaderboard = 'LEADERBOARD',
    HowToPlay = 'HOW_TO_PLAY',
    Contact = 'CONTACT',
    ReferralIncome = 'REFERRAL_INCOME',
    Profile = 'PROFILE',
}

export interface StakeLevel {
    id: number;
    stake: number;
    active: string;
    possibleWin: number;
    bonus?: string;
    timer: number;
}

export type BingoCardNumbers = {
    B: number[];
    I: number[];
    N: number[];
    G: number[];
    O: number[];
};