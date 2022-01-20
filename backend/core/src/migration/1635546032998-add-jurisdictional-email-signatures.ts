import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class addJurisdictionalEmailSignatures1635546032998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return
    const detroitTranslation = {
      footer: {
        footer: "Detroit County - Housing and Community Development (HCD) Department",
      },
    }
    const [{ id: detroitJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Detroit' LIMIT 1`
    )

    const existingDetroitTranslations = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1)`,
      [detroitJurisdiction]
    )

    const existingGeneralTranslations = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id is NULL`
    )
    const genericTranslation = {
      ...existingDetroitTranslations["0"]["translations"],
      ...existingGeneralTranslations["0"]["translations"],
      footer: {
        footer: "",
        thankYou: "Thanks!",
      },
    }

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [detroitTranslation, detroitJurisdiction, Language.en]
    )
    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id is NULL and language = ($2)`,
      [genericTranslation, Language.en]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
