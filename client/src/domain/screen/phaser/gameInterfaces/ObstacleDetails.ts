import { TrashType } from '../../../../utils/constants';

export interface ObstacleDetails {
    id: number;
    positionX: number;
    type: string;
    skippable: boolean;
    numberTrashItems?: number;
    trashType?: TrashType;
}
