import HttpStatus from 'http-status';
import { pickBy, isUndefined } from 'lodash';

const isValid = (schemas, req) => {
	try {
		const results = {
			filter: {},
			data: {},
			file: null
		};

		Object.keys(schemas).forEach(key => {
			const schema = schemas[key];
			const result = schema.parse(req[key]);

			if (key === 'body') {
				results.data = Object.assign(results.data, result);
			} else if (['query', 'params'].includes(key)) {
				results.filter = Object.assign(results.filter, result);
			} else {
				results[key] = result;
			}
		});

		return { results };
	} catch (error) {
		return { error };
	}
}

const validate = schema => {
	return (req, res, next) => {
		const { error, results } = isValid(schema, req);

		if (error) {
			return res.status(HttpStatus.BAD_REQUEST).json({
				status: 'error',
				message: 'INVALID_SCHEMA'
			});
		}

		req.data = pickBy(results.data, value => !isUndefined(value));
		req.filter = pickBy(results.filter, value => !isUndefined(value));
		req.file = results.file;
		req.files = results.files;

		return next();
	};
}

export default {
	validate
};
