import { chromium, devices, expect, test } from "@playwright/test";

test.describe('ScreenLobby', () => {
    // test('When creating a room on screen, room code should be rendered at lobby header', async ({ baseURL }) => {
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
    //                 response.url() === `${process.env.REACT_APP_BACKEND_URL}create-room` && response.status() === 200
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
    //                 response.url() === `${process.env.REACT_APP_BACKEND_URL}create-room` && response.status() === 200
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

    test('When joining with controller, username should be rendered at lobby', async ({ baseURL }) => {
        const browser = await chromium.launch({
            args: ['--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
        });

        const screenBrowser = await browser.newContext({ baseURL });
        const screenPage = await screenBrowser.newPage();
        await screenPage.goto(`/`);

        const [response] = await Promise.all([
            // Waits for the next response matching some conditions
            screenPage.waitForResponse(
                response =>
                    response.url() === `https://monstrous-minigames-staging.herokuapp.com/create-room` &&
                    response.status() === 200
            ),
            // Triggers the response
            screenPage.locator('button:has-text("Create New Room")').click(),
        ]);

        const { roomId } = await response.json();

        const phone = devices['iPhone 11 Pro'];

        const controllerBrowser = await browser.newContext({
            baseURL,
            ...phone,
        });

        const controllerPage = await controllerBrowser.newPage();
        await controllerPage.goto(`/`);

        await controllerPage.locator('button:has-text("Skip")').click();

        const elementHandle = await controllerPage.waitForSelector('iframe');
        const frame = await elementHandle.contentFrame();

        await frame?.waitForSelector('#controllerName');
        const username = await frame?.$('#controllerName');
        await username?.type('NameToTest');

        await frame?.waitForSelector('#controllerRoomId');
        const room = await frame?.$('#controllerRoomId');
        await room?.type(roomId);

        await controllerPage.locator('button:has-text("Enter")').click();

        await controllerPage.screenshot({ path: 'controller1.png' });
        await screenPage.screenshot({ path: 'screen1.png' });

        const userName = await screenPage.$("text='NameToTest'");
        await expect(userName).toBeTruthy();
    });
});
