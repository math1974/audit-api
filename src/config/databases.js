import mongoose from 'mongoose';

export default class Databases {
    static connect() {
		return mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`)
    }
}
