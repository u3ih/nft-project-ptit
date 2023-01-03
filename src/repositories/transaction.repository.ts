import {BelongsToAccessor, DefaultCrudRepository, Entity, repository} from "@loopback/repository";
import { Getter, inject } from "@loopback/core";
import {MongoDbDataSource} from "../datasources";
import {Transaction, TransactionRelations} from "../models/transaction.model";
import {User} from "../models";
import {UserRepository} from "./users.repository";
import {NFT} from "../models/nft.model";
import {NFTRepository} from "./nft.repository";
import {InappNotificationRepository} from "./inapp-notification.repository";

export class TransactionRepository extends DefaultCrudRepository<Transaction, typeof Transaction.prototype.id, TransactionRelations> {
    public user: BelongsToAccessor<User, typeof User.prototype.id>;
    public nft: BelongsToAccessor<NFT, typeof NFT.prototype.id>;

    constructor(
        @inject("datasources.mongoDb") dataSource: MongoDbDataSource,
        @repository.getter(UserRepository)
            userRepositoryGetter: Getter<UserRepository>,
        @repository.getter(NFTRepository)
            nftRepositoryGetter: Getter<NFTRepository>,
        @repository(InappNotificationRepository) public inappNotificationRepository: InappNotificationRepository,
    ) {
        super(Transaction, dataSource);
        this.user = this.createBelongsToAccessorFor("user", userRepositoryGetter);
        this.registerInclusionResolver("user", this.user.inclusionResolver);

        this.nft = this.createBelongsToAccessorFor("nft", nftRepositoryGetter);
        this.registerInclusionResolver("nft", this.nft.inclusionResolver);
    }
}
