import { AuthUtils } from '@utils';

describe('AuthUtils', () => {
	test('encryptPassword returns the password encrypted', () => {
		const password = 'password';

		const passwordEncrypted = AuthUtils.encryptPassword(password);

		expect(passwordEncrypted).not.toBeNull();
	})

	test('encryptPassword returns null when not passing the password parameter', () => {
		const passwordEncrypted = AuthUtils.encryptPassword();

		expect(passwordEncrypted).toBe(null);
	})

	test('comparePassword returns true with same passwords', () => {
		const password = 'password';

		const passwordEncrypted = AuthUtils.encryptPassword(password);

		const isSamePassword = AuthUtils.comparePassword(password, passwordEncrypted);

		expect(isSamePassword).toBe(true);
	})

	test('comparePassword returns false when passing different passwords', () => {
		const password = 'password';

		const passwordEncrypted = AuthUtils.encryptPassword(password);

		const isSamePassword = AuthUtils.comparePassword('PASSWORD', passwordEncrypted);

		expect(isSamePassword).toBe(false);
	})

	test('generateToken returns token when passing data object', () => {
		const user = {
			id: 1,
			username: 'username',
            name: 'name'
		};

		const encryptedUser = AuthUtils.generateToken(user);

		expect(encryptedUser).not.toBe(null);
	})

	test('generateToken returns null when not passing user object', () => {
		const encryptedUser = AuthUtils.generateToken();

		expect(encryptedUser).toBe(null);
	})

	test('decryptToken returns null when not token', () => {
		const decryptedToken = AuthUtils.decryptToken();

		expect(decryptedToken).toBe(null);
	})

	test('decryptToken returns user decrypted when passing a valid token', () => {
		const user = {
			id: 1,
			username: 'username'
		};

		const encryptedUserToken = AuthUtils.generateToken(user);
		const decryptedToken = AuthUtils.decryptToken(encryptedUserToken);

		expect(decryptedToken).toMatchObject({ user });
	})

	test('getBearerToken returns token when authorization exists', () => {
		const req = {
			headers: {
                authorization: 'Bearer TOKEN123'
            }
		};

		const token = AuthUtils.getBearerToken(req);

		expect(token).toBe('TOKEN123');
	})

	test('getBearerToken returns null when authorization is invalid', () => {
		const req = {
			headers: {
                authorization: 'TOKEN123'
            }
		};

		const token = AuthUtils.getBearerToken(req);

		expect(token).toBeNull();
	})
})
