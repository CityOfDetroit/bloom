import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class ConfirmationListQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "http://localhost:3001",
    required: true,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl: string | null

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  sendEmail?: boolean
}
