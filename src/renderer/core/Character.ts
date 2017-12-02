import {Breed} from "@protocol/enum/Breed";
import {Sex} from "@protocol/enum/Sex";
import {EventEmitter} from "events";
import {CharacterBaseInformations} from "@protocol/type/CharacterBaseInformations";
import {CharacterInventory} from "@core/CharacterInventory";
import {CharacterChat} from "@core/CharacterChat";

export class Character extends EventEmitter {
    private id: number;
    private name: string;
    private level: number;
    private breed: Breed;
    private sex: Sex;
    private inventory: CharacterInventory;
    private chat: CharacterChat;

    /**
     * @param {CharacterBaseInformations} informations Informations source.
     */
    constructor(informations: CharacterBaseInformations) {
        super();

        this.id = informations.getId();
        this.name = informations.getName();
        this.level = informations.getLevel();
        this.breed = informations.getBreed();
        this.sex = informations.geSex();
        this.inventory = new CharacterInventory();
        this.chat = new CharacterChat();
    }

    /**
     * @returns {number} The id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * @returns {string} The name.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @returns {number} The level.
     */
    public getLevel(): number {
        return this.level;
    }

    /**
     * Set the level (levelUpdated event is emit).
     * @param {number} level The level.
     */
    public setLevel(level: number): void {
        this.level = level;
        this.emit("levelUpdated");
    }

    /**
     * @returns {Breed} The breed.
     */
    public getBreed(): Breed {
        return this.breed;
    }

    /**
     * @returns {Sex} The sex.
     */
    public getSex(): Sex {
        return this.sex;
    }

    /**
     * @returns {CharacterInventory} The inventory manager.
     */
    public getInventory(): CharacterInventory {
        return this.inventory;
    }

    /**
     * @returns {CharacterChat} The chat manager.
     */
    public getChat(): CharacterChat {
        return this.chat;
    }
}
