import express from 'express';
import { queryParser } from 'express-query-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import Database from './config/databases';

import Routes from './config/routes.js';

class App {
	constructor(port) {
		if (process.env.NODE_ENV !== 'production') {
			dotenv.config({ path: `${__dirname}/../.env.${process.env.NODE_ENV}` });
		}

		this.app = express();

		this.port = port || process.env.PORT || 3000;
	}

	setup() {
		const routes = new Routes();

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(queryParser({ parseNull: true, parseUndefined: true, parseBoolean: true, parseNumber: true }));
		this.app.use(routes.setup());

        this.app.use((error, req, res, next) => {
			if (error) {
				return res.status(500).json({
					status: 'error',
					message: 'Algo de errado aconteceu'
				});
			}

			return next();
		});
	}

	stop() {
		return () => {
			this.app.stop(error => {
				return error ? process.exit(1) : process.exit(0);
			});
		};
	}

	start() {
        return new Promise(async resolve => {
            await Database.connect();

            this.app.listen(this.port, async () => {
                console.log(`Listening on port ${this.port}`)

                this.setup();

                resolve();
            })
        });
	}
}

export default App;
