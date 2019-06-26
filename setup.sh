cp ./package.json ../;
cp ./env-template ../.env;
cp ./database-template.json ../database.json;
cp ./archive-channels-template.json ../archive-channels.json;
cp ./config-template.json ../config.json;
cd ..;
npm install;
