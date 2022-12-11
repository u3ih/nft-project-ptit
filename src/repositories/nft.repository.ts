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

export class NFTRepository extends DefaultCrudRepository<
    NFT,
    typeof NFT.prototype.id,
    NFTRelations
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
        super(NFT, db);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
    }
}
