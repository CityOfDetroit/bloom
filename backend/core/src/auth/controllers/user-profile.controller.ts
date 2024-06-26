import { Body, Controller, Put, Request, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Request as ExpressRequest } from "express"
import { ResourceType } from "../decorators/resource-type.decorator"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { UserService } from "../services/user.service"
import { AuthzGuard } from "../guards/authz.guard"
import { UserDto } from "../dto/user.dto"
import { mapTo } from "../../shared/mapTo"
import { AuthContext } from "../types/auth-context"
import { User } from "../entities/user.entity"
import { DefaultAuthGuard } from "../guards/default.guard"
import { UserProfileUpdateDto } from "../dto/user-profile.dto"

@Controller("userProfile")
@ApiBearerAuth()
@ApiTags("userProfile")
@ResourceType("userProfile")
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UserProfileController {
  constructor(private readonly userService: UserService) {}
  @Put(":id")
  @UseGuards(DefaultAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Update profile user", operationId: "update" })
  async update(
    @Request() req: ExpressRequest,
    @Body() dto: UserProfileUpdateDto
  ): Promise<UserDto> {
    return mapTo(UserDto, await this.userService.update(dto, new AuthContext(req.user as User)))
  }
}
