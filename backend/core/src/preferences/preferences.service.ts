import { Preference } from "./entities/preference.entity"
import { AbstractServiceFactory } from "../shared/abstract-service"
import { PreferenceCreateDto, PreferenceUpdateDto } from "./dto/preference.dto"

export class PreferencesService extends AbstractServiceFactory<
  Preference,
  PreferenceCreateDto,
  PreferenceUpdateDto
>(Preference) {}
