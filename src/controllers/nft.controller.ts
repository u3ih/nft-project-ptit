
import { authenticate, TokenService } from '@loopback/authentication';
import {
    TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
    get, param, post, requestBody,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {NFTRepository} from "../repositories/nft.repository";
import {InappNotification} from "../models/inapp-notification.model";
import {NFT} from "../models/nft.model";
import {User} from "../models";

const ObjectId = require("objectid")

export class NFTController {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(SecurityBindings.USER, { optional: true })
        public user: UserProfile,
        @repository(NFTRepository) protected nftRepository: NFTRepository,
    ) { }

    @authenticate('jwt')
    @get('/nfts/me', {
        responses: {
            '200': {
                description: 'Return current user',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async getMyNFT(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.nftRepository.find({where: {userId: currentUserProfile?.id}});
    }

    @authenticate('jwt')
    @get('/nfts/list-nft-auction', {
        responses: {
            '200': {
                description: 'Return nfts auction',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async getNftAuction(
        @param.query.object("filter") filter: Filter<NFT>,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.nftRepository.find({
            ...filter,
            where: {
                userId: {
                    // @ts-ignore
                    neq: currentUserProfile.id
                },
                sold: false,
                isAuction: true,
                ...filter?.where
            },
            skip: filter?.skip ?? 0,
            limit: filter?.limit ?? 100,
        });
    }

    @authenticate('jwt')
    @get('/nfts/list-nft-sell', {
        responses: {
            '200': {
                description: 'Return nfts sell',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async getNotMyNft(
        @param.query.object("filter") filter: Filter<NFT>,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any> {
        try {
            return await this.nftRepository.find({
                ...filter,
                where: {
                    ...filter?.where,
                    userId: {
                        neq: currentUserProfile.id
                    },
                    sold: false,
                    isAuction: false,
                },
                skip: filter?.skip ?? 0,
                limit: filter?.limit ?? 100,
                include: ["user"]
            });
        } catch (e) {
            console.log("error: ", e)
        }
    }

    @authenticate('jwt')
    @get('/nfts/all', {
        responses: {
            '200': {
                description: 'Return current user',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async getAll(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.nftRepository.find();
    }

    @authenticate('jwt')
    @post('/nfts', {
        responses: {
            '200': {
                description: 'create nft',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async createMyNFT(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
        @requestBody() newNft: Omit<NFT, "id">
    ): Promise<any> {
        return await this.nftRepository.create({...newNft, userId: currentUserProfile?.id});
    }
}
