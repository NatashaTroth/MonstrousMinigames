import { expect, test } from '@playwright/test';

test('Render room code at lobby header', async ({ page }) => {
    await page.goto('/');

    const [response] = await Promise.all([
        // Waits for the next response matching some conditions
        page.waitForResponse(
            response =>
                response.url() === 'https://monstrous-minigames-staging.herokuapp.com/create-room' &&
                response.status() === 200
        ),
        // Triggers the response
        page.locator('button:has-text("Create New Room")').click(),
    ]);

    const { roomId } = await response.json();

    const roomCode = page.locator('.roomCode');
    await expect(roomCode).toHaveText(roomId);
});
