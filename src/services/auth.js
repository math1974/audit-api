import { UserModel } from '@models';
import { AuthUtils } from '@utils';
import { omit } from 'lodash'

export default class AuthService {
	async login(data) {
		const user = await UserModel.findOne({
			email: data.email,
			is_deleted: false
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
