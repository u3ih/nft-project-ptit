import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from "./user.model";

@model({ settings: { "strict": false } })

export class NFT extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
        hidden: true,
    })
    id: string;

    @property({
        type: 'string',
    })
    tokenId: string;

    @property({
        type: 'string',
    })
    seller: string;

    @property({
        type: 'string',
    })
    owner: string;

    @belongsTo(() => User)
    userId: number;

    @property({
        type: 'string',
    })
    price: string;

    @property({
        type: 'boolean',
        default: false
    })
    sold: boolean;

    @property({
        type: 'boolean',
        default: false
    })
    isAuction: object;

    @property({
        type: 'string',
    })
    urlNFT: string;

    constructor(data?: Partial<NFT>) {
        super(data);
    }
}

export interface NFTRelations {
    // describe navigational properties here
}

export type NFTWithRelations = NFT & NFTRelations;
