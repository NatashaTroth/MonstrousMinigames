import { Typography } from "@material-ui/core";
import styled from "styled-components";

// https://stackoverflow.com/questions/21842274/cross-browser-custom-styling-for-file-upload-button
export const StyledLabel = styled.label`
    &:hover {
        cursor: pointer;
    }

    input[type='file'] {
        position: absolute;
        top: -1000px;
    }
`;

export const UploadWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin-bottom: 20px;
`;

export const FileName = styled(Typography)`
    && {
        margin-left: 10px;
        display: flex;
        align-items: center;
    }
`;

export const StyledImg = styled.img`
    display: flex;
    width: 60%;
    margin-bottom: 20px;
`;
