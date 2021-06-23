import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface FunctionalIFrameComponent {
    title: string;
}

const FunctionalIFrameComponent: React.FunctionComponent<FunctionalIFrameComponent> = ({
    children,
    title,
    ...props
}) => {
    const [contentRef, setContentRef] = useState<null | HTMLIFrameElement>(null);
    const mountNode = contentRef?.contentWindow?.document?.body;

    return (
        <iframe title={title} {...props} ref={setContentRef}>
            <link type="text/css" rel="Stylesheet" href="iframe.css" />
            {mountNode && createPortal(children, mountNode)}
        </iframe>
    );
};

export default FunctionalIFrameComponent;
