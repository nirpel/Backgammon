import {BoardState} from './board-state.model';

export interface GameInit extends BoardState {
    black: string;
    white: string;
    turnOf: string;
}