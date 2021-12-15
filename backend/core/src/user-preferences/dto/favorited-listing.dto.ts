import { PickType } from "@nestjs/swagger"
import { ListingDto } from "../../listings/dto/listing.dto"

export class FavoritedListingDto extends PickType(ListingDto, ["id"] as const) {}
