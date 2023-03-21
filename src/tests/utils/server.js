import express from 'express';
import dotenv from 'dotenv';
import Routes from '@config/routes';
import Database from '../../config/databases';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: `${__dirname}/../.env.${process.env.NODE_ENV}` });
}

export const app = express();

const databaseModule = new Database();

if (Object.keys(databaseModule.models).length === 0) {
	databaseModule.connect();
}

app.use(express.json());

const routes = new Routes();

app.use(routes.setup());

export default app;
