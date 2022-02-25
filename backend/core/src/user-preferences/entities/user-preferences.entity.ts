import { User } from "../../../src/auth/entities/user.entity"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../../src/shared/types/validations-groups-enum"

@Entity({ name: "user_preferences" })
export class UserPreferences {
  @OneToOne(() => User, (user) => user.preferences, {
    primary: true,
  })
  @JoinColumn()
  user: User

  @Column("boolean", { default: false })
  @Expose()
  sendEmailNotifications?: boolean

  @Column("boolean", { default: false })
  @Expose()
  sendSmsNotifications?: boolean

  @Column("text", { array: true })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @Expose()
  favoriteIds?: string[]
}
