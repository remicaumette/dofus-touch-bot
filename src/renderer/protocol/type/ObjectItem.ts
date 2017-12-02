import {ObjectEffect} from "@protocol/type/ObjectEffect";

export class ObjectItem {
    private uniqueId: number;
    private generalId: number;
    private position: number;
    private quantity: number;
    private effects: ObjectEffect[];

    /**
     * @param data Raw data (normally extract from the InventoryContentMessage).
     */
    constructor(data: any) {
        this.uniqueId = data.objectUID;
        this.generalId = data.objectGID;
        this.position = data.position;
        this.quantity = data.quantity;
        this.effects = data.effects.map((effect: any) => new ObjectEffect(effect));
    }

    /**
     * @returns {number} The object unique id.
     */
    public getUniqueId(): number {
        return this.uniqueId;
    }

    /**
     * @returns {number} The object id.
     */
    public getGeneralId(): number {
        return this.generalId;
    }

    /**
     * @returns {number} The position in inventory.
     */
    public getPosition(): number {
        return this.position;
    }

    /**
     * @returns {number} The quantity.
     */
    public getQuantity(): number {
        return this.quantity;
    }

    /**
     * @returns {ObjectEffect[]} Effects when this item is used.
     */
    public getEffects(): ObjectEffect[] {
        return this.effects;
    }
}
