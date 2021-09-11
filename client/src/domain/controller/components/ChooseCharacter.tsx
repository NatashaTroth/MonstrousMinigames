import 'react-multi-carousel/lib/styles.css';

import { ArrowBackIos, ArrowForwardIos, Clear } from '@material-ui/icons';
import * as React from 'react';
import Carousel from 'react-multi-carousel';

import Button from '../../../components/common/Button';
import IconButton from '../../../components/common/IconButton';
import { Label } from '../../../components/common/Label.sc';
import { carouselOptions } from '../../../config/carouselOptions';
import { characters } from '../../../config/characters';
import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import { MessageTypes } from '../../../utils/constants';
import { controllerLobbyRoute } from '../../../utils/routes';
import history from '../../history/history';
import {
    Character,
    CharacterContainer,
    ChooseButtonContainer,
    ChooseCharacterContainer,
    ClearContainer,
    Left,
    Right,
} from './ChooseCharacter.sc';

const ChooseCharacter: React.FunctionComponent = () => {
    const { setCharacter } = React.useContext(PlayerContext);
    const { roomId, availableCharacters } = React.useContext(GameContext);
    const [actualCharacter, setActualCharacter] = React.useState(0);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const searchParams = new URLSearchParams(history.location.search);

    function handleRightClick() {
        if (actualCharacter === characters.length - 1) {
            setActualCharacter(0);
        } else {
            setActualCharacter(actualCharacter + 1);
        }
    }

    function handleLeftClick() {
        if (actualCharacter === 0) {
            setActualCharacter(characters.length - 1);
        } else {
            setActualCharacter(actualCharacter - 1);
        }
    }

    return (
        <ChooseCharacterContainer>
            {searchParams.get('back') && (
                <ClearContainer>
                    <IconButton onClick={() => history.goBack()}>
                        <Clear />
                    </IconButton>
                </ClearContainer>
            )}

            <Label>Choose your character:</Label>
            <Carousel
                {...carouselOptions}
                customRightArrow={<CustomRightArrow handleOnClick={handleRightClick} />}
                customLeftArrow={<CustomLeftArrow handleOnClick={handleLeftClick} />}
            >
                {characters.map((character, index) => (
                    <CharacterContainer key={`character${character.id}`}>
                        <Character src={character.src} available={availableCharacters.includes(index)} />
                    </CharacterContainer>
                ))}
            </Carousel>
            <ChooseButtonContainer>
                <Button
                    onClick={() => {
                        controllerSocket.emit({
                            type: MessageTypes.selectCharacter,
                            characterNumber: actualCharacter,
                        });
                        setCharacter(characters[actualCharacter]);

                        if (searchParams.get('back')) {
                            history.goBack();
                        } else {
                            history.push(controllerLobbyRoute(roomId));
                        }
                    }}
                    disabled={!availableCharacters.includes(actualCharacter)}
                >
                    Choose Character
                </Button>
            </ChooseButtonContainer>
        </ChooseCharacterContainer>
    );
};

export default ChooseCharacter;

interface CustomArrow {
    handleOnClick: () => void;
    onClick?: () => void;
}

export const CustomRightArrow: React.FunctionComponent<CustomArrow> = ({ handleOnClick, ...rest }) => {
    function handleClick() {
        handleOnClick();
        if (rest.onClick) {
            rest.onClick();
        }
    }

    return (
        <Right {...rest} onClick={handleClick}>
            <ArrowForwardIos />
        </Right>
    );
};

export const CustomLeftArrow: React.FunctionComponent<CustomArrow> = ({ handleOnClick, ...rest }) => {
    function handleClick() {
        handleOnClick();
        if (rest.onClick) {
            rest.onClick();
        }
    }
    return (
        <Left {...rest} onClick={handleClick}>
            <ArrowBackIos />
        </Left>
    );
};
