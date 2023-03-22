import { z } from 'zod';

const schemas = {
	login: {
		body: z.object({
			email: z.string(),
            password: z.string()
		})
	}
};

export default {
	login: schemas.login
}
