const fs = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const envConfigFile = `export const environment = {
  production: false,
  googleMapsApiKey: '${process.env.MAPS_API_KEY}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
