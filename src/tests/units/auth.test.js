import { pick } from "lodash";

import { UserModel } from "@models";

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
		await UserModel.sync({
			force: true,
		});
	});

	describe("#login", () => {
		describe("with user and password that exists", () => {
			test("it should return the user and token", async () => {
				const user = await createUser({
					name: "John",
					username: "John1923",
					password: "123456",
				});

				const loginResponse = await service.login({
					username: "John1923",
					password: "123456",
				});

				expect(loginResponse.user).toMatchObject(
					pick(user, [
						"id",
						"name",
						"profession",
						"email",
						"username",
						"born",
					])
				);

				expect(loginResponse).toHaveProperty("token");
			});
		});

		describe("with username that does not exists", () => {
			test("it should return NOT_FOUND error", async () => {
				const errorResponse = await service
					.login({
						username: "UNEXISTENT_USERNAME",
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
