## Deploy from server (run this in git root)

https://monstrous-minigames.herokuapp.com/
git config --get remote.heroku.url
git remote remove origin

```
heroku git:remote -a monstrous-minigames-staging

# staging
#heroku git:remote -a monstrous-minigames-staging
heroku create --remote staging
git subtree push --prefix server staging master


# production
#heroku git:remote -a monstrous-minigames
heroku create --remote production
git subtree push --prefix server production master
git add . && git commit -m 'Heroku' && git subtree push --prefix server heroku master

heroku logs --tail

heroku run bash -a "monstrous-minigames"
```

## Google Drive:

https://drive.google.com/drive/folders/12nIxBRxiRxSL93hAsu5RKBRkGE_0gM2m?usp=sharing

## Assets

https://docs.google.com/spreadsheets/d/1YqFcClidcsZotvGdvUa4qLCsIBh16DGblUIBrWJzIv0/edit

## calc length of track

58-60 run forward messages per second!!!!
so 6 per 100ms

time = 90 sec = 90000ms

speed = 2\*6 - every 100 ms (0.1 sec) = 12 (= 0.12 per ms)
obstacles = 5 \* 5000 ms

obstacleTime = 25000
timeLeftForRunning = (90000 - obstacleTime)
howFarCanRun = 0.12\*timeLeftForRunning

(90000-25000) \* 0.12 = 7800

## where should chasers appear

6 \* 2speed per 100ms

12 \* 100 (to get to 10 sec) = 1200 -> chasers should appear at around 800, to give runners a head start

12\*2500 (to get to 25 sec)

## Refactor Game Class according to:

https://gameprogrammingpatterns.com/command.html
https://gameprogrammingpatterns.com/component.html
https://gameprogrammingpatterns.com
