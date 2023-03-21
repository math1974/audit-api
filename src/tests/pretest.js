const start = async () => {
	const { default: Database } = require('@config/databases')

	const dotenv = require('dotenv');

	dotenv.config({ path: `${__dirname}/../../.env.${process.env.NODE_ENV}` });

	const port = process.env.PORT + process.env.JEST_WORKER_ID;

	const databaseModule = new Database();

	if (Object.keys(databaseModule.models).length === 0) {
		await databaseModule.connect();
	}

	process.env.PORT = port;
}

start();
