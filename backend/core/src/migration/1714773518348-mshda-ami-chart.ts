import { MigrationInterface, QueryRunner } from "typeorm"
import { ami } from "../../scripts/script-data/MSHDA2024"

export class mshdaAmiChart1714773518348 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id: juris }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Detroit'`
    )
    await queryRunner.query(`
              INSERT INTO ami_chart
              (name, items, jurisdiction_id)
              VALUES ('${ami.name}', '${JSON.stringify(ami.items)}', '${juris}')
          `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
