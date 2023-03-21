import server from '../app';

const resetTable = model => {
	return model.sync({
		force: true
	});
}

export {
	server,
	resetTable
}
