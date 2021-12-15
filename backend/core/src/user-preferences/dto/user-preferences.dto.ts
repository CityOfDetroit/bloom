import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsOptional } from "class-validator"
import { UserPreferences } from "../entities/user-preferences.entity"
import { FavoritedListingDto } from "./favorited-listing.dto"

export class UserPreferencesDto extends OmitType(UserPreferences, ["user", "favorites"] as const) {
  @Expose()
  @IsOptional()
  @Type(() => FavoritedListingDto)
  favorites?: FavoritedListingDto[] | null
}
