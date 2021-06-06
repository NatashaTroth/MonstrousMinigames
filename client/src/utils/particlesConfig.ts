import { InteractivityDetect, IParticlesParams, MoveDirection, OutMode, RotateDirection } from 'react-particles-js';

import pebble from '../images/pebbleParticle.svg';
import splinter from '../images/splinter.svg';

export const stoneParticlesConfig: IParticlesParams = {
    fpsLimit: 60,
    particles: {
        number: {
            value: 0,
        },
        collisions: {
            enable: false,
        },
        rotate: {
            value: 0,
            random: true,
            direction: RotateDirection.clockwise,
            animation: {
                enable: true,
                speed: 5,
                sync: false,
            },
        },
        shape: {
            type: 'image',
            image: {
                src: pebble,
                width: 200,
                height: 200,
                replaceColor: false,
            },
        },
        opacity: {
            value: 1,
            random: false,
            animation: {
                enable: false,
                speed: 1,
                minimumValue: 0.1,
                sync: false,
            },
        },
        size: {
            value: 10,
            random: true,
        },
        links: {
            enable: false,
        },
        move: {
            enable: true,
            gravity: {
                enable: false,
                acceleration: 9.81,
                maxSpeed: 50,
            },
            speed: 2,
            direction: MoveDirection.none,
            random: false,
            straight: false,
            outModes: {
                default: OutMode.destroy,
            },
            trail: {
                enable: false,
                fillColor: '#000000',
                length: 10,
            },
        },
    },
    interactivity: {
        detectsOn: InteractivityDetect.canvas,
        events: {
            resize: true,
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1,
                },
            },
            bubble: {
                distance: 200,
                size: 40,
                duration: 2,
                opacity: 1,
            },
            repulse: {
                distance: 200,
            },
            push: {
                particles_nb: 4,
            },
            remove: {
                particles_nb: 2,
            },
        },
    },
    detectRetina: true,
    emitters: {
        direction: MoveDirection.none,
        rate: {
            delay: 0.1,
            quantity: 2,
        },
        position: {
            x: 50,
            y: 50,
        },
        size: {
            width: 0,
            height: 0,
        },
        spawnColor: {
            value: '#ff0000',
            animation: {
                enable: true,
                speed: 5,
                sync: false,
            },
        },
        particles: {
            bounce: {
                vertical: {
                    value: 0.8,
                    random: {
                        enable: true,
                        minimumValue: 0.4,
                    },
                },
            },
            color: {
                value: '#ff0000',
            },
            links: {
                enable: false,
            },
            opacity: {
                value: 1,
            },
            move: {
                speed: 5,
                random: false,
            },
        },
    },
};

export const treeParticlesConfig: IParticlesParams = {
    fpsLimit: 60,
    particles: {
        number: {
            value: 0,
        },
        collisions: {
            enable: false,
        },
        rotate: {
            value: 0,
            random: true,
            direction: RotateDirection.clockwise,
            animation: {
                enable: true,
                speed: 5,
                sync: false,
            },
        },
        shape: {
            type: 'image',
            image: {
                src: splinter,
                width: 200,
                height: 200,
                replaceColor: false,
            },
        },
        opacity: {
            value: 1,
            random: false,
            animation: {
                enable: false,
                speed: 1,
                minimumValue: 0.1,
                sync: false,
            },
        },
        size: {
            value: 20,
            random: true,
        },
        links: {
            enable: false,
        },
        move: {
            enable: true,
            gravity: {
                enable: false,
                acceleration: 9.81,
                maxSpeed: 50,
            },
            speed: 2,
            direction: MoveDirection.none,
            random: false,
            straight: false,
            outModes: {
                default: OutMode.destroy,
            },
            trail: {
                enable: false,
                fillColor: '#000000',
                length: 10,
            },
        },
    },
    interactivity: {
        detectsOn: InteractivityDetect.canvas,
        events: {
            resize: true,
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1,
                },
            },
            bubble: {
                distance: 200,
                size: 40,
                duration: 2,
                opacity: 1,
            },
            repulse: {
                distance: 200,
            },
            push: {
                particles_nb: 4,
            },
            remove: {
                particles_nb: 2,
            },
        },
    },
    detectRetina: true,
    emitters: {
        direction: MoveDirection.none,
        rate: {
            delay: 0.1,
            quantity: 2,
        },
        position: {
            x: 50,
            y: 50,
        },
        size: {
            width: 0,
            height: 0,
        },
        spawnColor: {
            value: '#ff0000',
            animation: {
                enable: true,
                speed: 5,
                sync: false,
            },
        },
        particles: {
            bounce: {
                vertical: {
                    value: 0.8,
                    random: {
                        enable: true,
                        minimumValue: 0.4,
                    },
                },
            },
            color: {
                value: '#ff0000',
            },
            links: {
                enable: false,
            },
            opacity: {
                value: 1,
            },
            move: {
                speed: 5,
                random: false,
            },
        },
    },
};
