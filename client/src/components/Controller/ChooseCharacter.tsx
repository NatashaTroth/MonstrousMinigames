import 'react-multi-carousel/lib/styles.css';

import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import * as React from 'react';
import Carousel from 'react-multi-carousel';

import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import history from '../../domain/history/history';
import { carouselOptions } from '../../utils/carouselOptions';
import { characters } from '../../utils/characters';
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
    const { roomId } = React.useContext(GameContext);
    const [actualCharacter, setActualCharacter] = React.useState(0);

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
                    <CharacterContainer key={`character${index}`}>
                        <Character src={character.src} />
                    </CharacterContainer>
                ))}
            </Carousel>
            <ChooseButtonContainer>
                <Button
                    onClick={() => {
                        setCharacter(characters[actualCharacter]);
                        history.push(`/controller/${roomId}/lobby`);
                    }}
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
