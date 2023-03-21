module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface.createTable('finance_transactions', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			type: {
				type: Sequelize.STRING(12),
				allowNull: false,
                defaultValue: 'IN'
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false
			},
			description: {
				type: Sequelize.STRING(40),
				allowNull: true,
				defaultValue: null
			},
			value: {
				type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
                    model: 'users',
                    key: 'id'
                }
			},
			date: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_DATE')
			},
			is_deleted: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			}
		});
	},
	down(queryInterface) {
		return queryInterface.dropTable('finance_transactions');
	}
};
