import {CharacterChatManager} from "@core/CharacterChatManager";
import {CharacterFightManager} from "@core/CharacterFightManager";
import {CharacterInventoryManager} from "@core/CharacterInventoryManager";
import {CharacterMovementManager} from "@core/CharacterMovementManager";
import {Game} from "@core/Game";
import {Breed} from "@protocol/enum/Breed";
import {Sex} from "@protocol/enum/Sex";
import {CharacterBaseInformations} from "@protocol/type/CharacterBaseInformations";
import {EventEmitter} from "events";

export class Character extends EventEmitter {
    private game: Game;
    private id: number;
    private name: string;
    private level: number;
    private breed: Breed;
    private sex: Sex;
    private inventoryManager: CharacterInventoryManager;
    private chatManager: CharacterChatManager;
    private movementManager: CharacterMovementManager;
    private fightManager: CharacterFightManager;

    /**
     * @param {Game} game The game.
     * @param {CharacterBaseInformations} informations Informations source.
     */
    constructor(game: Game, informations: CharacterBaseInformations) {
        super();

        this.game = game;
        this.id = informations.getId();
        this.name = informations.getName();
        this.level = informations.getLevel();
        this.breed = informations.getBreed();
        this.sex = informations.geSex();
        this.inventoryManager = new CharacterInventoryManager(this);
        this.chatManager = new CharacterChatManager(this);
        this.movementManager = new CharacterMovementManager(this);
        this.fightManager = new CharacterFightManager(this);
    }

    /**
     * @returns {Game} The game.
     */
    public getGame(): Game {
        return this.game;
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
     * @returns {CharacterInventoryManager} The inventory manager.
     */
    public getInventoryManager(): CharacterInventoryManager {
        return this.inventoryManager;
    }

    /**
     * @returns {CharacterChatManager} The chat manager.
     */
    public getChatManager(): CharacterChatManager {
        return this.chatManager;
    }

    /**
     * @returns {CharacterMovementManager} The movement manager.
     */
    public getMovementManager(): CharacterMovementManager {
        return this.movementManager;
    }

    /**
     * @returns {CharacterFightManager} The fight manager.
     */
    public getFightManager(): CharacterFightManager {
        return this.fightManager;
    }
}
