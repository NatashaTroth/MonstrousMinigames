## Deploy from server (run this in git root)

https://monstrous-minigames.herokuapp.com/

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
