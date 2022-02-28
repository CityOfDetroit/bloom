import { Body, Controller, Put, UseGuards, UsePipes, ValidationPipe, Request } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/guards/default.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { UserPreferencesService } from "./user-preferences.services"
import { UserPreferencesDto } from "./dto/user-preferences.dto"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { AuthContext } from "../auth/types/auth-context"
import { User } from "../auth/entities/user.entity"
import { Request as ExpressRequest } from "express"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { UserPreferencesAuthzGuard } from "../auth/guards/user-preferences-authz.guard"

@Controller("/userPreferences")
@ApiTags("userPreferences")
@ApiBearerAuth()
@ResourceType("userPreference")
@UseGuards(OptionalAuthGuard, UserPreferencesAuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Put(`:id`)
  @ApiOperation({ summary: "Update user preferences", operationId: "update" })
  async update(
    @Request() req: ExpressRequest,
    @Body() userPrefence: UserPreferencesDto
  ): Promise<UserPreferencesDto> {
    return mapTo(
      UserPreferencesDto,
      await this.userPreferencesService.update(userPrefence, new AuthContext(req.user as User))
    )
  }
}
