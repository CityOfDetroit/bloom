import { SelectQueryBuilder } from "typeorm"
import { getUnitGroupSummary } from "../../shared/units-transformations"
import { Listing } from "../entities/listing.entity"
import { views } from "./config"
import { View, BaseView } from "../../views/base.view"

export function getView(qb: SelectQueryBuilder<Listing>, view?: string) {
  switch (views[view]) {
    case views.base:
      return new BaseListingView(qb)
    case views.detail:
      return new DetailView(qb)
    case views.publicListings:
      return new PublicListingsView(qb)
    case views.partnerList:
      return new PartnerListView(qb)
    case views.listingsExport:
      return new ListingsExportView(qb)
    case views.unitsExport:
      return new UnitsExportView(qb)
    case views.full:
    default:
      return new FullView(qb)
  }
}

export class BaseListingView extends BaseView {
  qb: SelectQueryBuilder<Listing>
  view: View
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.base
  }

  getViewQb(): SelectQueryBuilder<Listing> {
    this.qb.select(this.view.select)

    this.view.leftJoins.forEach((join) => {
      this.qb.leftJoin(join.join, join.alias)
    })

    return this.qb
  }

  mapUnitSummary(listings) {
    return listings.map((listing) => ({
      ...listing,
      unitSummaries: {
        byUnitTypeAndRent: getUnitGroupSummary(listing.unitGroups),
      },
    }))
  }
}

export class DetailView extends BaseListingView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.detail
  }
}

export class PublicListingsView extends BaseListingView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.publicListings
  }
}
export class PartnerListView extends BaseListingView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.partnerList
  }
}

export class ListingsExportView extends BaseListingView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.listingsExport
  }
}

export class UnitsExportView extends BaseListingView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.unitsExport
  }
}

export class FullView extends BaseListingView {
  constructor(qb: SelectQueryBuilder<Listing>) {
    super(qb)
    this.view = views.full
  }

  getViewQb(): SelectQueryBuilder<Listing> {
    this.view.leftJoinAndSelect.forEach((tuple) => this.qb.leftJoinAndSelect(...tuple))

    return this.qb
  }
}
