import { FinanceTransactionModel, UserModel } from "@models";
import { FinanceTransactionService } from "@services";

import GenerateUtils from "../utils/generate";


describe("FinanceTransactionService", () => {
	const transactionInfo = {
		type: "INCOME",
		title: "Venda celular",
		description: "Iphone 14 Pro Max 256gb",
		value: 12000
	};

	let service, authInfo;

	beforeAll(async () => {
		service = new FinanceTransactionService();

		authInfo = await GenerateUtils.generateUserAndToken();
	});

	beforeEach(async () => {
		await FinanceTransactionModel.sync({
			force: true,
		});
	});

	afterAll(async () => {
		await FinanceTransactionModel.sync({
			force: true,
		});

		await UserModel.sync({
			force: true,
		});
	})

	describe("#create", () => {
		describe("with valid data", () => {
			it("should return the transaction created", async () => {
				const transactionCreated = await service.create({
					data: transactionInfo,
					filter: {
						logged_user_id: authInfo.user.id,
					},
				});

				expect(transactionCreated).toMatchObject(transactionInfo);
			});
		});
	});

	describe("#update", () => {
		describe("with transaction id that is not found, deleted or doesnt belong to user logged", () => {
			it("should return NOT_FOUND", async () => {
				const transactionUpdateError = await service
					.update({
						changes: {},
						filter: {
							id: 99999,
							logged_user_id: authInfo.user.id,
						},
					})
					.catch((err) => err);

				expect(transactionUpdateError).toMatchInlineSnapshot(
					`[Error: NOT_FOUND]`
				);
			});
		});

		describe("with valid transaction id", () => {
			it("should return the transaction updated", async () => {
				const financeTransactionCreated =
					await FinanceTransactionModel.create({
						...transactionInfo,
						user_id: authInfo.user.id,
					});

				const transactionInfoChanges = {
					type: "INCOME",
					title: "Venda celular",
					description: "Iphone 14 Pro Max 512gb",
					value: 14400,
				};

				const transactionUpdated = await service.update({
					changes: transactionInfoChanges,
					filter: {
						id: financeTransactionCreated.id,
						logged_user_id: authInfo.user.id,
					},
				});

				expect(transactionUpdated).toMatchObject(
					transactionInfoChanges
				);
			});
		});
	});

	describe("#delete", () => {
		describe("with transaction id that is deleted", () => {
			it("should return NOT_FOUND", async () => {
				const financeTransactionCreated =
					await FinanceTransactionModel.create({
						...transactionInfo,
						user_id: authInfo.user.id,
						is_deleted: true,
					});

				const removeResponse = await service
					.remove({
						id: financeTransactionCreated.id,
						logged_user_id: authInfo.user.id,
					})
					.catch((e) => e);

				expect(removeResponse).toMatchInlineSnapshot(
					`[Error: NOT_FOUND]`
				);
			});
		});

		describe("with transaction id doesnt belong to logged user", () => {
			it("should return NOT_FOUND", async () => {
				const newUser = await UserModel.create({
					name: "new_name",
					username: "new_username",
					password: "new_password",
					email: "1234@gmail.com",
				});

				const financeTransactionCreated =
					await FinanceTransactionModel.create({
						...transactionInfo,
						user_id: newUser.id,
					});

				const removeResponse = await service
					.remove({
						id: financeTransactionCreated.id,
						logged_user_id: authInfo.user.id,
					})
					.catch((e) => e);

				expect(removeResponse).toMatchInlineSnapshot(
					`[Error: NOT_FOUND]`
				);
			});
		});

		describe("with transaction id that doesnt exists", () => {
			it("should return NOT_FOUND", async () => {
				const removeResponse = await service
					.remove({
						id: 99999,
						logged_user_id: authInfo.user.id,
					})
					.catch((e) => e);

				expect(removeResponse).toMatchInlineSnapshot(
					`[Error: NOT_FOUND]`
				);
			});
		});
	});

	describe("#find", () => {
		describe("with transaction id that does not exist", () => {
			it("should return NOT_FOUND", async () => {
				const findResponse = await service
					.find({
						id: 99999999,
						logged_user_id: authInfo.user.id,
					})
					.catch((e) => e);

				expect(findResponse).toMatchInlineSnapshot(
					`[Error: NOT_FOUND]`
				);
			});
		});

		describe("with transaction id that belongs to another user", () => {
			it("should return NOT_FOUND", async () => {
				const newUser = await UserModel.create({
					name: "new_name",
					username: "new_username",
					password: "new_password",
					email: "1234@gmail.com",
				});

				const financeTransactionCreated =
					await FinanceTransactionModel.create({
						...transactionInfo,
						user_id: newUser.id,
					});

				const findResponse = await service
					.find({
						id: financeTransactionCreated.id,
						logged_user_id: authInfo.user.id,
					})
					.catch((e) => e);

				expect(findResponse).toMatchInlineSnapshot(
					`[Error: NOT_FOUND]`
				);
			});
		});

		describe("with valid transaction id", () => {
			it("should return the transaction", async () => {
				const financeTransactionCreated =
					await FinanceTransactionModel.create({
						...transactionInfo,
						user_id: authInfo.user.id,
					});

				const findResponse = await service.find({
					id: financeTransactionCreated.id,
					logged_user_id: authInfo.user.id,
				});

				expect(findResponse).toHaveProperty(
					"id",
					financeTransactionCreated.id
				);
				expect(findResponse).toMatchObject(transactionInfo);
			});
		});
	});

	describe("#findAll", () => {
		let userTransactions;

		beforeEach(async () => {
			userTransactions = [
				{
					type: "EXPENSE",
					value: 800,
					title: "A - Fogão",
					user_id: authInfo.user.id,
				},
				{
					type: "INCOME",
					value: 1000,
					title: "B - Venda do telefone reserva",
					user_id: authInfo.user.id,
				},
				{
					type: "INCOME",
					value: 2000,
					title: "C - Freelance website",
					user_id: authInfo.user.id,
				},
			];

			await FinanceTransactionModel.bulkCreate(userTransactions);
		});

		describe("without filter", () => {
			it("should return all user transactions ordered by title", async () => {
				const transactions = await service.list({
					filter: {
						logged_user_id: authInfo.user.id,
					},
				});

				expect(transactions).toHaveLength(3);

				expect(transactions[0]).toMatchObject(userTransactions[0]);
				expect(transactions[1]).toMatchObject(userTransactions[1]);
				expect(transactions[2]).toMatchObject(userTransactions[2]);
			});
		});

		describe("with type INCOME filter", () => {
			it("should return only INCOME transactions", async () => {
				const transactions = await service.list({
					filter: {
						logged_user_id: authInfo.user.id,
						type: "INCOME",
					},
				});

				expect(transactions).toHaveLength(2);

				expect(transactions[0]).toMatchObject(userTransactions[1]);
				expect(transactions[1]).toMatchObject(userTransactions[2]);
			});
		});

		describe("with type EXPENSE filter", () => {
			it("should return only EXPENSE transactions", async () => {
				const transactions = await service.list({
					filter: {
						logged_user_id: authInfo.user.id,
						type: "EXPENSE",
					},
				});

				expect(transactions).toHaveLength(1);

				expect(transactions[0]).toMatchObject(userTransactions[0]);
			});
		});

		describe("with searchText filter", () => {
			it("should return the transactions with title/description that matches text", async () => {
				const transactions = await service.list({
					filter: {
						logged_user_id: authInfo.user.id,
						search_text: "fogão",
					},
				});

				expect(transactions).toHaveLength(1);
				expect(transactions[0]).toMatchObject(userTransactions[0]);
			});
		});

		describe("with type INCOME and searchText filter", () => {
			it("should return the transactions with title/description that matches text and its type is INCOME", async () => {
				const transactions = await service.list({
					filter: {
						logged_user_id: authInfo.user.id,
						type: "INCOME",
						search_text: "e",
					},
				});

				expect(transactions).toHaveLength(2);
				expect(transactions[0]).toMatchObject(userTransactions[1]);
				expect(transactions[1]).toMatchObject(userTransactions[2]);
			});
		});

		describe("with type EXPENSE and searchText filter that doesnt match any", () => {
			it("should return an empty array", async () => {
				const transactions = await service.list({
					filter: {
						logged_user_id: authInfo.user.id,
						type: "EXPENSE",
						search_text: "CRAZYTEXT",
					},
				});

				expect(transactions).toHaveLength(0);
			});
		});
	});
});
