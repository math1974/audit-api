import mongoose from 'mongoose';

export default class Databases {
    connect() {
		return mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`)
    }

    close() {
        return this._instance.close();
    }
}
