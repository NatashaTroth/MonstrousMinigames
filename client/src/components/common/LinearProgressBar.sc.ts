import { LinearProgress } from '@material-ui/core'
import styled from 'styled-components'

import {
    grey,
    lightgrey,
    progressBarExtremeLightGreen,
    progressBarGreen,
    progressBarLightGreen,
} from '../../utils/colors'

export const LinearProgressContainer = styled.div`
    width: 80%;
    border: 3px solid ${grey};
    margin: 20px 0;
`

export const StyledLinearProgress = styled(LinearProgress)`
    && {
        height: 30px;
        margin: 3px;
        background-color: ${lightgrey};

        .MuiLinearProgress-barColorPrimary {
            background: linear-gradient(
                180deg,
                ${progressBarExtremeLightGreen} 0,
                ${progressBarExtremeLightGreen} 10%,
                ${progressBarLightGreen} 10%,
                ${progressBarLightGreen} 50%,
                ${progressBarGreen} 50%,
                ${progressBarGreen} 100%
            );
        }
    }
`
