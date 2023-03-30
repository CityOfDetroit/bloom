import { MigrationInterface, QueryRunner } from "typeorm"
import { ListingMarketingTypeEnum } from "../listings/types/listing-marketing-type-enum"

export class underConstructionWhatToExpect1680041960107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const underConstructionWhatToExpect = `This property is under construction by the property owners. If you sign up for notifications through Detroit Home Connect, we will send you updates when this property has opened up applications for residents. You can also check back later to this page for updates.`

    await queryRunner.query(
      `UPDATE listings SET what_to_expect = ($1) WHERE marketing_type = ($2)`,
      [underConstructionWhatToExpect, ListingMarketingTypeEnum.ComingSoon]
    )
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
