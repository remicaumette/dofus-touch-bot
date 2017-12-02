import {Character} from "@core/Character";
import {EventEmitter} from "events";

export class CharacterMovementManager extends EventEmitter {
    /**
     * @param {Character} character The character.
     */
    constructor(character: Character) {
        super();
    }
}
