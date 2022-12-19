import { DefaultCrudRepository} from "@loopback/repository";
import { inject } from "@loopback/core";
import { MongoDbDataSource } from "../datasources";
import {File} from "../models/file.model";

export class FileRepository extends DefaultCrudRepository<
    File,
    typeof File.prototype.id,
    File
    > {
    constructor(
        @inject("datasources.mongoDb") dataSource: MongoDbDataSource,
    ) {
        super(File, dataSource);
    }
}
