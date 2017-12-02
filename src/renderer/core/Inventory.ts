import {ObjectItem} from "@protocol/type/ObjectItem";
import {EventEmitter} from "events";

export class Inventory extends EventEmitter {
    private kamas: number;
    private weight: number;
    private maxWeight: number;
    private objects: ObjectItem[];

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
}
