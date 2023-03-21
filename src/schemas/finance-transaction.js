import { z } from 'zod';
import * as DateUtils from '@utils/date';

const transactionTypes = ['INCOME', 'EXPENSE'];

const schemas = {
	create: {
		body: z.object({
			type: z.string().valueOf(transactionTypes),
			value: z.number().positive(),
			title: z.string().max(255),
			description: z.string().max(120).nullable(),
			date: z.string().refine(value => DateUtils.isValid(value, 'YYYY-MM-DD HH:mm:ss'))
		})
	},
	update: {
		body: z.object({
			type: z.string().valueOf(transactionTypes),
			value: z.number().positive(),
			title: z.string().max(255),
			description: z.string().max(120).default(null).nullable(),
			date: z.string().refine(value => DateUtils.isValid(value, 'YYYY-MM-DD HH:mm:ss'))
		}),
		params: z.object({
            id: z.preprocess(
				Number,
				z.number()
			)
        })
	},
	find: {
		params: z.object({
            id: z.preprocess(
				Number,
				z.number()
			)
        })
	},
	list: {
		query: z.object({
            type: z.string().valueOf(transactionTypes).optional(),
            search_text: z.string().max(255).optional()
        }).partial()
	}
};

export default {
	create: schemas.create,
	find: schemas.find,
	list: schemas.list,
	update: {
		...schemas.update,
		...schemas.find
	}
}
