
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
import {InappNotification, NotiStatus} from "../models/inapp-notification.model";

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
                description: 'create noti',
                content: {
                    'application/json': {
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
                description: 'get notification',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async getMyNotification(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<any[]> {
        return await this.inappNotificationRepository.find({
            where: {
                userId: currentUserProfile?.id
            },
            order: ["createAt DESC"]
        });
    }

    @authenticate('jwt')
    @put('/notifications/me/mark-as-read', {
        responses: {
            '200': {
                description: 'get notification',
                content: {
                    'application/json': {
                    },
                },
            },
        },
    })
    async markMyNotificationAsRead(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<void> {
        const setNoti = {
            status: NotiStatus.READ,
        } as Partial<InappNotification>;
        const filterNoti = {
            userId: currentUserProfile?.id,
            status: {nin: [NotiStatus.READ]}
        }
        await this.inappNotificationRepository.updateAll(setNoti,filterNoti);
    }

    @authenticate('jwt')
    @put('/notifications/{id}', {
        responses: {
            '200': {
                description: 'update notification',
                content: {
                    'application/json': {
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
                description: 'get all noti',
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
        return await this.inappNotificationRepository.find();
    }

}
