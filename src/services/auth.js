import { UserModel } from '@models';
import { AuthUtils } from '@utils';
import { Op } from 'sequelize';
import { omit } from 'lodash'

export default class AuthService {
	async login(data) {
		const user = await UserModel.findOne({
			where: {
				[Op.or]: [{
					username: data.username
				}, {
					email: data.username
				}],
				is_deleted: false
			},
			attributes: ['id', 'username', 'name', 'profession', 'email', 'born', 'created_at', 'password']
		});

		const isValidPassword = await AuthUtils.comparePassword(data.password, user?.password);

		if (!isValidPassword) {
			throw new Error('INVALID_CREDENTIALS');
		}

		const token = AuthUtils.generateToken(user);

		return {
			user: omit(user, ['password']),
			token
		};
	}
}
