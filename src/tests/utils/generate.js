import { UserModel } from "@models";
import { AuthUtils } from "@utils";

const buildReq = (overrides = {}) => {
	return {
		body: {},
		params: {},
		headers: {},
		...overrides
	};
}

const buildRes = (overrides = {}) => {
	const res = {
		json: jest.fn(() => res).mockName('json'),
		status: jest.fn(() => res).mockName('status'),
		...overrides,
	};

	return res;
};

const buildNext = impl => {
	return jest.fn(impl).mockName('next')
}

const buildError = error => {
	return error;
}


const generateUserAndToken = async (overrides = {}) => {
	const userInfo = {
		username: 'username',
		password: 'password',
		name: 'name',
		email: 'email@email.com',
		born: '2002-07-09',
		...overrides
	};

	const user = await UserModel.create(userInfo);

	const token = AuthUtils.generateToken(user);

	return { user, token };
}

export default {
	buildReq,
	buildRes,
	buildNext,
	buildError,
	generateUserAndToken
}
