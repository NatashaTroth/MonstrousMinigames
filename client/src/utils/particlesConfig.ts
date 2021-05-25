import { InteractivityDetect, MoveDirection, OutMode } from 'react-particles-js';

export const particlesConfig = {
    particles: {
        number: {
            value: 400,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        color: {
            value: '#894924',
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000',
            },
            polygon: {
                nb_sides: 4,
            },
            image: {
                src: 'img/github.svg',
                width: 100,
                height: 100,
            },
        },
        opacity: {
            value: 0.49716301422833176,
            random: true,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
            },
        },
        size: {
            value: 15.782952832645451,
            random: true,
            anim: {
                enable: false,
                speed: 9.59040959040959,
                size_min: 0.1,
                sync: false,
            },
        },
        line_linked: {
            enable: false,
            distance: 500,
            color: '#ffffff',
            opacity: 0.4,
            width: 2,
        },
        move: {
            enable: true,
            speed: 20,
            direction: MoveDirection.none,
            random: true,
            straight: false,
            outMode: OutMode.out,
            bounce: false,
            attract: {
                enable: false,
                rotateX: 315.65905665290904,
                rotateY: 1420.4657549380909,
            },
        },
    },
    interactivity: {
        detect_on: InteractivityDetect.canvas,
        events: {
            onhover: {
                enable: false,
                mode: 'bubble',
            },
            onclick: {
                enable: false,
                mode: 'repulse',
            },
            resize: true,
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 0.5,
                },
            },
            bubble: {
                distance: 400,
                size: 4,
                duration: 0.3,
                opacity: 1,
                // speed: 3,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
            push: {
                particles_nb: 4,
            },
            remove: {
                particles_nb: 2,
            },
        },
    },
    retina_detect: true,
};
