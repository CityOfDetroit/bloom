import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Application } from "../../applications/entities/application.entity"
import { User } from "../../auth/entities/user.entity"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Property } from "../../property/entities/property.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingStatus } from "../types/listing-status-enum"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"
import { ReservedCommunityType } from "../../reserved-community-type/entities/reserved-community-type.entity"
import { Asset } from "../../assets/entities/asset.entity"
import { AssetCreateDto } from "../../assets/dto/asset.dto"
import { ListingApplicationAddressType } from "../types/listing-application-address-type"
import { ListingEvent } from "./listing-event.entity"
import { Address } from "../../shared/entities/address.entity"
import { ApplicationMethod } from "../../application-methods/entities/application-method.entity"
import { UnitSummaries } from "../../units/types/unit-summaries"
import { UnitGroup } from "../../units-summary/entities/unit-group.entity"
import { ListingReviewOrder } from "../types/listing-review-order-enum"
import { ApplicationMethodDto } from "../../application-methods/dto/application-method.dto"
import { ApplicationMethodType } from "../../application-methods/types/application-method-type-enum"
import { ListingFeatures } from "./listing-features.entity"
import { ListingProgram } from "../../program/entities/listing-program.entity"
import { EnforceLowerCase } from "../../shared/decorators/enforceLowerCase.decorator"
import { ListingPreference } from "../../preferences/entities/listing-preference.entity"
import { ListingImage } from "./listing-image.entity"
import { ListingMarketingTypeEnum } from "../types/listing-marketing-type-enum"
import { ListingSeasonEnum } from "../types/listing-season-enum"
import { ListingUtilities } from "./listing-utilities.entity"
import { ListingNeighborhoodAmenities } from "./listing-neighborhood-amenities.entity"
import { HomeTypeEnum } from "../types/home-type-enum"

