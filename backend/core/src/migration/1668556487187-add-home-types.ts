import { MigrationInterface, QueryRunner } from "typeorm"

export class addHomeTypes1668556487187 implements MigrationInterface {
  name = "addHomeTypes1668556487187"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" ADD "home_type" character varying`)
    await queryRunner.query(`UPDATE "listings" SET "home_type" = 'apartment'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "home_type"`)
  }
}
