import { SheepState } from '../Sheep';

export interface SheepData {
    state: SheepState;
    id: string;
    coordinates: { x: number; y: number };
}
