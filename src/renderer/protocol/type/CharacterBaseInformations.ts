import {Sex} from "@protocol/enum/Sex";
import {Breed} from "@protocol/enum/Breed";

export class CharacterBaseInformations {
    private id: number;
    private name: string;
    private breed: Breed;
    private sex: Sex;
    private level: number;

    /**
     * @param data Raw data (normally extract from the CharactersListMessage).
     */
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.breed = data.breed;
        this.sex = data.sex;
        this.level = data.level;
    }

    /**
     * @returns {number} The character id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * @returns {string} The character name.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @returns {Breed} The character breed.
     */
    public getBreed(): Breed {
        return this.breed;
    }

    /**
     * @returns {Sex} The character sex.
     */
    public geSex(): Sex {
        return this.sex;
    }

    /**
     * @returns {number} The character level.
     */
    public getLevel(): number {
        return this.level;
    }
}
