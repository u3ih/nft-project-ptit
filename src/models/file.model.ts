import {AnyObject, Entity, model, property} from "@loopback/repository";

@model({
    settings: {
        strict: false,
    },
})
export class File extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
        hidden: true,
    })
    id: string;
    
    @property({
        type: "string",
    })
    name?: string;

    @property({
        type: "string",
    })
    url?: string;

    @property({
        type: "string",
    })
    type: string;

    @property({
        type: "string",
    })
    fieldname: string;

    @property({
        type: "number",
    })
    size: number;

    @property({
        type: "object",
    })
    metadata?: AnyObject;

    constructor(data?: Partial<File>) {
        super(data);
    }
}

export interface FileRelations {
    // describe navigational properties here
}

export type FileWithRelations = File & FileRelations;
