import { Injectable, Scope } from "@nestjs/common"
import { Pagination } from "nestjs-typeorm-paginate"
import { formatLocalDate } from "../../shared/utils/format-local-date"
import { CsvBuilder } from "../../applications/services/csv-builder.service"
import { User } from "../entities/user.entity"

@Injectable({ scope: Scope.REQUEST })
export class UserCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportFromObject(users: Pagination<User>, timeZone: string): string {
    const userObj = users.items.reduce((obj, user) => {
      const status = []
      if (user.roles?.isAdmin) {
        status.push("Administrator")
      }
      if (user.roles?.isPartner) {
        status.push("Partner")
      }
      obj[user.id] = {
        "First Name": user.firstName,
        "Last Name": user.lastName,
        Email: user.email,
        Role: status.join(", "),
        "Date Created": formatLocalDate(user.createdAt, "MM-DD-YYYY hh:mmA z", timeZone),
        Status: user.confirmedAt ? "Confirmed" : "Unconfirmed",
        "Listing Names":
          user.leasingAgentInListings?.map((listing) => listing.name).join(", ") || "",
        "Listing Ids": user.leasingAgentInListings?.map((listing) => listing.id).join(", ") || "",
        "Last Logged In": formatLocalDate(user.lastLoginAt, "MM-DD-YYYY hh:mmA z", timeZone),
      }
      return obj
    }, {})
    return this.csvBuilder.buildFromIdIndex(userObj)
  }
}
