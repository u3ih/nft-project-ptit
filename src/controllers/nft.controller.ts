
import { authenticate, TokenService } from '@loopback/authentication';
import {
    TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import { repository } from '@loopback/repository';
import {
    get, post, requestBody,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {NFTRepository} from "../repositories/nft.repository";
import {InappNotification} from "../models/inapp-notification.model";
import {NFT} from "../models/nft.model";

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
    @get('/nfts', {
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
    async getNotMyNft(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.nftRepository.find({
            where: {
                userId: {
                    // @ts-ignore
                    ne: currentUserProfile.id
                }
            }
        });
    }

    @authenticate('jwt')
    @get('/nfts', {
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
