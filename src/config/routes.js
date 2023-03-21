import { Router } from "express";

import { AuthMiddleware } from '@middlewares';

import {
	AuthRoutes,
	UserRoutes,
	FinanceTransactionRoutes
} from '@routes'

export default class Routes {
    constructor() {
        this.router = new Router();

        this.authRoutes = new AuthRoutes();
        this.userRoutes = new UserRoutes();
        this.financeTransactionRoutes = new FinanceTransactionRoutes();
    }

    setup() {
        this.router.use('/auth', this.authRoutes.setup())
        this.router.use('/users', this.userRoutes.setup())
        this.router.use('/finance-transactions', AuthMiddleware.isAuthorized, this.financeTransactionRoutes.setup())

        return this.router;
    }
}
