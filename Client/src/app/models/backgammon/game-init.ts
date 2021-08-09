import {BoardState} from './board-state';

export interface GameInit extends BoardState {
    black: string;
    white: string;
}