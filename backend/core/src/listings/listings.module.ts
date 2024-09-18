import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ListingsService } from "./listings.service"
import { ListingsController } from "./listings.controller"
import { Listing } from "./entities/listing.entity"
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
import { UnitGroup } from "../units-summary/entities/unit-group.entity"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { Program } from "../program/entities/program.entity"
import { ListingUtilities } from "./entities/listing-utilities.entity"
import { ListingsCsvExporterService } from "./listings-csv-exporter.service"
import { CsvBuilder } from "../../src/applications/services/csv-builder.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Listing,
      Preference,
      Unit,
      User,
      Property,
      AmiChart,
      ListingFeatures,
      ListingUtilities,
      UnitGroup,
      UnitType,
      Program,
    ]),
    AuthModule,
    TranslationsModule,
    SmsModule,
    ActivityLogModule,
  ],
  providers: [ListingsService, CsvBuilder, ListingsCsvExporterService],
  exports: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
