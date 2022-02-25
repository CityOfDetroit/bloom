import { Injectable, Logger, Scope } from "@nestjs/common"
import axios from "axios"
import Polyglot from "node-polyglot"
import { ConfigService } from "@nestjs/config"
import { User } from "../auth/entities/user.entity"
import { Listing } from "../listings/entities/listing.entity"
import { Application } from "../applications/entities/application.entity"
import { ListingReviewOrder } from "../listings/types/listing-review-order-enum"

@Injectable({ scope: Scope.REQUEST })
export class MessagesService {
  polyglot: Polyglot

  constructor(private readonly configService: ConfigService) {
    this.polyglot = new Polyglot({
      phrases: {},
    })
  }

  // ACCOUNT MESSAGES
  public async welcomeMessage(user: User, appUrl: string, confirmationUrl: string) {
    if (this.configService.get<string>("NODE_ENV") === "production") {
      Logger.log(
        `Preparing to send a welcome email to ${user.email} from ${this.configService.get<string>(
          "EMAIL_FROM_ADDRESS"
        )}...`
      )
    }

    const recipient = {
      email: user.email,
      macros: {
        name: this.getUserName(user),
        confirmationUrl,
        appUrl,
      },
    }

    await this.sendEmail([recipient], "welcome-message")
  }

  public async changeEmailMessage(
    user: User,
    appUrl: string,
    confirmationUrl: string,
    newEmail: string
  ) {
    const recipient = {
      email: newEmail,
      macros: {
        name: this.getUserName(user),
        confirmationUrl,
        appUrl,
      },
    }
    await this.sendEmail([recipient], "change-email-message")
  }

  public async applicationConfirmationMessage(
    listing: Listing,
    application: Application,
    appUrl: string
  ) {
    let whatToExpectText
    const listingUrl = `${appUrl}/listing/${listing.id}`

    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a confirmation email to ${
          application.applicant.emailAddress
        } from ${this.configService.get<string>("EMAIL_FROM_ADDRESS")}...`
      )
    }

    if (listing.applicationDueDate) {
      whatToExpectText = this.polyglot.t(
        `${
          listing.reviewOrderType === ListingReviewOrder.lottery
            ? "confirmation.whatToExpect.lottery"
            : "confirmation.whatToExpect.noLottery"
        }`,
        {
          lotteryDate: listing.applicationDueDate,
        }
      )
    } else {
      whatToExpectText = this.polyglot.t("confirmation.whatToExpect.FCFS")
    }

    const user = {
      firstName: application.applicant.firstName,
      middleName: application.applicant.middleName,
      lastName: application.applicant.lastName,
    } as User

    const recipient = {
      email: application.applicant.emailAddress,
      macros: {
        name: this.getUserName(user),
        listingUrl,
        listingName: listing.name,
        confirmationCode: application.confirmationCode,
        whatToExpectText,
        leasingAgentName: listing.leasingAgentName,
        leasingAgentTitle: listing.leasingAgentTitle,
        leasingAgentPhone: listing.leasingAgentPhone,
        leasingAgentEmail: listing.leasingAgentEmail,
      },
    }

    await this.sendEmail([recipient], "application-confirmation-message")
  }

  public async resetPasswordMessage(user: User, appUrl: string) {
    const resetUrl = `${appUrl}/reset-password?token=${user.resetToken}`

    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a forget password email to ${user.email} from ${this.configService.get<
          string
        >("EMAIL_FROM_ADDRESS")}...`
      )
    }

    const recipient = {
      email: user.email,
      macros: {
        name: this.getUserName(user),
        resetUrl,
        appUrl,
      },
    }

    await this.sendEmail([recipient], "forgot-password-messages")
  }

  public async partnersInviteMessage(user: User, appUrl: string, confirmationUrl: string) {
    const recipient = {
      email: user.email,
      macros: {
        name: this.getUserName(user),
        confirmationUrl,
        appUrl,
      },
    }

    this.sendEmail([recipient], "partners-invite-message")
  }

  // NOTIFICATION MESSAGES
  public async updateNotificationsUser(
    privacyConsent: boolean,
    sendNotifications: boolean,
    email?: string,
    phone?: string,
    topicIds?: string[]
  ) {
    try {
      const response = await axios.request({
        method: "post",
        url: `https://api.govdelivery.com/api/v2/accounts/${this.configService.get<string>(
          "GOVDELIVERY_ACCOUNT_ID"
        )}/signup`,
        data: {
          signup: {
            email,
            phone,
            privacy_consent: privacyConsent,
            send_notifications: sendNotifications,
            subscribe: {
              topic_ids: topicIds,
            },
          },
        },
        headers: {
          "X-AUTH-TOKEN": this.configService.get<string>("GOVDELIVERY_API_KEY"),
        },
      })
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  public async listingOpenMessage(listing: Listing) {
    try {
      //TODO: Toggle URL on staging vs production
      const BULLETIN_ID = "1234"
      const response = await axios.request({
        method: "post",
        url: `https://stage-tms.govdelivery.com/api/account/${this.configService.get<string>(
          "GOVDELIVERY_ACCOUNT_ID"
        )}/bulletins/${BULLETIN_ID}send_now`,
        headers: {
          "X-AUTH-TOKEN": this.configService.get<string>("GOVDELIVERY_API_KEY"),
        },
      })
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  // TODO: Type recipients
  private async sendEmail(recipients: any[], templateId: string, retry = 3) {
    try {
      const response = await axios.request({
        method: "post",
        url: "https://api.govdelivery.com/api/v2/messages/email",
        data: {
          ...recipients,
          _links: {
            email_template: templateId,
          },
        },
        headers: {
          "X-AUTH-TOKEN": this.configService.get<string>("GOVDELIVERY_API_KEY"),
        },
      })
      console.log(response)
    } catch (e) {
      console.log(e)
      if (retry > 0) {
        void this.sendEmail(recipients, templateId, retry - 1)
      }
    }
  }

  private async getUserName(user: User) {
    return `${user.firstName}${user.middleName && ` ${user.middleName}`} ${user.lastName}`
  }
}
