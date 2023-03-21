import { z } from 'zod';
import * as DateUtils from '@utils/date';

const schemas = {
	create: {
		body: z.object({
			name: z.string(),
			email: z.string().email(),
			username: z.string(),
            password: z.string(),
			born: z.string().refine(value => DateUtils.isValid(value, 'YYYY-MM-DD', true)),
			profession: z.string().optional()
		})
	},
	update: {
		body: z.object({
			name: z.string(),
			born: z.string().refine(value => DateUtils.isValid(value, 'YYYY-MM-DD', true)),
			profession: z.string().default(null).nullable()
		})
	},
	find: {
		params: z.object({
            id: z.number().min(1)
        })
	}
};

export default {
	create: schemas.create,
	find: schemas.find,
	update: schemas.update
}
