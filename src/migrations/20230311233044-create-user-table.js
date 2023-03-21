module.exports = {
	up(queryInterface, Sequelize) {
		return queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			email: {
				type: Sequelize.TEXT,
				allowNull: true,
				defaultValue: null
			},
			username: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: null
			},
			password: {
				type: Sequelize.STRING,
                allowNull: false
			},
			born: {
				type: Sequelize.DATEONLY,
                allowNull: true,
				defaultValue: null
			},
			profession: {
				type: Sequelize.STRING,
				allowNull: true,
                defaultValue: null
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
		return queryInterface.dropTable('users');
	}
};
