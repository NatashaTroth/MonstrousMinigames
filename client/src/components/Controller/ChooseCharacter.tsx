import 'react-multi-carousel/lib/styles.css';

import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import * as React from 'react';
import Carousel from 'react-multi-carousel';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import history from '../../domain/history/history';
import { carouselOptions } from '../../utils/carouselOptions';
import { characters } from '../../utils/characters';
import { MessageTypes } from '../../utils/constants';
import Button from '../common/Button';
import { Label } from '../common/Label.sc';
import {
    Character,
    CharacterContainer,
    ChooseButtonContainer,
    ChooseCharacterContainer,
    Left,
    Right,
} from './ChooseCharacter.sc';

const ChooseCharacter: React.FunctionComponent = () => {
    const { setCharacter } = React.useContext(PlayerContext);
    const { roomId, availableCharacters } = React.useContext(GameContext);
    const [actualCharacter, setActualCharacter] = React.useState(0);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

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
            <Label>Choose your character:</Label>
            <Carousel
                {...carouselOptions}
                customRightArrow={<CustomRightArrow handleOnClick={handleRightClick} />}
                customLeftArrow={<CustomLeftArrow handleOnClick={handleLeftClick} />}
            >
                {characters.map((character, index) => (
                    <CharacterContainer key={`character${character}`}>
                        <Character src={character} available={availableCharacters.includes(index)} />
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
                        history.push(`/controller/${roomId}/lobby`);
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

const CustomRightArrow: React.FunctionComponent<CustomArrow> = ({ handleOnClick, ...rest }) => {
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

const CustomLeftArrow: React.FunctionComponent<CustomArrow> = ({ handleOnClick, ...rest }) => {
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
