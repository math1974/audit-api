import HttpStatus from 'http-status';

class BaseController {
	constructor() {
		Object.getOwnPropertyNames(this.__proto__).forEach(methodName => {
			if (methodName !== 'constructor') {
				this[methodName] = this[methodName].bind(this);
			}
		});
	}

	sendError({ error, req, res, status = HttpStatus.INTERNAL_SERVER_ERROR }) {
		status = error?.status || status;

		return res.status(status).json({
			code: error?.code || '001',
			message: error?.message || 'Algo de errado ocorreu, por favor, tente novamente.',
			status: 'error'
		});
	}

	sendSuccess({ data, res, status = HttpStatus.OK }) {
		return res.status(status).json({
			data: data,
			status: 'success'
		});
	}
}

export default BaseController;
