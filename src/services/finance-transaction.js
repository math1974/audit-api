import { FinanceTransactionModel } from '@models';

export default class UserService {
	async create({ data, filter }) {
		const transaction = await FinanceTransactionModel.create({
			...data,
			user_id: filter.logged_user_id
		});

		return this.find({
			id: transaction.id,
			logged_user_id: filter.logged_user_id
		});
	}

	list({ filter }) {
		return FinanceTransactionModel.scope([{
			method: ['searchByType', filter.type],
		}, {
			method: ['searchByTitleOrDescription', filter.search_text]
		}]).findAll({
			where: {
				user_id: filter.logged_user_id
			},
			useMaster: true,
			order: [['date', 'desc'], ['title', 'asc']]
		});
	}

	async find(filter) {
		const transaction = await FinanceTransactionModel.findOne({
			where: {
				id: filter.id,
				user_id: filter.logged_user_id
			},
			useMaster: true
		});

		if (!transaction) {
			throw new Error('NOT_FOUND');
		}

		return transaction;
	}

	async transactionExists(filter) {
		const count = await FinanceTransactionModel.count({
			where: {
                id: filter.id,
                user_id: filter.logged_user_id,
                is_deleted: false
            }
		});

		return !!count;
	}

	async update({ changes, filter }) {
		const transactionExists = await this.transactionExists(filter);

		if (!transactionExists) {
			throw new Error('NOT_FOUND');
		}

		await FinanceTransactionModel.update(changes, {
			where: {
				id: filter.id,
				user_id: filter.logged_user_id,
				is_deleted: false
			}
		});

		return this.find(filter);
	}

	async remove(filter) {
		const whereCondition = {
			id: filter.id,
			user_id: filter.logged_user_id,
			is_deleted: false
		};

		const transactionExists = await this.transactionExists(filter);

		if (!transactionExists) {
			throw new Error('NOT_FOUND');
		}

		await FinanceTransactionModel.update({
			is_deleted: true
		}, {
			where: whereCondition
		});

		return true;
	}
}
