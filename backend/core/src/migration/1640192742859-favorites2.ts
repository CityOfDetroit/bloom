import { MigrationInterface, QueryRunner } from "typeorm"

export class favorites21640192742859 implements MigrationInterface {
  name = "favorites21640192742859"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences" ADD "favorite_i_ds" jsonb NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "favorite_i_ds"`)
  }
}
