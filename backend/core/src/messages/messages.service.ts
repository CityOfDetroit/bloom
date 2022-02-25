import { Injectable, Logger, Scope } from "@nestjs/common"
import axios from "axios"
import merge from "lodash/merge"
import Polyglot from "node-polyglot"
import { ConfigService } from "@nestjs/config"
import { TranslationsService } from "../translations/services/translations.service"
import { JurisdictionResolverService } from "../jurisdictions/services/jurisdiction-resolver.service"
import { User } from "../auth/entities/user.entity"
import { Listing } from "../listings/entities/listing.entity"
import { Application } from "../applications/entities/application.entity"
import { ListingReviewOrder } from "../listings/types/listing-review-order-enum"
import { Jurisdiction } from "../jurisdictions/entities/jurisdiction.entity"
import { Language } from "../shared/types/language-enum"

@Injectable({ scope: Scope.REQUEST })
export class MessagesService {
  polyglot: Polyglot

  constructor(
    private readonly configService: ConfigService,
    private readonly translationService: TranslationsService,
    private readonly jurisdictionResolverService: JurisdictionResolverService
  ) {
    this.polyglot = new Polyglot({
      phrases: {},
    })
  }

  private async loadTranslations(jurisdiction: Jurisdiction | null, language: Language) {
    const jurisdictionalTranslations = await this.translationService.getTranslationByLanguageAndJurisdictionOrDefaultEn(
      language,
      jurisdiction ? jurisdiction.id : null
    )
    const genericTranslations = await this.translationService.getTranslationByLanguageAndJurisdictionOrDefaultEn(
      language,
      null
    )

    // Deep merge
    const translations = merge(
      genericTranslations.translations,
      jurisdictionalTranslations.translations
    )

    this.polyglot.replace(translations)
  }

  private async loadTranslationsForUser(user: User) {
    const language = user.language || Language.en
    const jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    void (await this.loadTranslations(jurisdiction, language))
  }

  public async welcomeMessage(user: User, appUrl: string, confirmationUrl: string) {
    await this.loadTranslationsForUser(user)
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
    await this.loadTranslationsForUser(user)
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
    const jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    void (await this.loadTranslations(jurisdiction, application.language || Language.en))
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
      if (listing.reviewOrderType === ListingReviewOrder.lottery) {
        whatToExpectText = this.polyglot.t("confirmation.whatToExpect.lottery", {
          lotteryDate: listing.applicationDueDate,
        })
      } else {
        whatToExpectText = this.polyglot.t("confirmation.whatToExpect.noLottery", {
          lotteryDate: listing.applicationDueDate,
        })
      }
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
    const jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    void (await this.loadTranslations(jurisdiction, user.language))
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
    void (await this.loadTranslations(
      user.jurisdictions?.length === 1 ? user.jurisdictions[0] : null,
      user.language || Language.en
    ))

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
