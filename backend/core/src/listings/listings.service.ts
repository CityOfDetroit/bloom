import { Injectable } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import {
  ListingDto,
  ListingCreateDto,
  ListingUpdateDto,
  PaginatedListingsDto,
} from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ListingsListQueryParams } from "./listings.controller"
import { mapTo } from "../shared/mapTo"

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly repository: Repository<Listing>) {}

  private getQueryBuilder() {
    return this.repository
      .createQueryBuilder("listings")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.amiChart", "amiChart")
  }

  public async list(params: ListingsListQueryParams): Promise<PaginatedListingsDto> {
    let query = this.getQueryBuilder().orderBy({
      "listings.id": "DESC",
      "units.maxOccupancy": "ASC",
      "preferences.ordinal": "ASC",
    })

    if (params.neighborhood) {
      // This works because there's only one property per listing. If that
      // weren't true for a field (for example, if we filtered on a unit's
      // fields), we couldn't use this type of where clause.
      query.andWhere("property.neighborhood = :neighborhood", { neighborhood: params.neighborhood })
    }

    let currentPage = params.page
    let itemsPerPage = params.limit

    let itemCount, totalItemsCount, totalPages
    let listings

    if (currentPage > 0 && itemsPerPage > 0) {
      const skip = (currentPage - 1) * itemsPerPage
      query = query.skip(skip).take(itemsPerPage)

      listings = await query.getMany()

      itemCount = listings.length

      totalItemsCount = await this.repository.count()
      totalPages = Math.floor(totalItemsCount / itemsPerPage)
    } else {
      listings = await query.getMany()

      currentPage = 1
      totalPages = 1
      itemCount = listings.length
      itemsPerPage = listings.length
      totalItemsCount = listings.length
    }

    // Sort units and preferences.
    // This step was removed from the SQL query because it interferes with pagination
    // (See https://github.com/CityOfDetroit/affordable-housing-app/issues/88#issuecomment-865329223)
    listings.forEach((listing) => {
      listing.property.units.sort((a, b) => a.maxOccupancy - b.maxOccupancy)
      listing.preferences.sort((a, b) => a.ordinal - b.ordinal)
    })

    if (params.jsonpath) {
      listings = jp.query(listings, params.jsonpath)
    }
    const paginatedListings = {
      items: mapTo<ListingDto, Listing>(ListingDto, listings),
      meta: {
        currentPage: currentPage,
        itemCount: itemCount,
        itemsPerPage: itemsPerPage,
        totalItems: totalItemsCount,
        totalPages: totalPages,
      },
    }

    return paginatedListings
  }

  async create(listingDto: ListingCreateDto) {
    return this.repository.save(listingDto)
  }

  async update(listingDto: ListingUpdateDto) {
    const listing = await this.repository.findOneOrFail({
      where: { id: listingDto.id },
      relations: ["property"],
    })
    /*
      NOTE: Object.assign would replace listing.property of type Property with object of type IdDto
       coming from ListingUpdateDto, which is causing a problem for dynamically computed
       listingUrlSlug property (it requires property.buildingAddress.city to exist). The solution is
       to assign this separately so that other properties (outside of IdDto type) of
       listing.property are retained.
    */
    const { property, ...dto } = listingDto
    Object.assign(listing, dto)
    Object.assign(listing.property, property)
    return await listing.save()
  }

  async delete(listingId: string) {
    const listing = await this.repository.findOneOrFail({
      where: { id: listingId },
    })
    return await this.repository.remove(listing)
  }

  async findOne(listingId: string) {
    return await this.getQueryBuilder()
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "preferences.ordinal": "ASC",
      })
      .getOne()
  }
}
