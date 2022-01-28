/* eslint-disable @typescript-eslint/no-explicit-any */
import interact from 'interactjs';

interface InteractEvent {
    target:
        | {
              style: {
                  transform: string;
              };
              getAttribute: (qualifiedName: string) => string | null;
              setAttribute: (qualifiedName: string, val: string) => void;
          }
        | undefined;
    dx: number;
    dy: number;
}

export function dragMoveListener(event: InteractEvent) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = parseFloat(target?.getAttribute('data-x') || '0') + event.dx;
    const y = parseFloat(target?.getAttribute('data-y') || '0') + event.dy;

    if (target) {
        // translate the element
        target.style.transform = `translate(${x}px, ${y}px)`;
    }

    // update the posiion attributes
    target?.setAttribute('data-x', String(x));
    target?.setAttribute('data-y', String(y));
}

export let itemCounter = 0;

export function initializeInteractListeners(solve: () => void) {
    itemCounter = 0;

    const dropZoneProps = {
        accept: `#decoy`,
        overlap: 0.25,
        ondropactivate: function (event: any) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event: any) {
            const draggableElement = event.relatedTarget;
            const dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        },
        ondragleave: function (event: any) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        },
        ondrop: function (event: any) {
            itemCounter += 1;
            event.relatedTarget.classList.remove('drag-drop');

            if (itemCounter === 2) {
                setTimeout(() => solve(), 600);
            }
        },
        ondropdeactivate: function (event: any) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        },
    };

    interact('.meadow').dropzone(dropZoneProps);

    interact('.bag').dropzone({ ...dropZoneProps, accept: `#sheep` });

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
