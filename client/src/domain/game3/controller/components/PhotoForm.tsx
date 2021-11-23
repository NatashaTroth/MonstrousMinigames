import { Typography } from "@material-ui/core";
import React from "react";
import { Field, FieldRenderProps, Form } from "react-final-form";

import Button from "../../../../components/common/Button";
import { UploadProps } from "./TakePicture";
import { StyledImg, StyledLabel, UploadWrapper } from "./TakePicture.sc";

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
                <Button type="submit" disabled={!values.picture} size="small">
                    Upload
                </Button>
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
            {preview && <StyledImg src={preview} alt="" />}
            <Button>
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