@Entity({ name: "listings" })
@Index(["jurisdiction"])
class Listing extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  // The HRD ID is a Detroit-specific ID.
  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  hrdId?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  additionalApplicationSubmissionNotes?: string | null

  @OneToMany(() => ListingPreference, (listingPreference) => listingPreference.listing, {
    cascade: true,
    eager: true,
  })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingPreference)
  listingPreferences: ListingPreference[]

  @OneToMany(() => ApplicationMethod, (am) => am.listing, { cascade: true, eager: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethod)
  applicationMethods: ApplicationMethod[]

  @Expose()
  @ApiPropertyOptional()
  get referralApplication(): ApplicationMethodDto | undefined {
    return this.applicationMethods
      ? this.applicationMethods.find((method) => method.type === ApplicationMethodType.Referral)
      : undefined
  }

  // booleans to make dealing with different application methods easier to parse
  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  digitalApplication?: boolean

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  commonDigitalApplication?: boolean

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  paperApplication?: boolean

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  referralOpportunity?: boolean

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  section8Acceptance?: boolean | null

  // end application method booleans

  @Column("jsonb")
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreateDto)
  assets: AssetCreateDto[]

  @OneToMany(() => ListingEvent, (listingEvent) => listingEvent.listing, {
    eager: true,
    cascade: true,
  })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEvent)
  events: ListingEvent[]

  @ManyToOne(() => Property, { nullable: false, cascade: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  property: Property

  @OneToMany(() => Application, (application) => application.listing)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Application)
  applications: Application[]

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationDueDate?: Date | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationOpenDate?: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationFee?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationOrganization?: string | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationPickUpAddress?: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationPickUpAddressOfficeHours?: string | null

  @Column({ type: "enum", enum: ListingApplicationAddressType, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingApplicationAddressType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingApplicationAddressType,
    enumName: "ListingApplicationAddressType",
  })
  applicationPickUpAddressType?: ListingApplicationAddressType | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationDropOffAddress?: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationDropOffAddressOfficeHours?: string | null

  @Column({ type: "enum", enum: ListingApplicationAddressType, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingApplicationAddressType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingApplicationAddressType,
    enumName: "ListingApplicationAddressType",
  })
  applicationDropOffAddressType?: ListingApplicationAddressType | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationMailingAddress?: Address | null

  @Column({ type: "enum", enum: ListingApplicationAddressType, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingApplicationAddressType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingApplicationAddressType,
    enumName: "ListingApplicationAddressType",
  })
  applicationMailingAddressType?: ListingApplicationAddressType | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  buildingSelectionCriteria?: string | null

  @ManyToOne(() => Asset, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  buildingSelectionCriteriaFile?: Asset | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  costsNotIncluded?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  creditHistory?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  criminalBackground?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMin?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMax?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositHelperText?: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  disableUnitsAccordion?: boolean | null

  @ManyToOne(() => Jurisdiction, { eager: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  jurisdiction: Jurisdiction

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  leasingAgentAddress?: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  leasingAgentEmail?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentName?: string | null

  @ManyToMany(() => User, (leasingAgent) => leasingAgent.leasingAgentInListings, {
    nullable: true,
  })
  @JoinTable()
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => User)
  leasingAgents?: User[] | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentOfficeHours?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentPhone?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentTitle?: string | null

  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  postmarkedApplicationsReceivedByDate?: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  programRules?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalAssistance?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalHistory?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  requiredDocuments?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  specialNotes?: string | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistCurrentSize?: number | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistMaxSize?: number | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  whatToExpect?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  whatToExpectAdditionalText?: string | null

  @Column({
    type: "enum",
    enum: ListingStatus,
    default: ListingStatus.pending,
  })
  @Expose()
  @IsEnum(ListingStatus, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingStatus, enumName: "ListingStatus" })
  status: ListingStatus

  @Column({ type: "enum", enum: ListingReviewOrder, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingReviewOrder, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingReviewOrder,
    enumName: "ListingReviewOrder",
  })
  reviewOrderType?: ListingReviewOrder | null

  @Expose()
  applicationConfig?: Record<string, unknown>

  @Column({ type: "boolean" })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  displayWaitlistSize: boolean

  @Expose()
  @ApiProperty()
  get showWaitlist(): boolean {
    return (
      this.waitlistMaxSize !== null &&
      this.waitlistCurrentSize !== null &&
      this.waitlistCurrentSize < this.waitlistMaxSize
    )
  }

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  reservedCommunityDescription?: string | null

  @ManyToOne(() => ReservedCommunityType, { eager: true, nullable: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReservedCommunityType)
  reservedCommunityType?: ReservedCommunityType

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  reservedCommunityMinAge?: number | null

  @OneToMany(() => ListingImage, (listingImage) => listingImage.listing, {
    cascade: true,
    eager: true,
  })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImage)
  images?: ListingImage[] | null

  @ManyToOne(() => Asset, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  result?: Asset | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  resultLink?: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isWaitlistOpen?: boolean | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistOpenSpots?: number | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  ownerCompany?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  managementCompany?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUrl({ require_protocol: true }, { groups: [ValidationsGroupsEnum.default] })
  managementWebsite?: string | null

  // In the absence of AMI percentage information at the unit level, amiPercentageMin and
  // amiPercentageMax will store the AMI percentage range for the listing as a whole.
  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  amiPercentageMin?: number | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  amiPercentageMax?: number | null

  @Expose()
  @ApiProperty({ type: UnitSummaries })
  unitSummaries: UnitSummaries | undefined

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  customMapPin?: boolean | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  phoneNumber?: string | null

  @OneToMany(() => UnitGroup, (summary) => summary.listing, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroup)
  unitGroups: UnitGroup[]

  @OneToMany(() => ListingProgram, (listingProgram) => listingProgram.listing, {
    cascade: true,
    eager: true,
  })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingProgram)
  listingPrograms?: ListingProgram[]

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  publishedAt?: Date | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  closedAt?: Date | null

  @OneToOne(() => ListingFeatures, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingFeatures)
  features?: ListingFeatures

  @OneToOne(() => ListingUtilities, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilities)
  utilities?: ListingUtilities

  @OneToOne(() => ListingNeighborhoodAmenities, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingNeighborhoodAmenities)
  neighborhoodAmenities?: ListingNeighborhoodAmenities

  @Column({ type: "boolean", default: false, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isVerified?: boolean

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  verifiedAt?: Date | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  temporaryListingId?: number | null

  @Column({
    type: "enum",
    enum: ListingMarketingTypeEnum,
    default: ListingMarketingTypeEnum.Marketing,
  })
  @Expose()
  @IsEnum(ListingMarketingTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingMarketingTypeEnum,
    enumName: "ListingMarketingTypeEnum",
  })
  marketingType: ListingMarketingTypeEnum

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  marketingDate?: Date | null

  @Column({
    type: "enum",
    enum: ListingSeasonEnum,
    nullable: true,
  })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingSeasonEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingSeasonEnum,
    enumName: "ListingSeasonEnum",
  })
  marketingSeason?: ListingSeasonEnum | null

  @Column({
    type: "enum",
    enum: HomeTypeEnum,
    nullable: true,
  })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(HomeTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: HomeTypeEnum, enumName: "HomeTypeEnum" })
  homeType?: HomeTypeEnum | null
}

export { Listing as default, Listing }
