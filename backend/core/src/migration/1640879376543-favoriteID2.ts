import { MigrationInterface, QueryRunner } from "typeorm"

export class favoriteID21640879376543 implements MigrationInterface {
  name = "favoriteID21640879376543"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "favorite_i_ds"`)
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD "favorite_i_ds" jsonb NOT NULL DEFAULT '[]'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "favorite_i_ds"`)
    await queryRunner.query(`ALTER TABLE "user_preferences" ADD "favorite_i_ds" json NOT NULL`)
  }
}
