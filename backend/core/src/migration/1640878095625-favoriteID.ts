import { MigrationInterface, QueryRunner } from "typeorm"

export class favoriteID1640878095625 implements MigrationInterface {
  name = "favoriteID1640878095625"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD "favorite_i_ds" text array NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "favorite_i_ds"`)
  }
}
