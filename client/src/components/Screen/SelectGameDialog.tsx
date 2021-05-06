import { Dialog, IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import * as React from 'react';

import game1Img from '../../images/instructions1.png';
import Button from '../common/Button';
import {
    CloseButtonContainer, DialogContent, GamePreviewContainer, GameSelectionContainer,
    LeftContainer, PreviewImage, RightContainer, SelectGameButton, SelectGameButtonContainer
} from './SelectGameDialog.sc';

interface SelectGame {
    open: boolean;
    handleClose: () => void;
}

const SelectGameDialog: React.FunctionComponent<SelectGame> = ({ handleClose, ...props }) => {
    const [selectedGame, setSelectedGame] = React.useState(0);

    const games = [
        {
            id: 1,
            name: 'Game 1',
            image: game1Img,
        },
        { id: 2, name: 'Game 2' },
        { id: 3, name: 'Game 3' },
        { id: 4, name: 'Game 4' },
    ];

    return (
        <Dialog {...props} maxWidth="lg">
            <CloseButtonContainer>
                <IconButton onClick={handleClose}>
                    <Cancel />
                </IconButton>
            </CloseButtonContainer>
            <DialogContent>
                <GameSelectionContainer>
                    <LeftContainer>
                        {games.map((game, index) => (
                            <SelectGameButton
                                key={game.name}
                                selected={index === selectedGame}
                                disabled={index !== 0}
                                onClick={() => index === 0 && setSelectedGame(game.id)}
                            >
                                {game.name}
                            </SelectGameButton>
                        ))}
                    </LeftContainer>
                    <RightContainer>
                        <GamePreviewContainer>
                            <PreviewImage src={games[selectedGame].image} />
                        </GamePreviewContainer>
                    </RightContainer>
                </GameSelectionContainer>
                <SelectGameButtonContainer>
                    <Button text={`Select ${games[selectedGame].name}`} onClick={handleClose} />
                </SelectGameButtonContainer>
            </DialogContent>
        </Dialog>
    );
};

export default SelectGameDialog;
