import BaseRoutes from '@routes/base';
import AuthSchema from '@schemas/auth';
import { AuthController } from '@controllers';

import SchemaValidator from '@utils/schema-validator'

export default class AuthRoutes extends BaseRoutes {
	constructor() {
        super();

		this.authController = new AuthController();
    }

    setup() {
        this.router.post('/login', SchemaValidator.validate(AuthSchema.login), this.authController.login);

        return this.router;
    }
}
