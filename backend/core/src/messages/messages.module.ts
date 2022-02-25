import { forwardRef, Module } from "@nestjs/common"
import { MessagesService } from "./messages.service"
import { SharedModule } from "../shared/shared.module"
import { TranslationsModule } from "../translations/translations.module"
import { JurisdictionsModule } from "../jurisdictions/jurisdictions.module"

@Module({
  imports: [SharedModule, forwardRef(() => JurisdictionsModule), TranslationsModule],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
