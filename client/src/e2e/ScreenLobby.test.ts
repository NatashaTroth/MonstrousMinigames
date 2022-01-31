import { expect, test } from "@playwright/test";

test('test', async ({ page, baseURL }) => {
    await page.goto('/');

    const [response] = await Promise.all([
        // Waits for the next response matching some conditions
        page.waitForResponse(
            response =>
                response.url() === `${process.env.REACT_APP_BACKEND_URL}/create-room` && response.status() === 200
        ),
        // Triggers the response
        page.locator('button:has-text("Create New Room")').click(),
    ]);

    const { roomId } = await response.json();

    const roomCode = page.locator('.roomCode');
    await expect(roomCode).toHaveText(roomId);
});

// test('When creating new room on screen, room code should be rendered at lobby header', async ({ baseURL }) => {
//     const browser = await chromium.launch({
//         args: ['--disable-dev-shm-usage'],
//     });

//     const context = await browser.newContext({ baseURL });
//     const page = await context.newPage();

//     await page.goto(`/`);

//     const [response] = await Promise.all([
//         // Waits for the next response matching some conditions
//         page.waitForResponse(
//             response =>
//                 response.url() === `${process.env.REACT_APP_BACKEND_URL}/create-room` && response.status() === 200
//         ),
//         // Triggers the response
//         page.locator('button:has-text("Create New Room")').click(),
//     ]);

//     const { roomId } = await response.json();

//     const roomCode = page.locator('.roomCode');
//     await expect(roomCode).toHaveText(roomId);
// });

// test('When joining room on screen, room code should be rendered at lobby header', async ({ baseURL }) => {
//     const browser = await chromium.launch({
//         args: ['--disable-dev-shm-usage'],
//     });

//     const createRoomBrowser = await browser.newContext({ baseURL });
//     const createRoomPage = await createRoomBrowser.newPage();
//     await createRoomPage.goto(`/`);

//     const [response] = await Promise.all([
//         // Waits for the next response matching some conditions
//         createRoomPage.waitForResponse(
//             response =>
//                 response.url() === `${process.env.REACT_APP_BACKEND_URL}/create-room` && response.status() === 200
//         ),
//         // Triggers the response
//         createRoomPage.locator('button:has-text("Create New Room")').click(),
//     ]);

//     const { roomId } = await response.json();

//     const joinRoomBrowser = await browser.newContext({ baseURL });
//     const joinRoomPage = await joinRoomBrowser.newPage();
//     await joinRoomPage.goto(`/`);

//     await joinRoomPage.locator('button:has-text("Join Room")').click();
//     await joinRoomPage.fill('#joinRoom', roomId);
//     await joinRoomPage.locator('button:has-text("Enter")').click();

//     const roomCode = joinRoomPage.locator('.roomCode');
//     await expect(roomCode).toHaveText(roomId);
// });

// test('Connect Controller to room and display connected user', async ({ baseURL }) => {
//     const browser = await chromium.launch({
//         args: ['--disable-dev-shm-usage'],
//     });

//     const context = await browser.newContext({ baseURL });
//     const page = await context.newPage();
//     await page.goto('/');

//     const [response] = await Promise.all([
//         // Waits for the next response matching some conditions
//         page.waitForResponse(
//             response =>
//                 response.url() === 'https://monstrous-minigames-staging.herokuapp.com/create-room' &&
//                 response.status() === 200
//         ),
//         // Triggers the response
//         page.locator('button:has-text("Create New Room")').click(),
//     ]);

//     // Create a Chromium browser instance
//     const browser = await chromium.launch();

//     // Create two isolated browser contexts
//     const userContext = await browser.newContext();
//     const adminContext = await browser.newContext();

//     const { devices } = require('playwright');
//     const iPhone = devices['iPhone 11 Pro'];

//     const context = await browser.newContext({
//         ...iPhone,
//         permissions: ['geolocation'],
//         geolocation: { latitude: 52.52, longitude: 13.39 },
//         colorScheme: 'dark',
//         locale: 'de-DE',
//     });
//     const page = await context.newPage();
// });
