import { HttpException, HttpStatus, Injectable, Scope } from "@nestjs/common"
import { User } from "../../auth/entities/user.entity"
import { UserService } from "../../auth/services/user.service"
import { Listing } from "../../listings/entities/listing.entity"
import { StatusDto } from "../../shared/dto/status.dto"
import { mapTo } from "../../shared/mapTo"
import { SmsDto } from "../dto/sms.dto"
import { TwilioService } from "./twilio.service"

// NEXT STEP: TEST THIS (and make sure it builds, since I added the UserService dependency)

@Injectable({ scope: Scope.REQUEST })
export class SmsService {
  constructor(private readonly twilio: TwilioService, private readonly userService: UserService) {}

  async sendNewListingNotification(listing: Listing): Promise<StatusDto> {
    // TODO: when we have a URL, update this message so that it includes a link to the new listing.
    const notificationBody = `A new listing was recently added to Detroit Home Connect: ${listing.name}.`
    const users: User[] = await this.userService.listAllUsers()
    for (const user of users) {
      if (user.preferences.sendSmsNotifications && user.phoneNumber) {
        // TODO: make sure we have validation that if sendSmsNotifications is set, a phone number must also be set
        const smsDto: SmsDto = { body: notificationBody, phoneNumber: user.phoneNumber }
        await this.send(smsDto)
      }
    }

    return { status: "ok" }
  }

  async send(dto: SmsDto): Promise<StatusDto> {
    const messageInstance = await this.twilio.send(dto.body, dto.phoneNumber)
    if (messageInstance.errorCode) {
      console.error("Error sending SMS: " + messageInstance.errorMessage)
      throw new HttpException(messageInstance.errorMessage, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return mapTo(StatusDto, { status: "ok" })
  }
}
