import { DynamicModule, Module } from "@nestjs/common"

import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions from "../../ormconfig"
import testDbOptions from "../../ormconfig.test"
import { ThrottlerModule } from "@nestjs/throttler"
import { SharedModule } from "../shared/shared.module"
import { AuthModule } from "../auth/auth.module"
import { ApplicationsModule } from "../applications/applications.module"
import { ListingsModule } from "../listings/listings.module"
import { AmiChartsModule } from "../ami-charts/ami-charts.module"
import { ListingDefaultSeed } from "../seeder/seeds/listings/listing-default-seed"
import { Listing } from "../listings/entities/listing.entity"
import { UnitAccessibilityPriorityType } from "../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { ReservedCommunityType } from "../reserved-community-type/entities/reserved-community-type.entity"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { UnitRentType } from "../unit-rent-types/entities/unit-rent-type.entity"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { Property } from "../property/entities/property.entity"
import { Unit } from "../units/entities/unit.entity"
import { User } from "../auth/entities/user.entity"
import { UserRoles } from "../auth/entities/user-roles.entity"
import { ListingColiseumSeed } from "../seeder/seeds/listings/listing-coliseum-seed"
import { ListingDefaultOnePreferenceSeed } from "../seeder/seeds/listings/listing-default-one-preference-seed"
import { ListingDefaultNoPreferenceSeed } from "../seeder/seeds/listings/listing-default-no-preference-seed"
import { Preference } from "../preferences/entities/preference.entity"
import { ListingDefaultFCFSSeed } from "../seeder/seeds/listings/listing-default-fcfs-seed"
import { ListingDefaultOpenSoonSeed } from "../seeder/seeds/listings/listing-default-open-soon"
import {
  ListingTritonSeed,
  ListingTritonSeedDetroit,
} from "../seeder/seeds/listings/listing-triton-seed"
import { ListingDefaultBmrChartSeed } from "../seeder/seeds/listings/listing-default-bmr-chart-seed"
import { ApplicationMethod } from "../application-methods/entities/application-method.entity"
import { PaperApplication } from "../paper-applications/entities/paper-application.entity"
import { ApplicationMethodsModule } from "../application-methods/applications-methods.module"
import { PaperApplicationsModule } from "../paper-applications/paper-applications.module"
import { AssetsModule } from "../assets/assets.module"
import { Listing10158Seed } from "./seeds/listings/listing-detroit-10158"
import { Listing10157Seed } from "./seeds/listings/listing-detroit-10157"
import { Listing10147Seed } from "./seeds/listings/listing-detroit-10147"
import { Listing10145Seed } from "./seeds/listings/listing-detroit-10145"
import { Listing10202Seed } from "./seeds/listings/listing-detroit-10202"
import { ListingTreymoreSeed } from "./seeds/listings/listing-detroit-treymore"
import { UnitGroup } from "../units-summary/entities/unit-group.entity"
import { Listing10151Seed } from "./seeds/listings/listing-detroit-10151"
import { Listing10153Seed } from "./seeds/listings/listing-detroit-10153"
import { Listing10154Seed } from "./seeds/listings/listing-detroit-10154"
import { Listing10155Seed } from "./seeds/listings/listing-detroit-10155"
import { Listing10159Seed } from "./seeds/listings/listing-detroit-10159"
import { Listing10168Seed } from "./seeds/listings/listing-detroit-10168"
import { ListingDefaultSummaryWith30And60AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-30-and-60-ami-percentage-seed"
import { ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed } from "./seeds/listings/listing-default-summary-without-and-listing-with-20-ami-percentage-seed"
import { ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-30-listing-with-10-ami-percentage-seed"
import { ListingDefaultSummaryWith10ListingWith30AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-10-listing-with-30-ami-percentage-seed"
import { Listing10136Seed } from "./seeds/listings/listing-detroit-10136"
import { ListingDefaultReservedSeed } from "../seeder/seeds/listings/listing-default-reserved-seed"
import { ListingDefaultMultipleAMI } from "../seeder/seeds/listings/listing-default-multiple-ami"
import { ListingDefaultMultipleAMIAndPercentages } from "../seeder/seeds/listings/listing-default-multiple-ami-and-percentages"
import { ListingDefaultLottery } from "./seeds/listings/listing-default-lottery-results"
import { ListingDefaultLotteryPending } from "./seeds/listings/listing-default-lottery-pending"
import { ListingDefaultMissingAMI } from "../seeder/seeds/listings/listing-default-missing-ami"
import { UnitTypesModule } from "../unit-types/unit-types.module"
import { Jurisdiction } from "../jurisdictions/entities/jurisdiction.entity"
import { Program } from "../program/entities/program.entity"
import { AmiChartDefaultSeed } from "../seeder/seeds/ami-charts/default-ami-chart"
import { AmiDefaultMissingAMI } from "../seeder/seeds/ami-charts/missing-household-ami-levels"
import { AmiDefaultTriton } from "../seeder/seeds/ami-charts/triton-ami-chart"
import { AmiDefaultTritonDetroit } from "../seeder/seeds/ami-charts/triton-ami-chart-detroit"
import { AmiDefaultSanJose } from "../seeder/seeds/ami-charts/default-ami-chart-san-jose"
import { AmiDefaultSanMateo } from "../seeder/seeds/ami-charts/default-ami-chart-san-mateo"
import { Asset } from "../assets/entities/asset.entity"
import { ListingDefaultNeighborhoodAmenitiesSeed } from "./seeds/listings/listing-default-neighbor-amenities"

@Module({})
export class SeederModule {
  static forRoot(options: { test: boolean }): DynamicModule {
    const dbConfig = options.test ? testDbOptions : dbOptions
    return {
      module: SeederModule,
      imports: [
        AssetsModule,
        SharedModule,
        TypeOrmModule.forRoot({
          ...dbConfig,
        }),
        TypeOrmModule.forFeature([
          Asset,
          Listing,
          Preference,
          UnitAccessibilityPriorityType,
          UnitType,
          ReservedCommunityType,
          UnitRentType,
          AmiChart,
          Property,
          Unit,
          UnitGroup,
          User,
          UserRoles,
          ApplicationMethod,
          PaperApplication,
          Jurisdiction,
          Program,
        ]),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 5,
          ignoreUserAgents: [/^node-superagent.*$/],
        }),
        ApplicationsModule,
        ApplicationMethodsModule,
        PaperApplicationsModule,
        AuthModule,
        ListingsModule,
        AmiChartsModule,
        UnitTypesModule,
      ],
      providers: [
        ListingDefaultSeed,
        ListingColiseumSeed,
        ListingDefaultOnePreferenceSeed,
        ListingDefaultNoPreferenceSeed,
        ListingDefaultFCFSSeed,
        ListingDefaultOpenSoonSeed,
        ListingDefaultBmrChartSeed,
        ListingTritonSeed,
        ListingDefaultReservedSeed,
        ListingDefaultFCFSSeed,
        Listing10136Seed,
        Listing10158Seed,
        Listing10157Seed,
        Listing10147Seed,
        Listing10145Seed,
        Listing10151Seed,
        Listing10153Seed,
        Listing10154Seed,
        Listing10155Seed,
        Listing10159Seed,
        Listing10168Seed,
        Listing10202Seed,
        ListingTreymoreSeed,
        ListingDefaultMultipleAMI,
        ListingDefaultMultipleAMIAndPercentages,
        ListingDefaultMissingAMI,
        ListingDefaultLottery,
        ListingDefaultLotteryPending,
        ListingDefaultSummaryWith30And60AmiPercentageSeed,
        ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed,
        ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed,
        ListingDefaultSummaryWith10ListingWith30AmiPercentageSeed,
        ListingTritonSeedDetroit,
        ListingDefaultNeighborhoodAmenitiesSeed,
        AmiChartDefaultSeed,
        AmiDefaultMissingAMI,
        AmiDefaultTriton,
        AmiDefaultTritonDetroit,
        AmiDefaultSanJose,
        AmiDefaultSanMateo,
      ],
    }
  }
}
