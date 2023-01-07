import { authenticate, TokenService } from '@loopback/authentication';
import {
    TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
    get, param,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {TransactionRepository} from "../repositories/transaction.repository";
import {TRANSACTION_STATUSES, TRANSACTION_TYPES} from "../models/transaction.model";
import {NFT} from "../models/nft.model";
import dayjs from "dayjs";

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

    @authenticate('jwt')
    @get('/transactions/statistic/{time}', {
        responses: {
            '200': {
                description: 'Return transaction',
                content: {
                    'application/json': {},
                },
            },
        },
    })
    async statisticTransaction(
        @param.path.string("time") time: "day" | "week" | "month" | "all",
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any> {
        const today = dayjs();
        let rangeTime;
        const advanceWhere: any = {
            status: {nin: [TRANSACTION_STATUSES.INACTIVE]},
        }
        if(time !== "all") {
            rangeTime = today.subtract(1, time);
            advanceWhere.date = {gte: rangeTime?.toDate()};
        }

        const transactions = await this.transactionRepository.find({
            where: advanceWhere,
            order: ["date DESC"]
        });
        const totalVol = transactions.reduce((prevValue, currValue) => {
            return prevValue + Number(currValue?.price);
        }, 0)
        return {totalVol, data: transactions};
    }
}
