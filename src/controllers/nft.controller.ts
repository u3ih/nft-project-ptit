import { authenticate, TokenService } from '@loopback/authentication';
import {
    TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
    get, param, post, put, requestBody,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {NFTRepository} from "../repositories/nft.repository";
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
    @get('/nfts/me-selling', {
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
    async getMyNFTSelling(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.nftRepository.find({
            where: {
                userId: currentUserProfile?.id,
                sold: false,
                isAuction: false,
            }
        });
    }

    @authenticate('jwt')
    @get('/nfts/me-bought', {
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
    async getMyNFTBought(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.nftRepository.find({
            where: {
                userId: currentUserProfile?.id,
                sold: true,
                isAuction: false,
            }
        });
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
        const newFilter = {
            ...filter,
            where: {
                userId: {
                    nin: [currentUserProfile.id]
                },
                buyerId: {
                    nin: [currentUserProfile.id]
                },
                sold: false,
                isAuction: true,
                ...filter?.where
            },
            skip: filter?.skip ?? 0,
            limit: filter?.limit ?? 100,
            include: ["user"]
        }

        return await this.nftRepository.find(newFilter);
    }

    @authenticate('jwt')
    @get('/nfts/list-my-nft-auction', {
        responses: {
            '200': {
                description: 'Return my nfts auction',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async getMyNftAuction(
        @param.query.object("filter") filter: Filter<NFT>,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.nftRepository.find({
            ...filter,
            where: {
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
                        nin: [currentUserProfile.id]
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

    @get('/nfts/{id}', {
        responses: {
            '200': {
                description: 'return one nft',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async findOneNFT(
        @param.path.string("id") id: string,
    ): Promise<any> {
        return await this.nftRepository.findById(id);
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

    @authenticate('jwt')
    @put('/nfts/{id}', {
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
    async updateNFT(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
        @param.path.string("id") id: string,
        @requestBody() requestNft: Omit<NFT, "id">
    ): Promise<any> {
        return await this.nftRepository.updateById(id, {...requestNft});
    }
}
