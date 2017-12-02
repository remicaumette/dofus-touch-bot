import {Character} from "@core/Character";
import {ObjectItem} from "@protocol/type/ObjectItem";
import {EventEmitter} from "events";

export class CharacterInventoryManager extends EventEmitter {
    private character: Character;
    private kamas: number;
    private weight: number;
    private maxWeight: number;
    private objects: ObjectItem[];

    /**
     * @param {Character} character The character.
     */
    constructor(character: Character) {
        super();
        this.character = character;
        this.character.getGame().getGameConnection()
            .on("InventoryContentMessage", this.onInventoryContentMessage.bind(this));
        this.character.getGame().getGameConnection()
            .on("InventoryWeightMessage", this.onInventoryWeightMessage.bind(this));
    }

    /**
     * @returns {number} The amount of kamas.
     */
    public getKamas(): number {
        return this.kamas;
    }

    /**
     * Set kamas (kamasUpdated event is emit).
     * @param {number} kamas Kamas.
     */
    public setKamas(kamas: number): void {
        this.kamas = kamas;
        this.emit("kamasUpdated");
    }

    /**
     * @returns {number} The inventory weight usage.
     */
    public getWeight(): number {
        return this.weight;
    }

    /**
     * Set the inventory weight usage (weightUpdated event is emit).
     * @param {number} weight The inventory weight usage.
     */
    public setWeight(weight: number): void {
        this.weight = weight;
        this.emit("weightUpdated");
    }

    /**
     * @returns {number} The maximum inventory weight.
     */
    public getMaxWeight(): number {
        return this.maxWeight;
    }

    /**
     * Set the maximum inventory weight (maxWeightUpdated event is emit).
     * @param {number} maxWeight The maximum inventory weight.
     */
    public setMaxWeight(maxWeight: number): void {
        this.maxWeight = maxWeight;
        this.emit("maxWeightUpdated");
    }

    /**
     * @returns {ObjectItem[]} The inventory object list.
     */
    public getObjects(): ObjectItem[] {
        return this.objects;
    }

    /**
     * Set the inventory object list (objectsUpdated event is emit).
     * @param {ObjectItem[]} objects The inventory object list.
     */
    public setObjects(objects: ObjectItem[]): void {
        this.objects = objects;
        this.emit("objectsUpdated");
    }

    /**
     * InventoryContentMessage message handler.
     * @param data Message.
     */
    private onInventoryContentMessage(data: any): void {
        this.setObjects(data.objects.map((object: any) => new ObjectItem(object)));
        this.setKamas(data.kamas);
    }

    /**
     * InventoryWeightMessage message handler.
     * @param data Message.
     */
    private onInventoryWeightMessage(data: any): void {
        this.setWeight(data.weight);
        this.setMaxWeight(data.weightMax);
    }
}
