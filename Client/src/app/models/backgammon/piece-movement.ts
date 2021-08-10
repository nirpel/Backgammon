import { Dice } from "./dice";
import { MoveOption } from "./move-option";
import { PieceColor } from "./piece-color";

export interface PieceMovement extends MoveOption {
    fromLocation: number;
    color: PieceColor;
    rolls: Dice[];
}