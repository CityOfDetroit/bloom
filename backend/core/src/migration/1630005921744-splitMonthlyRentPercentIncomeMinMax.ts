import { MigrationInterface, QueryRunner } from "typeorm"

export class splitMonthlyRentPercentIncomeMinMax1630005921744 implements MigrationInterface {
  name = "splitMonthlyRentPercentIncomeMinMax1630005921744"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP COLUMN "monthly_rent_as_percent_of_income"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD "monthly_rent_as_percent_of_income_min" numeric(8,2)`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD "monthly_rent_as_percent_of_income_max" numeric(8,2)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP COLUMN "monthly_rent_as_percent_of_income_max"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" DROP COLUMN "monthly_rent_as_percent_of_income_min"`
    )
    await queryRunner.query(
      `ALTER TABLE "units_summary" ADD "monthly_rent_as_percent_of_income" numeric(8,2)`
    )
  }
}
