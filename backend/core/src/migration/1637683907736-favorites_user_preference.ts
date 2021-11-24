import { MigrationInterface, QueryRunner } from "typeorm"

export class favoritesUserPreference1637683907736 implements MigrationInterface {
  name = "favoritesUserPreference1637683907736"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_preferences" ADD "favorites" jsonb NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD CONSTRAINT "UQ_458057fa75b66e68a275647da2e" UNIQUE ("user_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP CONSTRAINT "UQ_458057fa75b66e68a275647da2e"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "favorites"`)
  }
}
