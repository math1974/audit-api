import { Router } from 'express';
import { AuthMiddleware } from '@middlewares';

class BaseRoutes {
	constructor() {
		this.router = new Router();

		this.AuthMiddleware = AuthMiddleware;
	}
}

export default BaseRoutes;
