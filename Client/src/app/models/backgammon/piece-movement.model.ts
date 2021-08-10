import { Dice } from "./dice.model";
import { MoveOption } from "./move-option.model";
import { PieceColor } from "./piece-color.model";

export interface PieceMovement extends MoveOption {
    fromLocation: number;
    color: PieceColor;
    rolls: Dice[];
}