import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from "./user.model";

@model({ settings: { "strict": false } })

export class NFT extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true
    })
    id: string;

    @property({
        type: 'string',
    })
    tokenId: string;

    @property({
        type: 'string',
    })
    name: string;

    @property({
        type: 'string',
    })
    fileUrl: string;

    @property({
        type: 'string',
    })
    seller: string;

    @property({
        type: 'string',
    })
    buyerId: string;

    @property({
        type: 'string',
    })
    owner: string;

    @property({
        type: 'number',
    })
    minJumpPrice: number;

    @belongsTo(() => User, {name: 'user'})
    userId: string;

    @property({
        type: 'string',
    })
    price: string;

    @property({
        type: 'string',
    })
    timeEndAuction: string;

    @property({
        type: 'boolean',
        default: false
    })
    sold: boolean;

    @property({
        type: 'boolean',
        default: false
    })
    isAuction: boolean;

    @property({
        type: 'string',
    })
    urlNFT: string;

    @property({
        type: 'string',
    })
    blockHash: string;
    
    @property({
        type: 'number',
    })
    blockNumber: number;

    @property({
        type: 'string',
    })
    transactionHash: string;

    constructor(data?: Partial<NFT>) {
        super(data);
    }
}

export interface NFTRelations {
    // describe navigational properties here
}

export type NFTWithRelations = NFT & NFTRelations;
