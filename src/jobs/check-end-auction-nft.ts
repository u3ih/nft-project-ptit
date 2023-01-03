import { exec } from "child_process";
import { CronJob, cronJob } from "@loopback/cron";
import moment from "moment";
import {createBindingFromClass, service} from "@loopback/core";
import { MongoDbDataSource } from "../datasources";
import {NFTRepository} from "../repositories/nft.repository";

@cronJob()
class AuctionNftTracking extends CronJob {
    constructor(
        @service(NFTRepository)
        public nftRepository: NFTRepository,
    ) {
        super({
            name: "CampaignTracking",
            onTick: async () => {
                const allNftAuction = await this.nftRepository.find({where: {isAuction: true}});

            },
            cronTime: "0 0 0 * * *",  //will run every day at 12:00 AM
            //   cronTime: "* * * * *", // Every one minute,
            start: false,
        });
    }
}

export const AuctionNftTrackingJob = createBindingFromClass(AuctionNftTracking);
