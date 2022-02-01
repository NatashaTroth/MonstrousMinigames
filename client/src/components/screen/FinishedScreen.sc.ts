import { Typography } from "@material-ui/core";
import styled from "styled-components";

import { GameNames } from "../../config/games";
import { Instruction } from "../common/Instruction.sc";
import { Label } from "../common/Label.sc";

export const RankTable = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    margin-top: 60px;
`;

export const Headline = styled(Label)`
    font-size: 40px;
    margin-top: 30px;
    margin-bottom: 30px;
`;

export const LeaderBoardRow = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 30px;
`;

export const UnfinishedUserRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
`;

export const ContentContainer = styled.div`
    margin: 20px;
`;

export const StyledLabel = styled(Label)`
    && {
        color: black;
    }
`;

export const ButtonContainer = styled.div`
    margin-top: 20px;
`;

export const StyledTypography = styled(Typography)`
    && {
        font-size: 20px;
        color: black;
    }
`;

interface Props {
    chosenGame: GameNames | undefined;
}

export const StyledInstruction = styled(Instruction)<Props>`
    && {
        width: ${({ chosenGame }) => (chosenGame === GameNames.game1 ? '22.5%' : '30%')};
    }
`;

export const Header = styled.div<Props>`
     {
        width: ${({ chosenGame }) => (chosenGame === GameNames.game1 ? '22.5%' : '30%')};
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
    }
`;

export const HeaderText = styled.div`
    font-size: 20px;
    font-weight: 700;
    padding: 20px;
`;

export const HeaderRow = styled(LeaderBoardRow)`
    && {
        margin-bottom: 0;
    }
`;
