// timerGame.js
"use strict";

function timerGame(callback) {
  console.log("Ready....go!");
  setTimeout(() => {
    console.log("Times up -- stop!");
    callback && callback();
  }, 1000);
}

module.exports = timerGame;
// __tests__/timerGame-test.js
("use strict");

jest.useFakeTimers();

test("waits 1 second before ending the game", () => {
  // const timerGame = timerGame;
  timerGame();

  expect(setTimeout.mock.calls.length).toBe(1);
  expect(setTimeout.mock.calls[0][1]).toBe(1000);
});
