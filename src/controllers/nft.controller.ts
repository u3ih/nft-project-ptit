import { authenticate, TokenService } from '@loopback/authentication';
import {
    TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
    get, HttpErrors, param, post, put, requestBody,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {NFTRepository} from "../repositories/nft.repository";
import {NFT} from "../models/nft.model";
import {TransactionRepository} from "../repositories/transaction.repository";
import {TRANSACTION_STATUSES, TRANSACTION_TYPES} from "../models/transaction.model";
import {InappNotificationRepository} from "../repositories/inapp-notification.repository";
import {getMarketContract} from "../index";
import {marketplaceAddress} from "../common/constant";
import * as HTTP from "http";

const ObjectId = require("objectid")

export class NFTController {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(SecurityBindings.USER, { optional: true })
        public user: UserProfile,
        @repository(NFTRepository) protected nftRepository: NFTRepository,
        @repository(TransactionRepository) protected transactionRepository: TransactionRepository,
        @repository(InappNotificationRepository) protected inappNotificationRepository: InappNotificationRepository,
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
        @param.query.string("name") name: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        let filter;
        if(!!name) {
            const pattern = new RegExp(
                '.*' + name + '.*',
                'i',
            ); /* case-insensitive RegExp search */
            filter = {
                where: {
                    name: {like: pattern}
                }
            }
        }
        return await this.nftRepository.find(filter as any);
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
        return await this.nftRepository.findById(id, {include: ["user"]});
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
        @requestBody() requestNft: Omit<any, "id">
    ): Promise<any> {
        const {price, sold, owner, userId, buyer, buyerId} = requestNft;
        const oldNft = await this.nftRepository.findById(id);
        if(!oldNft) {
            return;
        }
        // is buy nft
        if(sold && userId && owner) {
            const newTransaction = {
                price: oldNft.price,
                userId,
                type: TRANSACTION_TYPES.BUY_NFT,
                date: new Date(),
                status: TRANSACTION_STATUSES.SUCCESS,
                from: owner,
                to: oldNft?.owner,
                nftId: oldNft.id,
            }
            await this.transactionRepository.create(newTransaction)
            const inappNotifi = {
                ...newTransaction,
                userId: oldNft?.userId,
                fileUrl: oldNft?.fileUrl,
                nftName: oldNft?.name,
                nftPrice: oldNft?.price,
                createAt: new Date(),
            }
            await this.inappNotificationRepository.create(inappNotifi)
        } else if (buyer && price && buyerId) {
            const newTransaction = {
                price,
                userId: buyerId,
                type: TRANSACTION_TYPES.UPDATE_AUCTION_PRICE,
                date: new Date(),
                status: TRANSACTION_STATUSES.SUCCESS,
                from: buyer,
                nftId: oldNft.id,
            }
            await this.transactionRepository.create(newTransaction)
            const inappNotifi = {
                ...newTransaction,
                userId: oldNft?.buyerId,
                nftName: oldNft?.name,
                fileUrl: oldNft?.fileUrl,
                nftPrice: oldNft?.price,
                createAt: new Date(),
            }
            await this.inappNotificationRepository.create(inappNotifi)
        }
        return await this.nftRepository.updateById(id, {...requestNft});
    }

    @authenticate('jwt')
    @put('/nfts/like/{id}', {
        responses: {
        },
    })
    async userLikeNFT(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
        @param.path.string("id") id: string,
    ): Promise<any> {
        const oldNft = await this.nftRepository.findById(id);
        const oldLikes = oldNft?.likes ?? [];
        if(oldLikes.includes(currentUserProfile?.id)) {
            throw new HttpErrors.BadRequest("Bạn đã thích NFT này rồi");
        }
        oldLikes.push(currentUserProfile?.id);
        await this.nftRepository.updateById(id, { likes: oldLikes } as any);
    }
}