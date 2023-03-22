const dotenv = require('dotenv');

const { default: Database } = require('../config/databases');

dotenv.config({ path: `${__dirname}/../../.env.${process.env.NODE_ENV}` });

const start = async () => {
	await Database.connect();

	return true;
}

start();
