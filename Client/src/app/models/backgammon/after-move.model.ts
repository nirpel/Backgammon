import { BoardState } from "./board-state.model";
import { Dice } from "./dice.model";

export interface AfterMove {
    rolls: Dice[];
    board: BoardState;
}