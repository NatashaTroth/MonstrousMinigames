import { Dialog, Typography } from '@material-ui/core';
import * as React from 'react';

import { DialogContent, StyledTypography } from './GettingStarted.sc';

interface GettingStartedDialog {
    open: boolean;
    handleClose: () => void;
}
const GettingStartedDialog: React.FunctionComponent<GettingStartedDialog> = ({ handleClose, ...props }) => {
    return (
        <Dialog
            {...props}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    padding: 20,
                },
            }}
            onClose={handleClose}
            maxWidth="md"
        >
            <DialogContent>
                <Typography variant="h4" gutterBottom>
                    Welcome to Monstrous Mini Games!
                </Typography>
                <StyledTypography>
                    A group of peaceful monsters have decided to spend tonight in the forest where they have set up
                    their camp. Between their tents they have lit a warming campfire. They grill marshmallows, tell each
                    other stories and enjoy the starry night. But what would camping be without a little pinch of
                    adventure? The monsters are not alone in the forest, as there are gigantic mosquitoes whose poison
                    makes you start singing Helene Fischer songs. Can you help the monsters escape?
                </StyledTypography>
                <StyledTypography>
                    Mini games are waiting for you to play together with your friends, no matter if you are sitting
                    together or far away from each other. This screen serves as a game board on which part of the game
                    will take place. In addition, however, each player needs his or her own smartphone. Each of you gets
                    your own monster that you can control through your mobile phone. Once you have created or joined a
                    room, you can connect your mobile phone via the QR code.
                </StyledTypography>
                <StyledTypography>
                    The monsters are controlled by various input methods, such as mobile phone movement, via the
                    microphone or the touch screen. In order for this to work, you must give permission to access these
                    sensors when asked. If you are asked to shake the mobile phone, please be careful not to shake it
                    too much, as this can cause damage to the mobile phone and possibly also to your surroundings. At
                    the beginning of each game there is a detailed explanation of which input methods are required.
                </StyledTypography>
            </DialogContent>
        </Dialog>
    );
};

export default GettingStartedDialog;
