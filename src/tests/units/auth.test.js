import { pick } from "lodash";

import { UserModel } from "@models";

import { resetTable } from "@tests/helper";

import { AuthService } from "@services";

const createUser = (data) => {
	return UserModel.create(data);
};

describe("AuthService", () => {
	let service;

	beforeAll(() => {
		service = new AuthService();
	});

	beforeEach(async () => {
		await resetTable(UserModel);
	});

	describe("#login", () => {
		describe("with user and password that exists", () => {
			test("it should return the user and token", async () => {
				const user = await createUser({
					name: "John",
					email: "John1923",
					password: "123456",
				});

				const loginResponse = await service.login({
					email: "John1923",
					password: "123456",
				});

				expect(loginResponse.user).toMatchObject(
					pick(user, [
						"id",
						"name",
						"profession",
						"email",
						"born",
					])
				);

				expect(loginResponse).toHaveProperty("token");
			});
		});

		describe("with email that does not exists", () => {
			test("it should return NOT_FOUND error", async () => {
				const errorResponse = await service
					.login({
						email: "UNEXISTENT_email@email.com",
						password: "123456",
					})
					.catch((r) => r);

				expect(errorResponse).toMatchInlineSnapshot(
					`[Error: INVALID_CREDENTIALS]`
				);
			});
		});
	});
});
