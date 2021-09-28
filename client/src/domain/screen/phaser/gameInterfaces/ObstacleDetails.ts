import { TrashType } from '../../../../utils/constants';

export interface ObstacleDetails {
    id: number;
    positionX: number;
    type: string;
    numberTrashItems?: number;
    trashType?: TrashType;
}
