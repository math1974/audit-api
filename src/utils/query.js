import { Op } from "sequelize"

export default class QueryUtils {
	static getIlikeCondition(text) {
		if (!text) {
			return null
		}

		return {
			[Op.iLike]: `%${text}%`
		};
	}
}
