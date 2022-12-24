import {belongsTo, Entity, hasMany, model, property} from "@loopback/repository";
import { User, UserWithRelations } from "./user.model";
import {NFT} from "./nft.model";

export const TRANSACTION_TYPES = {
    BUY_NFT: "buy_nft",
    UPDATE_AUCTION_PRICE: "update_auction_price",
    AUCTION_SUCCESS: "auction_success",
}

export const TRANSACTION_STATUSES = {
    NEW: "new",
    SUCCESS: "success",
    INACTIVE: "inactive"
}

@model({
    settings: {
        strict: false,
    },
})
export class Transaction extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
        hidden: true,
    })
    id: string;

    @belongsTo(() => User)
    userId: string;

    @belongsTo(() => NFT)
    nftId: string;

    @property({
        type: "string",
    })
    from: string;

    @property({
        type: "string",
    })
    to: string;

    @property({
        type: "string",
        default: "ETH",
    })
    symbol: string;

    @property({
        type: "string",
        jsonSchema: {
            enum: Object.values(TRANSACTION_TYPES)
        }
    })
    type: string;

    @property({
        type: "string",
    })
    price: string;

    @property({
        type: "date",
    })
    date?: Date;

    @property({
        type: "string",
        default: TRANSACTION_STATUSES.NEW,
        jsonSchema: {
            enum: Object.values(TRANSACTION_STATUSES)
        }
    })
    status: string;

    @property({
        type: "string",
    })
    reason: string;

    constructor(data?: Partial<Transaction>) {
        super(data);
    }
}

export interface TransactionRelations {
    user?: UserWithRelations,
}

export type TransactionWithRelations = Transaction&TransactionRelations;
