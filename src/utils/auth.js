import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthUtils {
	static encryptPassword(password) {
		if (!password) {
			return null
		}

		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	}

	static comparePassword(passwordInput, userPassword) {
		if (!passwordInput || !userPassword) {
			return null
		}

		return bcrypt.compareSync(passwordInput, userPassword);
	}

	static generateToken(user, key = process.env.API_SECRET_KEY) {
		if (!user) {
            return null
        }

        return jwt.sign({
			iss: user.id,
			user: {
				id: user.id,
                username: user.username
			}
		}, key, { expiresIn: 86400 });
	}

	static decryptToken(token, key = process.env.API_SECRET_KEY) {
		if (!token) {
            return null
        }

        return jwt.verify(token, key);
	}

	static getBearerToken(req) {
		const [, token] = (req?.headers?.authorization || '').split(' ');

		if (!token) {
			return null
		}

		return token;
	}
}
