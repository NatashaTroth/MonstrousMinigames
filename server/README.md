## Deploy from server (run this in git root)

https://monstrous-minigames.herokuapp.com/

```
heroku git:remote -a monstrous-minigames
git subtree push --prefix server heroku master
git add . && git commit -m 'Heroku' && git subtree push --prefix server heroku master

heroku logs --tail

heroku run bash -a "monstrous-minigames"
```
