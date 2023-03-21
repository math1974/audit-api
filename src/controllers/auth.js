import { AuthService } from '@services';

import BaseController from './base';

export default class AuthController extends BaseController {
	constructor() {
		super();

		this.authService = new AuthService();
	}

	async login(req, res) {
		try {
			const response = await this.authService.login(req.data);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}
}
