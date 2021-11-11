import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_WEEK)
  handleCron() {
    console.log(
      "This is a log message from the CronService. It's an example of a task that can be performed " +
        "on a cron schedule."
    )
  }
}
