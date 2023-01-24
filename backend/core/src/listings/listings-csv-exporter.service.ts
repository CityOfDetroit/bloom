import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { CsvBuilder, KeyNumber } from "../applications/services/csv-builder.service"
import { getBirthday } from "../shared/utils/get-birthday"
import { formatBoolean } from "../shared/utils/format-boolean"
import { capitalizeFirstLetter } from "../shared/utils/capitalize-first-letter"
import { capAndSplit } from "../shared/utils/cap-and-split"
import { AddressCreateDto } from "../shared/dto/address.dto"
import Listing from "./entities/listing.entity"

@Injectable({ scope: Scope.REQUEST })
export class ListingsCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportFromObject(listings: Listing[]): string {
    const listingsObj = listings.map((listing) => {
      return { ID: listing.id, Name: listing.name }
    })

    return this.csvBuilder.buildFromIdIndex(listingsObj)
  }
}
