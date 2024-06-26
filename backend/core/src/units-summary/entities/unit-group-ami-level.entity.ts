import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"
import { Expose } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { MonthlyRentDeterminationType } from "../types/monthly-rent-determination.enum"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { UnitGroup } from "./unit-group.entity"
import { ApiProperty } from "@nestjs/swagger"

@Entity({ name: "unit_group_ami_levels" })
export class UnitGroupAmiLevel {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  id: string

  @ManyToOne(() => AmiChart, { eager: false, nullable: true })
  amiChart?: AmiChart | null

  @RelationId(
    (unitsSummaryAmiLevelEntity: UnitGroupAmiLevel) => unitsSummaryAmiLevelEntity.amiChart
  )
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  amiChartId?: string | null

  @ManyToOne(() => UnitGroup, (unitGroup: UnitGroup) => unitGroup.amiLevels)
  unitGroup: UnitGroup

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  amiPercentage: number | null

  @Column({ type: "enum", enum: MonthlyRentDeterminationType, nullable: false })
  @Expose()
  @IsEnum(MonthlyRentDeterminationType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: MonthlyRentDeterminationType, enumName: "MonthlyRentDeterminationType" })
  monthlyRentDeterminationType: MonthlyRentDeterminationType

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  flatRentValue?: number | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  percentageOfIncomeValue?: number | null
}
