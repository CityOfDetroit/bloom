import { MigrationInterface, QueryRunner } from "typeorm";
import { amiHUD2025 } from "../../scripts/script-data/HUD2025";
import { amiMSHDA2025 } from "../../scripts/script-data/MSHDA2025";

export class homeAmiChart1749657494376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id: juris }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Detroit'`
    );
    await queryRunner.query(`
                  INSERT INTO ami_chart
                  (name, items, jurisdiction_id)
                  VALUES ('${amiHUD2025.name}', '${JSON.stringify(amiMSHDA2025.items)}', '${juris}')
              `);
    await queryRunner.query(`
                  INSERT INTO ami_chart
                  (name, items, jurisdiction_id)
                  VALUES ('${amiMSHDA2025.name}', '${JSON.stringify(amiMSHDA2025.items)}', '${juris}')
              `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
