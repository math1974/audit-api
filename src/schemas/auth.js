import { z } from 'zod';

const schemas = {
	login: {
		body: z.object({
			username: z.string(),
            password: z.string()
		})
	}
};

export default {
	login: schemas.login
}
