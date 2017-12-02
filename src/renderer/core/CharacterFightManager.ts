import {Character} from "@core/Character";
import {EventEmitter} from "events";

export class CharacterFightManager extends EventEmitter {
    /**
     * @param {Character} character The character.
     */
    constructor(character: Character) {
        super();
    }
}
