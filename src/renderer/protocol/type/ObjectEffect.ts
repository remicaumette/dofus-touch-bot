import {ObjectActionType} from "@protocol/enum/ObjectActionType";

export class ObjectEffect {
    private action: ObjectActionType;
    private value: number;

    /**
     * @param data Raw data (normally extract from the InventoryContentMessage).
     */
    constructor(data: any) {
        this.action = data.actionId;
        this.value = data.value;
    }

    /**
     * @returns {ObjectActionType} The object effect type.
     */
    public getAction(): ObjectActionType {
        return this.action;
    }

    /**
     * @returns {number} The object effect value.
     */
    public getValue(): number {
        return this.value;
    }
}
