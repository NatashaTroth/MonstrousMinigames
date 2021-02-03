## Deploy from server (run this in git root)

https://monstrous-minigames.herokuapp.com/

```
git subtree push --prefix server heroku master
git add . && git commit -m 'Heroku' && git subtree push --prefix server heroku master

heroku logs --tail
```
