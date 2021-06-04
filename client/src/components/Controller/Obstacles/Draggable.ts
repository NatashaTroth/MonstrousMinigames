import interact from 'interactjs';

export function dragMoveListener(event: { target: any; dx: number; dy: number }) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.transform = `translate(${x}px, ${y}px)`;

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

export let stoneCounter = 0;

export function initializeInteractListeners() {
    // enable draggables to be dropped into this
    interact('.dropzone').dropzone({
        // only accept elements matching this CSS selector
        accept: '#stone',
        // Require a 75% element overlap for a drop to be possible
        overlap: 1,

        // listen for drop related events:

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
            stoneCounter += 1;
            event.relatedTarget.classList.remove('drag-drop');

            if (stoneCounter === 3) {
                // TODO
                // eslint-disable-next-line no-console
                console.log('obstacle solved');
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
