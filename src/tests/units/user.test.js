import { UserModel } from "@models";

import { UserService } from "@services";

import { omit } from "lodash";

describe("UserService", () => {
	let service;

	beforeAll(() => {
		service = new UserService();
	});

	beforeEach(async () => {
		await UserModel.sync({
			force: true,
		});
	});

	describe("#create", () => {
		describe("with valid username", () => {
			it("should return the user and token", async () => {
				const userInfo = {
					name: "John Doe",
					username: "John1923",
					password: "12345678",
				};

				const userCreatedResponse = await service.create(userInfo);

				expect(userCreatedResponse).toMatchObject(
					omit(userInfo, ["password"])
				);
			});
		});

		describe("with username that exists", () => {
			it("should return USER_EXISTS error", async () => {
				await UserModel.create({
					name: "John Doe",
					username: "user1234",
					password: "12345678",
				});

				const errorResponse = await service
					.create({
						name: "New User",
						username: "user1234",
						password: "123456",
					})
					.catch((r) => r);

				expect(errorResponse).toMatchInlineSnapshot(
					`[Error: USER_EXISTS]`
				);
			});
		});
	});

	describe("#update", () => {
		describe("with user_id that does not exist", () => {
			it("should return USER_NOT_FOUND", async () => {
				const update = await service
					.update({
						filter: {
							logged_user_id: 99999999
						},
					})
					.catch((e) => e);

				expect(update).toMatchInlineSnapshot(`[Error: USER_NOT_FOUND]`);
			});
		});

		describe("with user that exists", () => {
			it("should return the user updated", async () => {
				const userCreated = await service.create({
					name: "John Doe",
					username: "user1234",
					email: "email@email.com",
					password: "12345678",
				});

				const userChanges = {
					name: "New User",
					born: "2022-09-07",
					profession: "Developer"
				};

				const userUpdated = await service.update({
					filter: {
						logged_user_id: userCreated.id
					},
					changes: userChanges
				});

				expect(userUpdated).toHaveProperty('id', userCreated.id);
				expect(userUpdated).toHaveProperty('name', userChanges.name);
				expect(userUpdated).toHaveProperty('born', userChanges.born);
				expect(userUpdated).toHaveProperty('profession', userChanges.profession);
			});
		});
	});

	describe("#delete", () => {
		describe("with user_id that does not exist", () => {
			it("should return USER_NOT_FOUND", async () => {
				const removeResponse = await service
					.remove({
						logged_user_id: 99999999
					})
					.catch((e) => e);

				expect(removeResponse).toMatchInlineSnapshot(`[Error: USER_NOT_FOUND]`);
			});
		});

		describe("with user that exists", () => {
			it("should return true", async () => {
				const userCreated = await service.create({
					name: "John Doe",
					username: "user1234",
					email: "email@email.com",
					password: "12345678",
				});

				const deleted = await service.remove({
					logged_user_id: userCreated.id
				});

				expect(deleted).toBe(true);
			});
		});
	});

	describe("#find", () => {
		describe("with user_id that does not exist", () => {
			it("should return USER_NOT_FOUND", async () => {
				const findResponse = await service
					.find({
						id: 99999999
					})
					.catch((e) => e);

				expect(findResponse).toMatchInlineSnapshot(`[Error: USER_NOT_FOUND]`);
			});
		});

		describe("with user that exists", () => {
			it("should return the user", async () => {
				const userCreated = await service.create({
					name: "John Doe",
					username: "user1234",
					email: "email@email.com",
					password: "12345678",
				});

				const userFound = await service.find({
					id: userCreated.id
				});

				expect(userFound).toEqual(userCreated);
			});
		});
	});
});
