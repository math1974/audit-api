import mongoose from 'mongoose';
import { AuthUtils } from '@utils';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	profession: {
		type: String,
		default: null,
		required: false
	},
	born: {
		type: Date,
		default: null,
		required: false
	},
	is_deleted: {
		type: Boolean,
		required: true,
		default: false
	},
	created_at: {
		type: Date,
		default: Date.now,
		required: true
	}
});

UserSchema.pre('save', function(next) {
	this.password = AuthUtils.encryptPassword(this.password);

	next();
});

export default mongoose.model('User', UserSchema);
