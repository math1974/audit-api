import { Router } from "express";

import {
	AuthRoutes,
	UserRoutes
} from '@routes'

export default class Routes {
    constructor() {
        this.router = new Router();

        this.authRoutes = new AuthRoutes();
        this.userRoutes = new UserRoutes();
    }

    setup() {
        this.router.use('/auth', this.authRoutes.setup())
        this.router.use('/users', this.userRoutes.setup())

        return this.router;
    }
}
