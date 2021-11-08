import { Module } from "@nestjs/common"
import { ListingsNotificationService } from "./listings-notification.service"

@Module({
  providers: [ListingsNotificationService],
})
export class ListingsNotificationModule {}
