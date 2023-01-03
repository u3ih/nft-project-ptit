import { authenticate, TokenService } from '@loopback/authentication';
import {
    TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    get, param,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {TransactionRepository} from "../repositories/transaction.repository";
import {TRANSACTION_STATUSES, TRANSACTION_TYPES} from "../models/transaction.model";

const ObjectId = require("objectid");

export class TransactionController {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(SecurityBindings.USER, {optional: true})
        public user: UserProfile,
        @repository(TransactionRepository) protected transactionRepository: TransactionRepository,
    ) {
    }

    @authenticate('jwt')
    @get('/transactions/nft-detail/{id}', {
        responses: {
            '200': {
                description: 'Return transaction',
                content: {
                    'application/json': {},
                },
            },
        },
    })
    async getTransactionOfNftDetail(
        @param.path.string("id") nftId: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.transactionRepository.find({
            where: {
                nftId,
                type: {nin: [TRANSACTION_TYPES.UPDATE_AUCTION_PRICE]},
                status: {eq: TRANSACTION_STATUSES.SUCCESS}
            },
            order: ["date DESC"]
        });
    }

    @authenticate('jwt')
    @get('/transactions', {
        responses: {
            '200': {
                description: 'Return transaction',
                content: {
                    'application/json': {},
                },
            },
        },
    })
    async getAllTransaction(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.transactionRepository.find({
            where: {
                status: {nin: [TRANSACTION_STATUSES.INACTIVE]}
            },
            order: ["date DESC"]
        });
    }

    @authenticate('jwt')
    @get('/transactions/nft/{id}', {
        responses: {
            '200': {
                description: 'Return transaction',
                content: {
                    'application/json': {},
                },
            },
        },
    })
    async getTransactionNft(
        @param.path.string("id") idNft: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.transactionRepository.find({
            where: {
                nftId: idNft,
                status: {nin: [TRANSACTION_STATUSES.INACTIVE]}
            },
            order: ["date DESC"]
        });
    }
}
