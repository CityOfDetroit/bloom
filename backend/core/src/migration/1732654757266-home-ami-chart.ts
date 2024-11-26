import { MigrationInterface, QueryRunner } from "typeorm"
import { ami } from "../../scripts/script-data/HOME2024"

export class homeAmiChart1732654757266 implements MigrationInterface {
  name = "homeAmiChart1732654757266"

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
