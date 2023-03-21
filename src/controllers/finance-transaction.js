import { FinanceTransactionService } from '@services';

import BaseController from './base';

export default class FinanceTransactionController extends BaseController {
	constructor() {
		super();

		this.financeTransactionService = new FinanceTransactionService();
	}

	async create(req, res) {
		try {
			const response = await this.financeTransactionService.create({
				data: req.data,
				filter: {
					logged_user_id: req.auth.id
				}
			});

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
					id: req.filter.id,
					logged_user_id: req.auth.id
				},
				changes: req.data
			};

			const response = await this.financeTransactionService.update(options);

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
				id: req.filter.id,
				logged_user_id: req.auth.id
			};

			const response = await this.financeTransactionService.remove(filter);

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
				id: req.filter.id,
				logged_user_id: req.auth.id,
			};

			const response = await this.financeTransactionService.find(filter);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}

	async list(req, res) {
		try {
			const options = {
				filter: {
					logged_user_id: req.auth.id,
					type: req.filter.type,
					search_text: req.filter.search_text
				}
			};

			const response = await this.financeTransactionService.list(options);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}
}
