import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler,
    repository,
} from '@loopback/repository';
import {NFT, NFTRelations} from "../models/nft.model";
import {User} from "../models";
import {UserRepository} from "./users.repository";
import {MongoDbDataSource} from "../datasources";

export class NFTRepository extends DefaultCrudRepository<NFT, typeof NFT.prototype.id, NFTRelations> {
    public readonly user: BelongsToAccessor<User,typeof User.prototype.id>;

    constructor(
        @inject('datasources.mongoDb') dataSource: MongoDbDataSource,
        @repository.getter('UserRepository')
            userRepositoryGetter: Getter<UserRepository>,
    ) {
        super(NFT, dataSource);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
    }
}
