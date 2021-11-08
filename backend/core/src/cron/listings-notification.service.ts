import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { ListingsQueryParams } from "../listings/dto/listings-query-params"
import { ListingsService } from "../listings/listings.service"

@Injectable()
export class ListingsNotificationService {
  // NOTE TO SELF: I don't know where this constructor is called, or if I need to
  // change e.g. the module or something else to get an instance of ListingsService.
  constructor(private readonly listingsService: ListingsService) {}
  @Cron(CronExpression.EVERY_WEEK)
  handleCron() {
    if (!process.env.SEND_NOTIFICATIONS_FOR_UPDATED_LISTINGS) {
      return
    }

    // Retrieve all listings
    let params: ListingsQueryParams
    const allListings = this.listingsService.list(params)

    // TODO
  }
}
