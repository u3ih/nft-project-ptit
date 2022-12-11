
import { authenticate, TokenService } from '@loopback/authentication';
import {
    TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import { repository } from '@loopback/repository';
import {
    get, param, post, put, requestBody,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {InappNotificationRepository} from "../repositories/inapp-notification.repository";
import {InappNotification} from "../models/inapp-notification.model";

export class InappNotificationController {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(SecurityBindings.USER, { optional: true })
        public user: UserProfile,
        @repository(InappNotificationRepository) protected inappNotificationRepository: InappNotificationRepository,
    ) { }

    @authenticate('jwt')
    @post('/notifications', {
        responses: {
            '200': {
                description: 'Return current user',
                content: {
                    'application/json': {
                        schema: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })
    async createMyNotification(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
        @requestBody() notify: InappNotification
    ): Promise<any> {
        const {message} = notify;
        const newNotification = {
            message,
            createdTime: new Date(),
            userId: currentUserProfile?.id,
            status: "new"
        }
        return await this.inappNotificationRepository.create(newNotification);
    }

    @authenticate('jwt')
    @get('/notifications/me', {
        responses: {
            '200': {
                description: 'Return current user',
                content: {
                    'application/json': {
                        schema: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })
    async getMyNotification(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.inappNotificationRepository.find({where: {userId: currentUserProfile?.id}});
    }

    @authenticate('jwt')
    @put('/notifications/{id}', {
        responses: {
            '200': {
                description: 'Return current user',
                content: {
                    'application/json': {
                        schema: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })
    async markAsRead(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
        @param.path.string("id") id: string,
    ): Promise<void> {
        return await this.inappNotificationRepository.updateById(id, {status: "read"});
    }

    @authenticate('jwt')
    @get('/notifications', {
        responses: {
            '200': {
                description: 'Return current user',
                content: {
                    'application/json': {
                        schema: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })
    async getAll(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.inappNotificationRepository.find();
    }

}
