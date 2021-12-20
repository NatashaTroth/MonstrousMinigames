import dotenv from 'dotenv';

import initApp from './initApp';

// load the environment variables from the .env file
dotenv.config({
    path: '.env',
});

const port: number = parseInt(`${process.env.PORT}`, 10) || 5000;
const app = initApp(port);
app.run();
