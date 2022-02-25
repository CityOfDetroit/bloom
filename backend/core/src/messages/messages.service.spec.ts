import { Test, TestingModule } from "@nestjs/testing"
import { User } from "../auth/entities/user.entity"
import axios from "axios"
import { MessagesService } from "./messages.service"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Translation } from "../translations/entities/translation.entity"
import { REQUEST } from "@nestjs/core"

import dbOptions = require("../../ormconfig.test")

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
        TypeOrmModule.forFeature([Translation]),
        ConfigModule,
      ],
      providers: [
        MessagesService,
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
