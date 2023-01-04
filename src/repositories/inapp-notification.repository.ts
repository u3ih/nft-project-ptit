import {Application, CoreBindings, Getter, inject} from '@loopback/core';
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
import {getApplication} from "../index";
import {Namespace} from "socket.io";

export class InappNotificationRepository extends DefaultCrudRepository<
    InappNotification,
    typeof InappNotification.prototype.id,
    InappNotificationRelations
    > {
    public readonly user: BelongsToAccessor<User, typeof User.prototype.id>;

    constructor(
        @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
        @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
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

    protected definePersistedModel(entityClass: typeof InappNotification) {
        const modelClass = super.definePersistedModel(entityClass);
        try {
            modelClass.observe("after save", async (ctx: any) => {
                const {instance, isNewInstance} = ctx;
                if(instance && isNewInstance) {
                    const socketsInNsp = await this.getSocketsViaName("socketio.io");
                    socketsInNsp.forEach(socket => {
                        socket.emit("new-notification", [{data: instance}]);
                    });
                }
            });
        } catch (e) {
            console.log("error: ", e)
        }
        return modelClass;
    }

    async getSocketsViaName(name: string) {
        const nsp: Namespace = await this.app.get(name);
        if (!nsp) {
            return [];
        }
        const socket = (nsp.sockets as any)?.sockets;
        return Array.from(socket, ([_, socket]) => {
            return socket;
        });
    }
}
