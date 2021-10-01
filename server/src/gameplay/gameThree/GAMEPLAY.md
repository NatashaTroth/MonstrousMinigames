# Gameplay Features | Mini game 3 | Photo Game

(All of the following only focus on gameplay, examples of how it could look are only for the purpose of explaining possible gameplay features)

## Focus

-   Focuses not too much on player rivalry, but rather on having a nice time with friends (highly inspired by jackbox games)
-   This mini game heavily lies on the player's creativity
-   This game is best played with maximum players and cannot be played under the number of 3 players

## Flow

Once the players join in the game, they will all be presented with a topic (e.g. Cheesecake). Upon presentation of the topic a global timer shows on the shared screen which displays the remaining time the players can submit a picture taken with their phone camera. The timers duration is 60 seconds.

**On screen during timer:**

-   take a picture with your camera
-   use this picture?
    ⇒ Yes: submit the picture and wait for others to finish.
    ⇒ No: dismiss the last one and take another before the timer runs out.
-   If the timer runs out and the player didn't take a picture, the player gets automatically a random picture of our database, submited.

**After every player submitted or timer ran out or timer ran out:**

-   All of the pictures gets revealed and another global timer starts counting down from 30 seconds.
-   Now each player needs to pick a picture that best fit the topic. (not including their own picture)
-   Once selected the player needs to wait for everybody to finish.
-   If a player doesn't choose a picture, they will get no points for this round.

**After every player has chosen or timer ran out:**

-   For each vote a player gets on their picture, they will receive 1 point.

... this flow repeats 3 times until the final round starts.

### Final Round

**Picture creation phase:**

-   In the final round the player can take up to 3 pictures, while the timer's duration is 180 seconds. This time there is no featured topic.
-   If the player takes only 1 or 2 pictures until the timer runs out, they will just have to work with them.
-   If a player takes no pictures, they get auto filled 3 pictures of our database.

**Picture reveal phase:**

-   Instead of all pictures being revealed, each player has 30 seconds duration showcase, where only their pictures are being revealed. Within the timer the player is supposed to tell a story combining all pictures in the taken order.
-   The players can also skip their showcase if they don't have anything to add any more, by pressing a skip button on their phone.
-   After each player had their turn every player needs to choose one story within 30 seconds. (not including their own)

**Score phase:**

-   This time for each vote a player gets 3 points each.

### End of the mini game

The shared screen shows a victory pedestal where the 1st, 2nd and 3rd place monsters stand on.

---

## Game run through - backend

Need to keep track of points

1. Admin user creates and starts game
2. Game sends start countdown
3. Game sends topic and countdown timer

4. Sync timer with backend periodically - but how?? TODO

5. If no picture after time - no points
6. Send all pictures to screen, send voting to controller, timer to vote
7. Collect and tally votes, if not vote - player gets no points. 1 point per vote
8. FINAL ROUND: TODO

## Connection: Controller - Server - Screen
