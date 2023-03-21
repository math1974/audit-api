import BaseRoutes from '@routes/base';

import { FinanceTransactionSchema } from '@schemas';
import { FinanceTransactionController } from '@controllers';

import SchemaValidator from '@utils/schema-validator'

export default class FinanceTransactionRoutes extends BaseRoutes {
	constructor() {
        super();

		this.financeTransactionController = new FinanceTransactionController();
    }

    setup() {
        this.router.post('/', SchemaValidator.validate(FinanceTransactionSchema.create), this.financeTransactionController.create);
		this.router.get('/', SchemaValidator.validate(FinanceTransactionSchema.list), this.financeTransactionController.list);
        this.router.get('/:id', SchemaValidator.validate(FinanceTransactionSchema.find), this.financeTransactionController.find);
        this.router.put('/:id', SchemaValidator.validate(FinanceTransactionSchema.update), this.financeTransactionController.update);
        this.router.delete('/:id', SchemaValidator.validate(FinanceTransactionSchema.find), this.financeTransactionController.remove);

        return this.router;
    }
}
