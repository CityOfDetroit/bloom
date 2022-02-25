import { Injectable, Logger, Scope } from "@nestjs/common"
import axios from "axios"
import merge from "lodash/merge"
import Handlebars from "handlebars"
import path from "path"
import Polyglot from "node-polyglot"
import fs from "fs"
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
    const polyglot = this.polyglot
    Handlebars.registerHelper("t", function (
      phrase: string,
      options?: number | Polyglot.InterpolationOptions
    ) {
      return polyglot.t(phrase, options)
    })

    try {
      const parts = this.partials()
      Handlebars.registerPartial(parts)
    } catch (err) {
      console.error(err)
    }
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
    await this.sendEmail(
      user.email,
      "Welcome to Bloom",
      this.template("register-email")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      })
    )
  }

  public async changeEmailMessage(
    user: User,
    appUrl: string,
    confirmationUrl: string,
    newEmail: string
  ) {
    await this.loadTranslationsForUser(user)
    await this.sendEmail(
      newEmail,
      "Bloom email change request",
      this.template("change-email")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      })
    )
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
    const compiledTemplate = this.template("confirmation")

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
    }

    await this.sendEmail(
      application.applicant.emailAddress,
      this.polyglot.t("confirmation.subject"),
      compiledTemplate({
        listing: listing,
        listingUrl: listingUrl,
        application: application,
        whatToExpectText: whatToExpectText,
        user: user,
      })
    )
  }

  public async resetPasswordMessage(user: User, appUrl: string) {
    const jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    void (await this.loadTranslations(jurisdiction, user.language))
    const compiledTemplate = this.template("forgot-password")
    const resetUrl = `${appUrl}/reset-password?token=${user.resetToken}`

    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a forget password email to ${user.email} from ${this.configService.get<
          string
        >("EMAIL_FROM_ADDRESS")}...`
      )
    }

    await this.sendEmail(
      user.email,
      this.polyglot.t("forgotPassword.subject"),
      compiledTemplate({
        resetUrl: resetUrl,
        resetOptions: { appUrl: appUrl },
        user: user,
      })
    )
  }

  public async partnersInviteMessage(user: User, appUrl: string, confirmationUrl: string) {
    void (await this.loadTranslations(
      user.jurisdictions?.length === 1 ? user.jurisdictions[0] : null,
      user.language || Language.en
    ))

    this.sendEmail(
      user.email,
      this.polyglot.t("invite.hello"),
      this.template("invite")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl },
      })
    )
  }

  private template(view: string) {
    return Handlebars.compile(
      fs.readFileSync(
        path.join(path.resolve(__dirname, "..", "shared", "views"), `/${view}.hbs`),
        "utf8"
      )
    )
  }

  private partial(view: string) {
    return fs.readFileSync(
      path.join(path.resolve(__dirname, "..", "shared", "views"), `/${view}`),
      "utf8"
    )
  }

  private partials() {
    const partials = {}
    const dirName = path.resolve(__dirname, "..", "shared", "views/partials")

    fs.readdirSync(dirName).forEach((filename) => {
      partials[filename.slice(0, -4)] = this.partial("partials/" + filename)
    })

    return partials
  }

  private async sendEmail(to: string, subject: string, body: string, retry = 3) {
    try {
      const response = await axios.request({
        method: "post",
        url: "https://api.govdelivery.com/api/v2/messages/email",
        data: {
          subject,
          body,
          recipients: [
            {
              email: to,
            },
          ],
        },
        headers: {
          "X-AUTH-TOKEN": this.configService.get<string>("GOVDELIVERY_API_KEY"),
        },
      })
      console.log(response)
    } catch (e) {
      console.log(e)
      if (retry > 0) {
        void this.sendEmail(to, subject, body, retry - 1)
      }
    }
  }
}
