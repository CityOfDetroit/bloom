import {MigrationInterface, QueryRunner} from "typeorm";

export class addCommunityPrograms1646422264825 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'Detroit'`)

        await queryRunner.query(
            `INSERT INTO programs (title)
                VALUES
                    ('Seniors 55+'),
                    ('Seniors 62+'),
                    ('Residents with Disabilities'),
                    ('Families'),
                    ('Supportive Housing for the Homeless'),
                    ('Veterans')
            `
        )
        
        const res = await queryRunner.query(`SELECT id from programs WHERE title in ('Seniors 55+', 'Seniors 62+', 'Residents with Disabilities', 'Families', 'Supportive Housing for the Homeless', 'Veterans')`)

        for (const program of res) {
            await queryRunner.query(
                `INSERT INTO jurisdictions_programs_programs (jurisdictions_id, programs_id)
                    VALUES ($1, $2)
                `,
                [id, program.id]
            )
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
