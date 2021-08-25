import { sendMovement } from '../controller/gameState/sendMovement';
import { Socket } from '../socket/Socket';

export default function addMovementListener(controllerSocket: Socket, hasPaused: boolean, playerFinished: boolean) {
    window.addEventListener(
        'devicemotion',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event: any) => {
            event.preventDefault();
            if (event?.acceleration?.x && (event.acceleration.x < -2 || event.acceleration.x > 2) && !playerFinished) {
                sendMovement(controllerSocket, hasPaused);
            }
        }
    );
}
