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
import {MongoDbDataSource} from "../datasources";
import {Transaction} from "../models/transaction.model";

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
        @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
        @repository.getter('UserRepository')
            userRepositoryGetter: Getter<UserRepository>,
    ) {
        super(InappNotification, dataSource);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
        this.registerInclusionResolver("user", this.user.inclusionResolver);
    }

    protected definePersistedModel(entityClass: typeof Transaction) {
        const modelClass = super.definePersistedModel(entityClass);
        modelClass.observe("after save", async (ctx: any) => {
            const {instance, isNewInstance} = ctx.instance;
            console.log("after create")

            if(instance && isNewInstance) {
                // const inappNotiData = {
                //     ...instance
                // }
                // console.log("inappNotiData: ", inappNotiData);
                // await this.inappNotificationRepository.create(inappNotiData);
            }
        });
        return modelClass;
    }
}
