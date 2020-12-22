window.onload = function () {
    if (
        window.DeviceMotionEvent &&
        typeof window.DeviceMotionEvent.requestPermission === 'function'
    ) {
        // Check if is IOS 13 when page loads.
        if (
            window.DeviceMotionEvent &&
            typeof window.DeviceMotionEvent.requestPermission === 'function'
        ) {
            // Everything here is just a lazy banner. You can do the banner your way.
            const banner = document.createElement('div');
            banner.innerHTML = `<div style="z-index: 1; position: absolute; width: 100%; background-color:#000; color: #fff"><p style="padding: 10px">Click here to enable DeviceMotion</p></div>`;
            banner.onclick = ClickRequestDeviceMotion; // You NEED to bind the function into a onClick event. An artificial 'onClick' will NOT work.
            document.querySelector('body').appendChild(banner);
        }
    }
};

function ClickRequestDeviceMotion() {
    window.DeviceMotionEvent.requestPermission()
        .then((response) => {
            if (response === 'granted') {
                window.addEventListener('deviceorientation', (e) => {
                    console.log('Deviceorientation: ');
                    console.log(e);
                });

                window.addEventListener(
                    'devicemotion',
                    (event) => {
                        console.log(
                            'DeviceMotion: ' + event.acceleration.x + ' m/s2'
                        );
                    },
                    (e) => {
                        throw e;
                    }
                );
            } else {
                console.log('DeviceMotion permissions not granted.');
            }
        })
        .catch((e) => {
            console.error(e);
        });
}
