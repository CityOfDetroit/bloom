import { Test, TestingModule } from "@nestjs/testing"
import { User } from "../auth/entities/user.entity"
import axios from "axios"
import { MessagesService } from "./messages.service"
import { ConfigModule } from "@nestjs/config"
import { Language } from "../../types"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import { TranslationsService } from "../translations/services/translations.service"
import { Translation } from "../translations/entities/translation.entity"
import { Repository } from "typeorm"
import { REQUEST } from "@nestjs/core"

import dbOptions = require("../../ormconfig.test")
import { JurisdictionResolverService } from "../jurisdictions/services/jurisdiction-resolver.service"
import { JurisdictionsService } from "../jurisdictions/services/jurisdictions.service"
import { Jurisdiction } from "../jurisdictions/entities/jurisdiction.entity"
import { GeneratedListingTranslation } from "../translations/entities/generated-listing-translation.entity"
import { GoogleTranslateService } from "../translations/services/google-translate.service"

declare const expect: jest.Expect
jest.setTimeout(30000)
const user = new User()
user.firstName = "Test"
user.lastName = "User"
user.email = "emily.jablonski@exygy.com" //TODO: update to generic test email

let sendMock

describe("MessagesService", () => {
  let service: MessagesService
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature([Translation, Jurisdiction, GeneratedListingTranslation]),
        ConfigModule,
      ],
      providers: [
        MessagesService,
        TranslationsService,
        JurisdictionsService,
        GoogleTranslateService,
        JurisdictionResolverService,
        {
          provide: REQUEST,
          useValue: {
            get: () => {
              return "Detroit"
            },
          },
        },
      ],
    }).compile()

    const jurisdictionService = await module.resolve<JurisdictionsService>(JurisdictionsService)
    const jurisdiction = await jurisdictionService.findOne({ where: { name: "Detroit" } })

    const translationsRepository = module.get<Repository<Translation>>(
      getRepositoryToken(Translation)
    )
    await translationsRepository.createQueryBuilder().delete().execute()
    const translationsService = await module.resolve<TranslationsService>(TranslationsService)

    await translationsService.create({
      jurisdiction: {
        id: null,
      },
      language: Language.en,
      translations: {
        footer: {
          footer: "Generic footer",
          thankYou: "Thank you!",
        },
      },
    })

    await translationsService.create({
      jurisdiction: {
        id: jurisdiction.id,
      },
      language: Language.en,
      translations: {
        confirmation: {
          yourConfirmationNumber: "Here is your confirmation number:",
          shouldBeChosen:
            "Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.",
          subject: "Your Application Confirmation",
          thankYouForApplying: "Thanks for applying. We have received your application for",
          whatToExpectNext: "What to expect next:",
          whatToExpect: {
            FCFS:
              "Applicants will be contacted by the property agent on a first come first serve basis until vacancies are filled.",
            lottery:
              "The lottery will be held on %{lotteryDate}. Applicants will be contacted by the agent in lottery rank order until vacancies are filled.",
            noLottery:
              "Applicants will be contacted by the agent in waitlist order until vacancies are filled.",
          },
        },
        footer: {
          callToAction: "How are we doing? We'd like to get your ",
          callToActionUrl:
            "https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform",
          feedback: "feedback",
          footer: "Alameda County - Housing and Community Development (HCD) Department",
          thankYou: "Thank you",
        },
        forgotPassword: {
          callToAction:
            "If you did make this request, please click on the link below to reset your password:",
          changePassword: "Change my password",
          ignoreRequest: "If you didn't request this, please ignore this email.",
          passwordInfo:
            "Your password won't change until you access the link above and create a new one.",
          resetRequest:
            "A request to reset your Bloom Housing Portal website password for %{appUrl} has recently been made.",
          subject: "Forgot your password?",
        },
        leasingAgent: {
          contactAgentToUpdateInfo:
            "If you need to update information on your application, do not apply again. Contact the agent. See below for contact information for the Agent for this listing.",
          officeHours: "Office Hours:",
        },
        register: {
          confirmMyAccount: "Confirm my account",
          toConfirmAccountMessage:
            "To complete your account creation, please click the link below:",
          welcome: "Welcome",
          welcomeMessage:
            "Thank you for setting up your account on %{appUrl}. It will now be easier for you to start, save, and submit online applications for listings that appear on the site.",
        },
        t: {
          hello: "Hello",
        },
      },
    })
  })

  beforeEach(async () => {
    jest.useFakeTimers()
    sendMock = jest.fn()
    axios.request = sendMock
    service = await module.resolve(MessagesService)
  })

  it("should be defined", async () => {
    const service = await module.resolve(MessagesService)
    expect(service).toBeDefined()
  })

  describe("sendEmail", () => {
    it("should send an email", async () => {
      await service.welcomeMessage(user, "http://localhost:3000", "http://localhost:3000/?token=")
      expect(sendMock).toHaveBeenCalled()
    })
  })

  afterAll(async () => {
    await module.close()
  })
})
