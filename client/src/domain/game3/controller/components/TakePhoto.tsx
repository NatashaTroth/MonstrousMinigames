import { Typography } from '@material-ui/core';
import * as React from 'react';
import { Field, FieldRenderProps, Form } from 'react-final-form';

import Button from '../../../../components/common/Button';
import { FirebaseContext } from '../../../../contexts/FirebaseContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import uploadFile from '../../../storage/uploadFile';
import { ScreenContainer, StyledImg, StyledLabel, UploadWrapper } from './TakePhoto.sc';

interface UploadProps {
    picture: File;
}

const TakePicture: React.FunctionComponent = () => {
    const { storage } = React.useContext(FirebaseContext);
    const { roomId } = React.useContext(GameContext);
    const { userId } = React.useContext(PlayerContext);
    const { challengeId } = React.useContext(Game3Context);

    const upload = async (values: UploadProps) => {
        if (!values.picture) return;

        if (storage && roomId) {
            const success = await uploadFile(storage, values.picture, roomId, userId, challengeId);
            if (success) {
                // todo
            }
        }
    };

    return (
        <ScreenContainer>
            <Form
                mode="add"
                onSubmit={upload}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Field
                            type="file"
                            name="picture"
                            label="Picture"
                            render={({ input, meta }) => <FileInput input={input} meta={meta} />}
                            fullWidth
                        />
                        <Button type="submit" disabled={!values.picture}>
                            Upload
                        </Button>
                    </form>
                )}
            />
        </ScreenContainer>
    );
};

export default TakePicture;

const FileInput: React.FC<FieldRenderProps<string, HTMLElement>> = ({ input: { value, onChange, ...input }, meta }) => {
    const [preview, setPreview] = React.useState<undefined | string>();
    const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        if (target.files && target.files[0]) {
            setPreview(URL.createObjectURL(target.files[0]));
            onChange(target.files[0]);
        }
    };

    return (
        <UploadWrapper>
            {preview && <StyledImg src={preview} alt="" />}
            <Button>
                <StyledLabel>
                    <input type="file" accept="image/*" capture="camera" onChange={handleChange} />
                    <Typography>{preview ? 'Retake' : 'Take picture'}</Typography>
                </StyledLabel>
            </Button>
        </UploadWrapper>
    );
};
