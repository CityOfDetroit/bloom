import {
  CacheModule,
  CACHE_MANAGER,
  Inject,
  Module,
  OnModuleInit,
  OnApplicationShutdown,
} from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import * as redisStore from "cache-manager-redis-store"
import { Store } from "cache-manager"
import Redis from "redis"
import { BullModule } from "@nestjs/bull"
import { ListingsService } from "./listings.service"
import { ListingsController } from "./listings.controller"
import { Listing } from "./entities/listing.entity"
import { ListingsNotificationsConsumer } from "./listings-notifications"
import { Unit } from "../units/entities/unit.entity"
import { Preference } from "../preferences/entities/preference.entity"
import { AuthModule } from "../auth/auth.module"
import { User } from "../auth/entities/user.entity"
import { Property } from "../property/entities/property.entity"
import { TranslationsModule } from "../translations/translations.module"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { SmsModule } from "../sms/sms.module"
import { ListingFeatures } from "./entities/listing-features.entity"
import { ActivityLogModule } from "../activity-log/activity-log.module"

interface RedisCache extends Cache {
  store: RedisStore
}

interface RedisStore extends Store {
  name: "redis"
  getClient: () => Redis.RedisClient
  isCacheableValue: (value: unknown) => boolean
}

const cacheConfig = {
  ttl: 24 * 60 * 60,
  store: redisStore,
  url: process.env.REDIS_URL,
  tls: undefined,
}

if (process.env.REDIS_USE_TLS !== "0") {
  cacheConfig.url = process.env.REDIS_TLS_URL
  cacheConfig.tls = {
    rejectUnauthorized: false,
  }
}

@Module({
  imports: [
    CacheModule.register(cacheConfig),
    TypeOrmModule.forFeature([
      Listing,
      Preference,
      Unit,
      User,
      Property,
      AmiChart,
      ListingFeatures,
    ]),
    AuthModule,
    TranslationsModule,
    BullModule.registerQueue({ name: "listings-notifications" }),
    SmsModule,
    ActivityLogModule,
  ],
  providers: [ListingsService, ListingsNotificationsConsumer],
  exports: [ListingsService],
  controllers: [ListingsController],
})
// We have to manually disconnect from redis on app close
export class ListingsModule implements OnApplicationShutdown, OnModuleInit {
  redisClient: Redis.RedisClient
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {
    this.redisClient = this.cacheManager.store.getClient()

    this.redisClient.on("error", (error) => {
      console.log("redis error = ", error)
    })
  }
  onApplicationShutdown() {
    console.log("Disconnect from Redis")
    void this.cacheManager.store.reset()
    this.redisClient.quit()
  }

  onModuleInit() {
    console.log("Reset Redis Cache")
    // this.redisClient.reset() doesn't seem to clear all keys
    // below actually calls flushdb, so we may want to change this, if other modules use the cache
    void this.cacheManager.store.reset()
  }
}
