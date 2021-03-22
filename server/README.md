## Deploy from server (run this in git root)

https://monstrous-minigames.herokuapp.com/

```
heroku git:remote -a monstrous-minigames
git subtree push --prefix server heroku master
git add . && git commit -m 'Heroku' && git subtree push --prefix server heroku master

heroku logs --tail

heroku run bash -a "monstrous-minigames"
```

## Google Drive:

https://drive.google.com/drive/folders/12nIxBRxiRxSL93hAsu5RKBRkGE_0gM2m?usp=sharing

## Assets

https://docs.google.com/spreadsheets/d/1YqFcClidcsZotvGdvUa4qLCsIBh16DGblUIBrWJzIv0/edit
