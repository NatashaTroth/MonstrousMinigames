import { Typography } from '@material-ui/core';
import React from 'react';
import { Field, FieldRenderProps, Form } from 'react-final-form';
import styled from 'styled-components';

import Button from '../../../../components/common/Button';
import { StyledButton, StyledImg, StyledLabel, UploadWrapper } from './PhotoForm.sc';
import { UploadProps } from './TakePicture';

interface PhotoFormProps {
    upload: (values: UploadProps) => void;
    preview: string | undefined;
    setPreview: (val: string | undefined) => void;
}

const PhotoForm: React.FunctionComponent<PhotoFormProps> = ({ upload, preview, setPreview }) => (
    <Form
        mode="add"
        onSubmit={upload}
        render={({ handleSubmit, values, form }) => (
            <form
                onSubmit={val => {
                    handleSubmit(val);
                    form.reset();
                }}
            >
                <Field
                    type="file"
                    name="picture"
                    label="Picture"
                    render={({ input, meta }) => (
                        <FileInput input={input} meta={meta} preview={preview} setPreview={setPreview} />
                    )}
                    fullWidth
                />
                <StyledButton type="submit" disabled={!values.picture}>
                    Upload
                </StyledButton>
            </form>
        )}
    />
);

export default PhotoForm;

interface FileInputProps extends FieldRenderProps<string, HTMLElement> {
    preview: string | undefined;
    setPreview: (val: string | undefined) => void;
}

const FileInput: React.FC<FileInputProps> = ({ input: { value, onChange, ...input }, meta, preview, setPreview }) => {
    const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        if (target.files && target.files[0]) {
            setPreview(URL.createObjectURL(target.files[0]));
            onChange(target.files[0]);
        }
    };

    return (
        <UploadWrapper>
            {preview && (
                <PreviewContainer>
                    <StyledImg src={preview} alt="" />
                </PreviewContainer>
            )}
            <Button size="small">
                <StyledLabel>
                    <input
                        type="file"
                        accept="image/*"
                        capture="camera"
                        data-testid="image-upload"
                        onChange={handleChange}
                    />
                    <Typography>{preview ? 'Retake' : 'Take picture'}</Typography>
                </StyledLabel>
            </Button>
        </UploadWrapper>
    );
};

const PreviewContainer = styled.div`
    display: flex;
    justify-content: center;
`;
