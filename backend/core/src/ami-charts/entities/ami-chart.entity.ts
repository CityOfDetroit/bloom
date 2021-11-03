import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsString, IsUUID, ValidateNested } from "class-validator"
import { AmiChartItem } from "./ami-chart-item.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"

@Entity()
export class AmiChart {
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

  @Column("jsonb")
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AmiChartItem)
  items: AmiChartItem[]

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @ManyToOne(() => Jurisdiction, { eager: true, nullable: false })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  jurisdiction: Jurisdiction
}
