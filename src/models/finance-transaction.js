import { literal, Model, Op } from 'sequelize';

import { QueryUtils } from '@utils';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FinanceTransaction = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date
});

export default class FinanceTransaction extends Model {
	static load(sequelize, DataTypes) {
		return super.init({
			type: {
				type: DataTypes.STRING(12),
				allowNull: false,
				defaultValue: 'IN'
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.STRING(40),
				allowNull: true,
				defaultValue: null
			},
			value: {
				type: DataTypes.FLOAT,
				allowNull: false,
				defaultValue: 0
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_DATE')
			},
			is_deleted: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			}
		}, {
			defaultScope: {
				where: {
					is_deleted: false
				},
				attributes: ['id', 'value', 'type', 'title', [literal('date - interval \'3 hour\''), 'date'], 'description']
			},
			timestamps: true,
			sequelize,
			modelName: 'transaction',
			tableName: 'finance_transactions',
			scopes: {
				searchByType: type => {
					if (!type) {
						return {};
					}

					return {
						where: {
                            type
                        }
					};
				},
				searchByTitleOrDescription: text => {
					if (!text) {
						return {};
					}

					const ilikeCondition = QueryUtils.getIlikeCondition(text);

					return {
						where: {
                            [Op.or]: [{
								title: ilikeCondition
							}, {
								description: ilikeCondition
							}]
                        }
					};
				}
			}
		});
	}

	static associate(models) {
		this.belongsTo(models.user, { foreignKey: 'user_id' });
	}
}
