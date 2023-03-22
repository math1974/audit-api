import server from '../app';

const resetTable = model => {
	return model.deleteMany();
}

export {
	server,
	resetTable
}
