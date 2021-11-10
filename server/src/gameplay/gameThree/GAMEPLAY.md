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

... this flow repeats 2 times until the final round starts.

### Final Round

**Picture creation phase:**

-   In the final round the player can take up to 3 pictures, while the timer's duration is 180 seconds. This time there is no featured topic.
-   If the player takes only 1 or 2 pictures until the timer runs out, they will just have to work with them.
-   If a player takes no pictures, they get auto filled 3 pictures of our database. -??? NO POINTS??

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
4. Send all pictures to screen, send voting to controller, timer to vote
5. Collect and tally votes, if not vote - player gets no points.

6. Sync timer with backend periodically - but how?? TODO

7. FINAL ROUND: TODO
   9:take up to 3 pictures, while the timer's duration is 180 seconds - no topic
   10: If a player takes no pictures, they get auto filled 3 pictures of our database
   11: each player has 30 seconds duration showcase, where only their pictures are being revealed.
   12: can also skip their showcase if they don't have anything to add any more,
   13: After each player had their turn every player needs to choose one story within 30 seconds - 3 points per vote
   12: return final points

urls weiterschicken - von client bekommen

storage hinten - nach spiel alles löschen

## Connection: Controller - Server - Screen

1.) Game is started (screen admin creates and starts, server sends initial game state and start countdown)
2.) Server sends the first game Topic and countdown to take photos to client (SCREEN + CONTROLLER): 'game3/newPhotoTopic'

```typescript
{
    roomId: string;
    topic: string;
    countdownTime: number; //ms
}
```

3.) Controller takes a photo and sends to server: 'game3/photo'

```typescript
{
    url: string;
}
```

4.) When the take photos timer runs out or all photos have been sent (whichever is first), server sends the photo urls and photographerId to client (SCREEN + CONTROLLER): 'game3/voteForPhotos'

```typescript
{
    roomId: string;
    photoUrls: photoPhotographerMapper[];
    countdownTime: number;
}

//photoPhotographerMapper:
export interface photoPhotographerMapper {
    photographerId: string;
    photoId: number;
    url: string;
}
```

5.) Controllers send votes to server: 'game3/photoVote'

```typescript
{
    voterId: string;
    photographerId: string;
}
```

6.) When the voting timer runs out or all votes have been sent (whichever is first), the server sends the results to the client (SCREEN + CONTROLLER): 'game3/photoVotingResults'

```typescript
 {
    roomId: string;
    results: votingResultsPhotographerMapper[];
    countdownTime: number;
}

//votingResultsPhotographerMapper:
export interface votingResultsPhotographerMapper {
    photographerId: string;
    points: number;
}
```

7.) After the viewing voting results countdown is over, the server changes the round and either sends a new photo topic (see step 2), or if it is the final round, the server sends 'game3/takeFinalPhotosCountdown':

```typescript
roomId: string;
countdownTime: number;
```

--- Final round ---
8.) Server sends 'game3/takeFinalPhotosCountdown':

```typescript
roomId: string;
countdownTime: number;
```

9.) Controller takes a photos and sends them individually to server: 'game3/photo'

```typescript
{
    url: string;
}
```

10.) When the take final photos timer runs out or all photos have been sent (whichever is first), server sends the photo urls of one player (photographerId - random order) to client (SCREEN + CONTROLLER): 'game3/presentFinalPhotos'

```typescript
{
    roomId: string;
    countdownTime: number;
    photographerId: string;
    photoUrls: string[];
}
```

11.) When countdown runs out, or presenting play clicks on the finished button, the photos of the next random photographer are sent ('game3/presentFinalPhotos'). (and so on until all players have presented)

12.) Once all players have presented their photos, the final voting stage message is sent to the client (SCREEN + CONTROLLER) 'game3/voteForFinalPhotos'

13.) Controllers send their votes 'game3/finishedPresenting' (same message content as voting before)

```typescript
{
    voterId: string;
    photographerId: string;
}
```

14.) After time runs out or all votes are sent (whichever is first), the server sends the final results to the client (SCREEN + CONTROLLER) 'game3/finalResults'. The gameState is set to FINISHED.

```typescript
 {
    roomId: string;
    results: finalResults[];
}

//votingResultsPhotographerMapper:
export interface finalResults {
    photographerId: string;
    points: number;
    rank: number;
}
```

Other:
Every time a new round starts: get 'game3/newRound' message

---------MAGDA FRAGEN----------

//**\_\_\_**
Punkte system: final round 1 pkt pro foto den man abschickt - max 3 fotos

final round - 1 pkt pro vote

automatisch punkte wenn vorher nur 1 person in runde foto - skip vote message - kriegt alle punkte für die runde
