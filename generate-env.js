const fs = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const envConfigFile = `export const environment = {
  production: false,
  googleMapsApiKey: '${process.env.MAPS_API_KEY}',
  api_url_dev: '${process.env.API_URL_DEV}',
  front_url_dev: '${process.env.FRONT_URL_DEV}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);

