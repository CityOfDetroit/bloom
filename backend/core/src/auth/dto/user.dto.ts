import { OmitType } from "@nestjs/swagger"
import { User } from "../entities/user.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdNameDto } from "../../shared/dto/idName.dto"
import { UserRolesDto } from "./user-roles.dto"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { UserPreferencesDto } from "./user-preferences.dto"

export class UserDto extends OmitType(User, [
  "leasingAgentInListings",
  "passwordHash",
  "resetToken",
  "confirmationToken",
  "roles",
  "jurisdictions",
  "mfaCode",
  "mfaCodeUpdatedAt",
  "preferences",
] as const) {
  @Expose()
  @IsOptional()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdNameDto)
  leasingAgentInListings?: IdNameDto[] | null

  @Expose()
  @IsOptional()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserRolesDto)
  roles?: UserRolesDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => JurisdictionDto)
  jurisdictions: JurisdictionDto[]

  @Expose()
  @IsOptional()
  @Type(() => UserPreferencesDto)
  preferences?: UserPreferencesDto | null
}
