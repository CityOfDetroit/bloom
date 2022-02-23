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

@Controller("/userPreferences")
@ApiTags("userPreferences")
@ApiBearerAuth()
@ResourceType("userPreference")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Put(`:Id`)
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
