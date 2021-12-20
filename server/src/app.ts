import dotenv from 'dotenv';

import initApp from './initApp';

// load the environment variables from the .env file
dotenv.config({
    path: '.env',
});

const port = Number(process.env.PORT);

const app = initApp(port);
app.run();
