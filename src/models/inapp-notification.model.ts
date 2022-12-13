import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from "./user.model";

const NotiStatus = {
    NEW: "new",
    READ: "read"
}

@model({ settings: { "strict": false } })
export class InappNotification extends Entity {
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
    message: string;

    @property({
        type: 'Date',
    })
    createdTime: Date;

    @belongsTo(() => User)
    userId: string;

    @property({
        type: 'string',
        jsonSchema: {
            enum: Object.values(NotiStatus),
        },
        defaultValue: NotiStatus?.NEW
    })
    status: string;


    constructor(data?: Partial<InappNotification>) {
        super(data);
    }
}

export interface InappNotificationRelations {
    // describe navigational properties here
}

export type InappNotificationWithRelations = InappNotification & InappNotificationRelations;