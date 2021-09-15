import {MigrationInterface, QueryRunner} from "typeorm";

export class reservedCommunityTypePartiallySenior1631732303593 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`INSERT INTO reserved_community_types (name) VALUES ('partiallySenior')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DELETE FROM reserved_community_types WHERE name = 'partiallySenior'`)
    }

}
