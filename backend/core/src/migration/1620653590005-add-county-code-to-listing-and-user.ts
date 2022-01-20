import { MigrationInterface, QueryRunner } from "typeorm"
import { CountyCode } from "../shared/types/county-code"

export class addCountyCodeToListingAndUser1620653590005 implements MigrationInterface {
  name = "addCountyCodeToListingAndUser1620653590005"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD "county_code" character varying NOT NULL DEFAULT 'Detriot'`
    )
    const mappings = {
      Detriot: CountyCode.detroit,
    }
    for (const [dbBuildingAddressCountyValue, countyCode] of Object.entries(mappings)) {
      await queryRunner.query(
        `UPDATE listings SET county_code = '${countyCode}' FROM property, address WHERE listings.property_id = property.id AND property.building_address_id = address.id AND address.county = '${dbBuildingAddressCountyValue}'`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "county_code"`)
  }
}
