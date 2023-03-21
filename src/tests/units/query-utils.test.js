import { QueryUtils } from '@utils';
import { Op } from 'sequelize';

describe('QueryUtils', () => {
	describe('#getIlikeCondition', () => {
		describe('when the text is not passed in', () => {
			it('should return null', () => {
				const ilikeCondition = QueryUtils.getIlikeCondition();

				expect(ilikeCondition).toBeNull();
			})
		})

		describe('when the text is passed', () => {
			it('should return the iLike operator on object', () => {
				const queryText = 'text';
				const ilikeCondition = QueryUtils.getIlikeCondition(queryText);

				expect(ilikeCondition).toMatchObject({
					[Op.iLike]: `%${queryText}%`
				});
			})
		})
	})
})
