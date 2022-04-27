# next-exam

the next iteration of the life-exam project

basic communication between teacher and client instances is reduced to simple API calls over http
networking is moved from twisted to node express

service discovery is done with a simple multicastserver/client which stores necessary information in it's 'clientinfo' or 'serverinfo' object.

# technologies used
* electron
* vite
* node.js
* node-express
* vue.js
* bootstrap.css
* jquery


Node v16.14.0

## install necessary modules 

```npm i```

## run next-exam 

```npm run dev```

## run next-exam webversion

```npm run dev:web```

## build next-exam 

```npm run build```

attention : in order to build for windows on linux you need to ```apt install wine```


## download latest builds
https://life-edu.eu/next-exam/




## more information

read /info/concept.md !!





![projectstructure](/info/structure.jpg)

![screenshot](/info/screenshot.png)




