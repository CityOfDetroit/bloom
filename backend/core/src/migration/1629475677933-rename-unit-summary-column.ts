import { MigrationInterface, QueryRunner } from "typeorm"

export class renameUnitSummaryColumn1629475677933 implements MigrationInterface {
  name = "renameUnitSummaryColumn1629475677933"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "minimum_income_min"`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "minimum_income_max"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_income_min" text`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "monthly_income_max" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "monthly_income_max"`)
    await queryRunner.query(`ALTER TABLE "units_summary" DROP COLUMN "monthly_income_min"`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "minimum_income_max" text`)
    await queryRunner.query(`ALTER TABLE "units_summary" ADD "minimum_income_min" text`)
  }
}
