import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler,
    repository,
} from '@loopback/repository';
import {User} from "../models";
import {UserRepository} from "./users.repository";
import {InappNotification, InappNotificationRelations} from "../models/inapp-notification.model";

export class InappNotificationRepository extends DefaultCrudRepository<
    InappNotification,
    typeof InappNotification.prototype.id,
    InappNotificationRelations
    > {
    public readonly user: BelongsToAccessor<
        User,
        typeof User.prototype.id
        >;

    constructor(
        @inject('datasources.db') protected db: juggler.DataSource,
        @repository.getter('UserRepository')
            userRepositoryGetter: Getter<UserRepository>,
    ) {
        super(InappNotification, db);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
    }
}
