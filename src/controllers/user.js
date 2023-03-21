import { UserService } from '@services';

import BaseController from './base';

export default class UserController extends BaseController {
	constructor() {
		super();

		this.userService = new UserService();
	}

	async create(req, res) {
		try {
			const response = await this.userService.create(req.data);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}

	async update(req, res) {
		try {
			const options = {
				filter: {
					logged_user_id: req.auth.id
				},
				changes: req.data
			};

			const response = await this.userService.update(options);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}

	async remove(req, res) {
		try {
			const filter = {
				logged_user_id: req.auth.id
			};

			const response = await this.userService.remove(filter);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}

	async find(req, res) {
		try {
			const filter = {
				id: req.auth.id
			};

			const response = await this.userService.find(filter);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}
}
