import { Process, Processor } from "@nestjs/bull"
import { Job } from "bull"

// TODO: how to test this? Integration test where we inject a fake email/sms module?

// This class defines the consumer/processor for the "listings-notifications" queue. It is
// responsible for sending email and SMS notifications when listings are created or updated.
@Processor("listings-notifications")
export class ListingsNotificationsConsumer {
  // @Process("new-listing")
  @Process()
  async sendListingNotifications(job: Job<unknown>) {
    console.log("\nI got a job! Here's the associated data: ")
    console.log(job.data)
    console.log("Now going to sleep for a little bit...")
    await new Promise((r) => setTimeout(r, 10000))
    console.log("Done sleeping! Finished everything!")
  }

  // Note: Bull has a number of useful events that we could define listeners on, e.g. OnQueueError,
  // OnQueueWaiting, OnQueueRemoved. These could be useful for debugging issues with the queue, or
  // responding to certain events (e.g. notify someone if notifications fail to send).
  // See https://docs.nestjs.com/techniques/queues#event-listeners for more.
}
