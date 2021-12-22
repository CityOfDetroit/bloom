import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserPreferences1640193850142 implements MigrationInterface {
    name = 'fixUserPreferences1640193850142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" DROP CONSTRAINT "FK_0115bda0994ab10a4c1a883504e"`);
        await queryRunner.query(`DROP INDEX "IDX_0115bda0994ab10a4c1a883504"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "PK_458057fa75b66e68a275647da2e"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "PK_b3539e30273abb8b320977f8f8e" PRIMARY KEY ("user_id", "id")`);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" ADD "user_preferences_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" DROP CONSTRAINT "PK_a2e38b75e1a538e046de2fba364"`);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "PK_388b369f95a0d1d10a779599001" PRIMARY KEY ("user_preferences_user_id", "listings_id", "user_preferences_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_a82112eb1b514fecdac3f43ebe" ON "user_preferences_favorites_listings" ("user_preferences_id", "user_preferences_user_id") `);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "FK_a82112eb1b514fecdac3f43ebe0" FOREIGN KEY ("user_preferences_id", "user_preferences_user_id") REFERENCES "user_preferences"("id","user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" DROP CONSTRAINT "FK_a82112eb1b514fecdac3f43ebe0"`);
        await queryRunner.query(`DROP INDEX "IDX_a82112eb1b514fecdac3f43ebe"`);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" DROP CONSTRAINT "PK_388b369f95a0d1d10a779599001"`);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "PK_a2e38b75e1a538e046de2fba364" PRIMARY KEY ("user_preferences_user_id", "listings_id")`);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" DROP COLUMN "user_preferences_id"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "PK_b3539e30273abb8b320977f8f8e"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "PK_458057fa75b66e68a275647da2e" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP COLUMN "id"`);
        await queryRunner.query(`CREATE INDEX "IDX_0115bda0994ab10a4c1a883504" ON "user_preferences_favorites_listings" ("user_preferences_user_id") `);
        await queryRunner.query(`ALTER TABLE "user_preferences_favorites_listings" ADD CONSTRAINT "FK_0115bda0994ab10a4c1a883504e" FOREIGN KEY ("user_preferences_user_id") REFERENCES "user_preferences"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
