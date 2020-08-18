# EC2-repo
put together React app and Express server on a AWS EC2

## Install packages

install packages for app, server and global repo : 

- `npm run install-app`
- `npm run install-server`
- `npm run install-main`

## Env configuration

You will need a `.env` file at root with following entries :
``` 
PORT = 8080 // if your website entry is on port 8080
PORT_WEBPACK = 8008 // only for dev
DBUSER= // user for mongodb
DBPASS= // pass for mongodb
CLUSTER= // cluste for mongodb
```

## Dev the app

On your machine, following install packages step
You can run `npm run start-dev` that will run both the server on dev mode, and `webpack-dev` on dev mode with HMR.
App will be available on PORT_WEBPACK.


## Build the app

On your server instance : 
- git clone this repo and cd into it
- You can run `npm run build` to create the production bundle
- You can run `npm run server` to start the server in production mode

