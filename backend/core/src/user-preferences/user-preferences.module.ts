import { Module } from "@nestjs/common"
import { UserPreferencesController } from "./user-preferences.controller"
import { UserPreferencesService } from "./user-preferences.services"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserPreferences } from "./entities/user-preferences.entity"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferences]), AuthModule],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
})
export class UserPreferencesModule {}
