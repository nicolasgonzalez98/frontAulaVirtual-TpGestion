const fs = require('fs');
const path = require('path');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const envDir = path.dirname(targetPath);

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const envConfigFile = `export const environment = {
  production: false,
  googleMapsApiKey: '${process.env.MAPS_API_KEY}',
  api_url_dev: '${process.env.API_URL_DEV}',
  front_url_dev: '${process.env.FRONT_URL_DEV}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
