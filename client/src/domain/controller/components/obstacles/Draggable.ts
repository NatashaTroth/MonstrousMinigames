import { InteractEvent } from '@interactjs/types';
import interact from 'interactjs';

import { TrashType } from '../../../../utils/constants';

export function dragMoveListener(event: InteractEvent) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = parseFloat(target?.getAttribute('data-x') || '0') + event.dx;
    const y = parseFloat(target?.getAttribute('data-y') || '0') + event.dy;

    // translate the element
    target.style.transform = `translate(${x}px, ${y}px)`;

    // update the posiion attributes
    target.setAttribute('data-x', String(x));
    target.setAttribute('data-y', String(y));
}

export let itemCounter = 0;

export function initializeInteractListeners(
    actualItem: TrashType,
    counter: number,
    solveObstacle: () => void,
    setProgress: (val: number) => void
) {
    itemCounter = 0;

    interact('.dropzone').dropzone({
        accept: `#${actualItem}`,
        overlap: 1,

        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            const draggableElement = event.relatedTarget;
            const dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        },
        ondrop: function (event) {
            itemCounter += 1;
            setProgress(itemCounter);
            event.relatedTarget.classList.remove('drag-drop');
            event.relatedTarget.classList.add('invisible');

            if (itemCounter === counter) {
                setTimeout(() => solveObstacle(), 600);
            }
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        },
    });

    interact('.drag-drop').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true,
            }),
        ],
        autoScroll: true,
        listeners: { move: dragMoveListener },
    });
}
