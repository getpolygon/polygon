@REM  Installing or updating pm2
npm i pm2 -g

@REM  Starting process on every core
pm2 start --name backend -i -1 ../src/index.js