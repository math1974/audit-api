import { UserModel } from '@models';

export default class UserService {
	async create(data) {
		const userExists = await UserModel.count({
			email: data.email
		});

		if (userExists) {
			throw new Error('USER_EXISTS');
		}

		const user = await UserModel.create(data);

		return this.find({ id: user._id });
	}

	async find(filter) {
		const user = await UserModel.findOne({
			_id: filter.id,
			is_deleted: false
		});

		if (!user) {
			throw new Error('USER_NOT_FOUND');
		}

		return user;
	}

	async update({ changes, filter }) {
		const userExists = await UserModel.findOne({
			_id: filter.logged_user_id,
			is_deleted: false
		});

		if (!userExists) {
			throw new Error('USER_NOT_FOUND');
		}

		await UserModel.updateOne({
			_id: filter.logged_user_id
		}, changes);

		return this.find({ id: filter.logged_user_id });
	}

	async remove(filter) {
		const whereCondition = {
			_id: filter.logged_user_id,
			is_deleted: false
		};

		const userExists = await UserModel.findOne(whereCondition);

		if (!userExists) {
			throw new Error('USER_NOT_FOUND');
		}

		await UserModel.updateOne(whereCondition, {
			is_deleted: true
		});

		return true;
	}
}
