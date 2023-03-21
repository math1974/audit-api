import app from "@test-utils/server";

import { omit } from "lodash";
import supertest from "supertest";
import HttpStatus from "http-status";

import { UserModel, FinanceTransactionModel } from "@models";

import GenerateUtils from "../utils/generate";

describe("FinanceTransactionController", () => {
	let authInfo;

	beforeAll(async () => {
		authInfo = await GenerateUtils.generateUserAndToken();
	});

	beforeEach(async () => {
		await FinanceTransactionModel.sync({
			force: true,
		});
	});

	afterAll(async () => {
		await FinanceTransactionModel.sync({ force: true });
		await UserModel.sync({ force: true });
	});

	describe("#create", () => {
		test("with invalid data", async () => {
			const { body } = await supertest(app)
				.post("/finance-transactions")
				.set("Authorization", `Bearer ${authInfo.token}`)
				.expect(HttpStatus.BAD_REQUEST);

			expect(body.message).toMatchInlineSnapshot(`"INVALID_SCHEMA"`);
		});

		test("with valid data", async () => {
			const transactionInfo = {
				type: "EXPENSE",
				value: 1000,
				title: "title",
				description: "desc",
				date: "2022-07-09 00:00:00",
			};

			const { body: createTransactionInfo } = await supertest(app)
				.post("/finance-transactions")
				.set("Authorization", `Bearer ${authInfo.token}`)
				.send(transactionInfo);

			expect(createTransactionInfo.data).toMatchObject(
				omit(transactionInfo, ["date"])
			);
		});
	});

	describe("#update", () => {
		describe("with invalid data", () => {
			it("should return INVALID_SCHEMA", async () => {
				const { body } = await supertest(app)
					.put(`/finance-transactions/99999`)
					.set("Authorization", `Bearer ${authInfo.token}`)
					.expect(HttpStatus.BAD_REQUEST);

				expect(body.message).toMatchInlineSnapshot(`"INVALID_SCHEMA"`);
			});
		});

		describe("with transaction id that doesnt exist", () => {
			it("should return NOT_FOUND", async () => {
				const { body } = await supertest(app)
					.put(`/finance-transactions/99999`)
					.set("Authorization", `Bearer ${authInfo.token}`)
					.send({
						type: "EXPENSE",
						value: 1000,
						title: "title",
						description: "desc",
						date: "2022-07-09 00:00:00",
					});

				expect(body.message).toMatchInlineSnapshot(`"NOT_FOUND"`);
			});
		});

		describe("with valid data", () => {
			it("should return the transaction updated", async () => {
				const transactionCreated = await FinanceTransactionModel.create(
					{
						type: "INCOME",
						value: 4000,
						title: "Freelancer Job",
						description: "Site development",
						date: "2022-07-10 08:05:23",
						user_id: authInfo.user.id,
					}
				);

				const transactionChanges = {
					type: "INCOME",
					value: 6500,
					title: "Freelancer Job 2",
					description: "Site + Landing page development",
					date: "2022-07-10 08:05:23",
				};

				const { body: updateTransactionChanges } = await supertest(app)
					.put(`/finance-transactions/${transactionCreated.id}`)
					.set("Authorization", `Bearer ${authInfo.token}`)
					.send(transactionChanges);

				expect(updateTransactionChanges.data).toHaveProperty(
					"id",
					transactionCreated.id
				);

				expect(updateTransactionChanges.data).toMatchObject(
					omit(transactionChanges, ["date"])
				);
			});
		});
	});

	describe("#delete", () => {
		describe("with invalid token", () => {
			it("should return INVALID_TOKEN", async () => {
				const { body } = await supertest(app)
					.delete("/finance-transactions/99999")
					.expect(HttpStatus.UNAUTHORIZED);

				expect(body.message).toMatchInlineSnapshot(`"INVALID_TOKEN"`);
			});
		});

		describe("with non-existent or deleted transaction id", () => {
			it("should return NOT_FOUND", async () => {
				const { body } = await supertest(app)
					.delete("/finance-transactions/999999")
					.set("Authorization", `Bearer ${authInfo.token}`)
					.expect(HttpStatus.INTERNAL_SERVER_ERROR);

				expect(body.message).toMatchInlineSnapshot(`"NOT_FOUND"`);
			});
		});

		describe("with transaction id valid and not deleted", () => {
			it("should return true", async () => {
				const transactionInfo = {
					type: "EXPENSE",
					value: 1000,
					title: "title",
					description: "desc",
					date: "2022-07-09 00:00:00",
				};

				const { body: createTransactionResponse } = await supertest(app)
					.post("/finance-transactions")
					.set("Authorization", `Bearer ${authInfo.token}`)
					.send(transactionInfo);

				const { body: deleteTransactionResponse } = await supertest(app)
					.delete(
						`/finance-transactions/${createTransactionResponse.data.id}`
					)
					.set("Authorization", `Bearer ${authInfo.token}`)
					.expect(HttpStatus.OK);

				expect(deleteTransactionResponse.data).toBe(true);

				const { body } = await supertest(app)
					.get(
						`/finance-transactions/${createTransactionResponse.data.id}`
					)
					.set("Authorization", `Bearer ${authInfo.token}`)
					.expect(HttpStatus.INTERNAL_SERVER_ERROR);

				expect(body.message).toMatchInlineSnapshot(`"NOT_FOUND"`);
			});
		});
	});
});
