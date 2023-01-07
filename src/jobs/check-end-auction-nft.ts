import { CronJob, cronJob } from "@loopback/cron";
import {createBindingFromClass, service} from "@loopback/core";
import {NFTRepository} from "../repositories/nft.repository";
import {NFT} from "../models/nft.model";
import {TRANSACTION_TYPES} from "../models/transaction.model";
import {repository} from "@loopback/repository";
import {InappNotificationRepository} from "../repositories/inapp-notification.repository";

@cronJob()
class AuctionNftTracking extends CronJob {
    constructor(
        @service(NFTRepository)
        public nftRepository: NFTRepository,
        @repository(InappNotificationRepository) public inappNotificationRepository: InappNotificationRepository,
    ) {
        super({
            name: "AuctionTracking",
            onTick: async () => {
                const today = new Date();
                const listNftAuctionEnd = await this.nftRepository.find({
                    where: {
                        isAuction: true,
                        sold: false,
                        timeEndAuction: {lte: today.toISOString()}
                    }
                });
                await Promise.all(
                    listNftAuctionEnd?.map((nft: NFT) => {
                        const notiData = {
                            nftName: nft?.name,
                            price: nft?.price,
                            userId: nft?.buyerId,
                            createAt: new Date(),
                            fileUrl: nft?.fileUrl,
                            type: TRANSACTION_TYPES.AUCTION_SUCCESS,
                            from: nft?.buyer,
                            to: nft?.owner,
                            nftId: nft.id,
                        }
                        return this.inappNotificationRepository.create(notiData)
                    })
                )
            },
            // cronTime: "0 0 0 * * *",  //will run every day at 12:00 AM
             cronTime: "* * * * *", // Every 1 minute,
            start: false,
        });
    }
}

export const AuctionNftTrackingJob = createBindingFromClass(AuctionNftTracking);
