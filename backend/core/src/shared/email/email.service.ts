import { Injectable, Logger, Scope } from "@nestjs/common"
import { SendGridService } from "@anchan828/nest-sendgrid"
import { ResponseError } from "@sendgrid/helpers/classes"
import Handlebars from "handlebars"
import path from "path"
import { User } from "../../auth/entities/user.entity"
import { Listing } from "../../listings/entities/listing.entity"
import Polyglot from "node-polyglot"
import fs from "fs"
import { ConfigService } from "@nestjs/config"
import { Application } from "../../applications/entities/application.entity"
import { TranslationsService } from "../../translations/translations.service"
import { Language } from "../types/language-enum"
import { JurisdictionResolverService } from "../../jurisdictions/services/jurisdiction-resolver.service"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"

@Injectable({ scope: Scope.REQUEST })
export class EmailService {
  polyglot: Polyglot

  constructor(
    private readonly sendGrid: SendGridService,
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
    const parts = this.partials()
    Handlebars.registerPartial(parts)
  }

  public async welcome(user: User, appUrl: string, confirmationUrl: string) {
    await this.loadTranslationsForUser(user)
    if (this.configService.get<string>("NODE_ENV") === "production") {
      Logger.log(
        `Preparing to send a welcome email to ${user.email} from ${this.configService.get<string>(
          "EMAIL_FROM_ADDRESS"
        )}...`
      )
    }
    await this.send(
      user.email,
      "Welcome to Bloom",
      this.template("register-email")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      })
    )
  }

  private async loadTranslationsForUser(user: User) {
    const language = user.language || Language.en
    const jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    void (await this.loadTranslations(jurisdiction, language))
  }

  public async changeEmail(user: User, appUrl: string, confirmationUrl: string, newEmail: string) {
    await this.loadTranslationsForUser(user)
    await this.send(
      newEmail,
      "Bloom email change request",
      this.template("change-email")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      })
    )
  }

  public async confirmation(listing: Listing, application: Application, appUrl: string) {
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
      if (!listing.waitlistMaxSize) {
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
    await this.send(
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

  public async forgotPassword(user: User, appUrl: string) {
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

    await this.send(
      user.email,
      this.polyglot.t("forgotPassword.subject"),
      compiledTemplate({
        resetUrl: resetUrl,
        resetOptions: { appUrl: appUrl },
        user: user,
      })
    )
  }

  public async newlisting(listing: Listing, user: User) {
    await this.loadTranslationsForUser(user)
    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a listing email to ${user.email} from ${this.configService.get<string>(
          "EMAIL_FROM_ADDRESS"
        )}...`
      )
    }

    const rentRange = this.getRentRange(listing)
    await this.send(
      user.email,
      "New Listing",
      this.template("new-listing")({
        listing: listing,
        rent: rentRange,
      })
    )
  }

  public async updateListingReminder(listing: Listing, users: string[]) {
    const jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    void (await this.loadTranslations(jurisdiction, Language.en))
    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a reminder to update listing email to ${users.toString} from ${this.configService.get<
          string
        >("EMAIL_FROM_ADDRESS")}...`
      )
    }

    const rentRange = this.getRentRange(listing)
    await this.sendMultiple(
      users,
      "Update Listing",
      this.template("update-listing")({
        listing: listing,
        rent: rentRange,
      })
    )
  }

  // function to calculate rent - min of all mins and max of all maxs
  private getRentRange(listing: Listing) {
    const minArray = listing.unitsSummary.map((a) => a.monthlyRentMin)
    const maxArray = listing.unitsSummary.map((a) => a.monthlyRentMax)
    if (minArray.length == 0 || maxArray.length == 0) {
      return "Call"
    }
    const minRent = "$".concat(String(Math.min(...minArray)))
    const maxRent = "$".concat(String(Math.max(...maxArray)))
    return minRent.concat(" - ", maxRent)
  }

  private async loadTranslations(jurisdiction: Jurisdiction | null, language: Language) {
    const translation = await this.translationService.getTranslationByLanguageAndJurisdictionOrDefaultEn(
      language,
      jurisdiction ? jurisdiction.id : null
    )
    this.polyglot.replace(translation.translations)
  }

  private template(view: string) {
    return Handlebars.compile(
      fs.readFileSync(
        path.join(path.resolve(__dirname, "..", "..", "views"), `/${view}.hbs`),
        "utf8"
      )
    )
  }

  private partial(view: string) {
    return fs.readFileSync(
      path.join(path.resolve(__dirname, "..", "..", "views"), `/${view}`),
      "utf8"
    )
  }

  private partials() {
    const partials = {}
    const dirName = path.resolve(__dirname, "..", "..", "views/partials")

    fs.readdirSync(dirName).forEach((filename) => {
      partials[filename.slice(0, -4)] = this.partial("partials/" + filename)
    })

    return partials
  }

  private async send(to: string, subject: string, body: string, retry = 3) {
    await this.sendGrid.send(
      {
        to: to,
        from: this.configService.get<string>("EMAIL_FROM_ADDRESS"),
        subject: subject,
        html: body,
      },
      false,
      (error) => {
        if (error instanceof ResponseError) {
          const { response } = error
          const { body: errBody } = response
          console.error(`Error sending email to: ${to}! Error body: ${errBody}`)
          if (retry > 0) {
            void this.send(to, subject, body, retry - 1)
          }
        }
      }
    )
  }

  private async sendMultiple(to: string[], subject: string, body: string, retry = 3) {
    await this.sendGrid.sendMultiple(
      {
        to: to,
        from: this.configService.get<string>("EMAIL_FROM_ADDRESS"),
        subject: subject,
        html: body,
      },

      (error) => {
        if (error instanceof ResponseError) {
          const { response } = error
          const { body: errBody } = response
          console.error(`Error sending email to: ${to.toString}! Error body: ${errBody}`)
          if (retry > 0) {
            void this.sendMultiple(to, subject, body, retry - 1)
          }
        }
      }
    )
  }

  async invite(user: User, appUrl: string, confirmationUrl: string) {
    void (await this.loadTranslations(null, user.language || Language.en))
    await this.send(
      user.email,
      this.polyglot.t("invite.hello"),
      this.template("invite")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl },
      })
    )
  }
}
