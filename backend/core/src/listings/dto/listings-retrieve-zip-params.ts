import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../../src/shared/types/validations-groups-enum"

export class ListingsRetrieveDto {
  @Expose()
  @ApiProperty({
    type: String,
    example: "userId",
    required: true,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId?: string
}
