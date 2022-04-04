import {MigrationInterface, QueryRunner} from "typeorm";
import { Region } from "../property/types/region-enum"

export interface Neighborhood {
    name: string
    region: Region
}

export class addPropertyRegion1649062179928 implements MigrationInterface {
    name = 'addPropertyRegion1649062179928'

    // NOTE: imported from https://github.com/CityOfDetroit/bloom/blob/main/ui-components/src/helpers/regionNeighborhoodMap.ts
    //  Issue comment: https://github.com/CityOfDetroit/bloom/issues/1015#issuecomment-1068056607
    neighborhoods: Neighborhood[] = [
        { name: "Airport Sub", region: Region.Eastside },
        { name: "Arden Park", region: Region.MidtownNewCenter },
        { name: "Aviation Sub", region: Region.Westside },
        { name: "Bagley", region: Region.Westside },
        { name: "Barton-McFarland", region: Region.Westside },
        { name: "Belle Isle", region: Region.Eastside },
        { name: "Belmont", region: Region.Westside },
        { name: "Bentler-Pickford", region: Region.Westside },
        { name: "Berg-Lahser", region: Region.Westside },
        { name: "Blackstone Park", region: Region.Westside },
        { name: "Boston Edison", region: Region.Westside },
        { name: "Boynton", region: Region.Southwest },
        { name: "Brewster Douglass", region: Region.MidtownNewCenter },
        { name: "Brewster Homes", region: Region.MidtownNewCenter },
        { name: "Brightmoor", region: Region.Westside },
        { name: "Brush Park", region: Region.MidtownNewCenter },
        { name: "Buffalo", region: Region.Eastside },
        { name: "Butler", region: Region.Eastside },
        { name: "Cadillac Community", region: Region.Westside },
        { name: "Cadillac Heights", region: Region.Eastside },
        { name: "Campau/Banglatown", region: Region.Eastside },
        { name: "Carbon Works", region: Region.Southwest },
        { name: "Castle Rouge", region: Region.Westside },
        { name: "Chadsey Condon", region: Region.Westside },
        { name: "Chandler Park", region: Region.Eastside },
        { name: "Chandler Park-Chalmers", region: Region.Eastside },
        { name: "Claytown", region: Region.Southwest },
        { name: "College Park", region: Region.Westside },
        { name: "Conant Gardens", region: Region.Eastside },
        { name: "Conner Creek", region: Region.Eastside },
        { name: "Conner Creek Industrial", region: Region.Eastside },
        { name: "Core City", region: Region.Westside },
        { name: "Corktown", region: Region.Southwest },
        { name: "Cornerstone Village", region: Region.Eastside },
        { name: "Crary/St Marys", region: Region.Westside },
        { name: "Cultural Center", region: Region.MidtownNewCenter },
        { name: "Davison", region: Region.Eastside },
        { name: "Davison-Schoolcraft", region: Region.Westside },
        { name: "Delray", region: Region.Southwest },
        { name: "Denby", region: Region.Eastside },
        { name: "Detroit Golf", region: Region.Westside },
        { name: "Dexter-Fenkell", region: Region.Westside },
        { name: "Dexter-Linwood", region: Region.Westside },
        { name: "Downtown", region: Region.Southwest },
        { name: "East English Village", region: Region.Eastside },
        { name: "East Village", region: Region.Eastside },
        { name: "Eastern Market", region: Region.MidtownNewCenter },
        { name: "Eden Gardens", region: Region.Eastside },
        { name: "Elijah McCoy", region: Region.Westside },
        { name: "Eliza Howell", region: Region.Westside },
        { name: "Elmwood Park", region: Region.Eastside },
        { name: "Evergreen Lahser 7/8", region: Region.Westside },
        { name: "Evergreen-Outer Drive", region: Region.Westside },
        { name: "Far West Detroit", region: Region.Westside },
        { name: "Farwell", region: Region.Eastside },
        { name: "Fiskhorn", region: Region.Westside },
        { name: "Fitzgerald", region: Region.Westside },
        { name: "Five Points", region: Region.Westside },
        { name: "Forest Park", region: Region.MidtownNewCenter },
        { name: "Fox Creek", region: Region.Eastside },
        { name: "Foxtown", region: Region.MidtownNewCenter },
        { name: "Franklin", region: Region.Eastside },
        { name: "Franklin Park", region: Region.Westside },
        { name: "Garden View", region: Region.Westside },
        { name: "Gateway Community", region: Region.MidtownNewCenter },
        { name: "Gold Coast", region: Region.Eastside },
        { name: "Grand River-I96", region: Region.Westside },
        { name: "Grand River-St Marys", region: Region.Westside },
        { name: "Grandmont", region: Region.Westside },
        { name: "Grandmont #1", region: Region.Westside },
        { name: "Grant", region: Region.Eastside },
        { name: "Gratiot Town/Ketterring", region: Region.Eastside },
        { name: "Gratiot Woods", region: Region.Eastside },
        { name: "Gratiot-Findlay", region: Region.Eastside },
        { name: "Gratiot-Grand", region: Region.Eastside },
        { name: "Greektown", region: Region.Downtown },
        { name: "Green Acres", region: Region.Westside },
        { name: "Greenfield", region: Region.Westside },
        { name: "Greenfield Park", region: Region.Eastside },
        { name: "Greenfield-Grand River", region: Region.Westside },
        { name: "Greenwich", region: Region.Westside },
        { name: "Grixdale Farms", region: Region.Eastside },
        { name: "Happy Homes", region: Region.Westside },
        { name: "Harmony Village", region: Region.Westside },
        { name: "Hawthorne Park", region: Region.Eastside },
        { name: "Henry Ford", region: Region.MidtownNewCenter },
        { name: "Herman Kiefer", region: Region.MidtownNewCenter },
        { name: "Historic Atkinson", region: Region.Westside },
        { name: "Hubbard Farms", region: Region.Southwest },
        { name: "Hubbard Richard", region: Region.Southwest },
        { name: "Hubbell-Lyndon", region: Region.Westside },
        { name: "Hubbell-Puritan", region: Region.Westside },
        { name: "Indian Village", region: Region.Eastside },
        { name: "Islandview", region: Region.Eastside },
        { name: "Jamison", region: Region.Westside },
        { name: "Jefferson Chalmers", region: Region.Eastside },
        { name: "Jeffries", region: Region.Westside },
        { name: "Joseph Berry Sub", region: Region.Eastside },
        { name: "Joy Community", region: Region.Westside },
        { name: "Joy-Schaefer", region: Region.Westside },
        { name: "Krainz Woods", region: Region.Eastside },
        { name: "Lafayette Park", region: Region.MidtownNewCenter },
        { name: "LaSalle College Park", region: Region.Eastside },
        { name: "LaSalle Gardens", region: Region.Westside },
        { name: "Littlefield Community", region: Region.Westside },
        { name: "Mack Avenue", region: Region.Eastside },
        { name: "Malvern Hill", region: Region.Westside },
        { name: "Mapleridge", region: Region.Eastside },
        { name: "Marina District", region: Region.Eastside },
        { name: "Martin Park", region: Region.Westside },
        { name: "McDougall-Hunt", region: Region.Eastside },
        { name: "Medbury Park", region: Region.MidtownNewCenter },
        { name: "Medical Center", region: Region.MidtownNewCenter },
        { name: "Mexicantown", region: Region.Southwest },
        { name: "Michigan-Martin", region: Region.Southwest },
        { name: "Midtown", region: Region.MidtownNewCenter },
        { name: "Midwest", region: Region.Westside },
        { name: "Miller Grove", region: Region.Westside },
        { name: "Milwaukee Junction", region: Region.MidtownNewCenter },
        { name: "Minock Park", region: Region.Westside },
        { name: "Mohican Regent", region: Region.Eastside },
        { name: "Morningside", region: Region.Eastside },
        { name: "Moross-Morang", region: Region.Eastside },
        { name: "Mount Olivet", region: Region.Eastside },
        { name: "Nardin Park", region: Region.Westside },
        { name: "New Center", region: Region.MidtownNewCenter },
        { name: "New Center Commons", region: Region.MidtownNewCenter },
        { name: "Nolan", region: Region.Eastside },
        { name: "North Campau", region: Region.Eastside },
        { name: "North Corktown", region: Region.Westside },
        { name: "North End", region: Region.MidtownNewCenter },
        { name: "North End Neighborhood", region: Region.MidtownNewCenter },
        { name: "North Rosedale Park", region: Region.Westside },
        { name: "Northeast Central District", region: Region.Eastside },
        { name: "Northwest Community", region: Region.Westside },
        { name: "Nortown", region: Region.Eastside },
        { name: "NW Goldberg", region: Region.Westside },
        { name: "O'Hair Park", region: Region.Westside },
        { name: "Oak Grove", region: Region.Westside },
        { name: "Oakman Blvd Community", region: Region.Westside },
        { name: "Oakwood Heights", region: Region.Southwest },
        { name: "Old Redford", region: Region.Westside },
        { name: "Outer Drive-Hayes", region: Region.Eastside },
        { name: "Palmer Park", region: Region.Westside },
        { name: "Palmer Woods", region: Region.Westside },
        { name: "Paveway", region: Region.Westside },
        { name: "Pembroke", region: Region.Westside },
        { name: "Penrose Village", region: Region.Eastside },
        { name: "Pershing", region: Region.Eastside },
        { name: "Petoskey-Otsego", region: Region.Westside },
        { name: "Piety Hill", region: Region.MidtownNewCenter },
        { name: "Pilgrim Village", region: Region.Westside },
        { name: "Pingree Park", region: Region.Eastside },
        { name: "Plymouth-Hubbell", region: Region.Westside },
        { name: "Plymouth-I96", region: Region.Westside },
        { name: "Poletown East", region: Region.Eastside },
        { name: "Pride Area Community", region: Region.Westside },
        { name: "Pulaski", region: Region.Eastside },
        { name: "Ravendale", region: Region.Eastside },
        { name: "Regent Park", region: Region.Eastside },
        { name: "Riverbend", region: Region.Eastside },
        { name: "Riverdale", region: Region.Westside },
        { name: "Rivertown", region: Region.Eastside },
        { name: "Rosedale Park", region: Region.Westside },
        { name: "Rouge Park", region: Region.Westside },
        { name: "Russell Industrial", region: Region.Eastside },
        { name: "Russell Woods", region: Region.Westside },
        { name: "Schaefer 7/8 Lodge", region: Region.Westside },
        { name: "Schoolcraft-I96", region: Region.Westside },
        { name: "Schulze", region: Region.Westside },
        { name: "Seven Mile-Rouge", region: Region.Westside },
        { name: "Sherwood", region: Region.Eastside },
        { name: "Sherwood Forest", region: Region.Westside },
        { name: "South of Six", region: Region.Westside },
        { name: "Southfield Plymouth", region: Region.Westside },
        { name: "Southwest Detroit", region: Region.Southwest },
        { name: "Springwells", region: Region.Southwest },
        { name: "State Fair", region: Region.Eastside },
        { name: "Tech Town", region: Region.MidtownNewCenter },
        { name: "The Eye", region: Region.Westside },
        { name: "Tri-Point", region: Region.Westside },
        { name: "University District", region: Region.Westside },
        { name: "Virginia Park", region: Region.Westside },
        { name: "Von Steuben", region: Region.Eastside },
        { name: "Wade", region: Region.Eastside },
        { name: "Warren Ave Community", region: Region.Westside },
        { name: "Warrendale", region: Region.Westside },
        { name: "Waterworks Park", region: Region.Eastside },
        { name: "Wayne State", region: Region.MidtownNewCenter },
        { name: "We Care Community", region: Region.Westside },
        { name: "Weatherby", region: Region.Westside },
        { name: "West Side Industrial", region: Region.Southwest },
        { name: "West Village", region: Region.Eastside },
        { name: "West Virginia Park", region: Region.MidtownNewCenter },
        { name: "West Woodbridge", region: Region.Southwest },
        { name: "Westwood Park", region: Region.Westside },
        { name: "Wildemere Park", region: Region.Westside },
        { name: "Winship", region: Region.Westside },
        { name: "Woodbridge", region: Region.Westside },
        { name: "Yorkshire Woods", region: Region.Eastside },
    ]

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "property_region_enum" AS ENUM('Downtown', 'Eastside', 'Midtown - New Center', 'Southwest', 'Westside')`);
        await queryRunner.query(`ALTER TABLE "property" ADD "region" "property_region_enum"`);

        let properties: Array<{id: string, neighborhood?: string}> = await queryRunner.query(`SELECT id, neighborhood FROM property`)

        for(let p of properties) {
            const neighborhood = this.neighborhoods.find(neighborhood => neighborhood.name === p.neighborhood)
            if (!neighborhood) {
                console.warn(`neighborhood ${p.neighborhood} not found in neighborhood:region map`)
                continue
            }
            await queryRunner.query(`UPDATE property SET region = $1 WHERE id = $2`, [neighborhood.region, p.id])
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "region"`);
        await queryRunner.query(`DROP TYPE "property_region_enum"`);
    }

}
