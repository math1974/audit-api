import { Model } from 'sequelize';

import { AuthUtils } from '@utils';

export default class User extends Model {
	static load(sequelize, DataTypes) {
		return super.init({
			name: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			email: {
				type: DataTypes.TEXT,
				allowNull: true,
				defaultValue: null
			},
			username: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: null
			},
			password: {
				type: DataTypes.STRING,
                allowNull: false
			},
			born: {
				type: DataTypes.DATEONLY,
                allowNull: true,
				defaultValue: null
			},
			profession: {
				type: DataTypes.STRING,
				allowNull: true,
                defaultValue: null
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
				attributes: ['id', 'name', 'email', 'username', 'born', 'profession']
			},
			timestamps: true,
			sequelize,
			modelName: 'user',
			tableName: 'users',
			hooks: {
				beforeCreate: user => {
					user.password = AuthUtils.encryptPassword(user.password);
				}
			}
		});
	}
}
