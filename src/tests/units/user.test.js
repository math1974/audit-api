import { UserModel } from "@models";

import { resetTable } from "@tests/helper";

import { UserService } from "@services";

import { omit } from "lodash";

describe("UserService", () => {
	let service;

	beforeAll(() => {
		service = new UserService();
	});

	beforeEach(async () => {
		await resetTable(UserModel);
	});

	describe("#create", () => {
		describe("with valid email", () => {
			it("should return the user and token", async () => {
				const userInfo = {
					name: "John Doe",
					email: "email@example.com",
					password: "12345678",
				};

				const userCreatedResponse = await service.create(userInfo);

				expect(userCreatedResponse).toMatchObject(
					omit(userInfo, ["password"])
				);
			});
		});

		describe("with email that exists", () => {
			it("should return USER_EXISTS error", async () => {
				await UserModel.create({
					name: "John Doe",
					email: "email@example.com",
					password: "12345678",
				});

				const errorResponse = await service
					.create({
						name: "New User",
						email: "email@example.com",
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
							logged_user_id: "641ae791c39cdb1e03aae77929929",
						},
					})
					.catch((e) => e);

				expect(update).toMatchInlineSnapshot(
					`[CastError: Cast to ObjectId failed for value "641ae791c39cdb1e03aae77929929" (type string) at path "_id" for model "User"]`
				);
			});
		});

		describe("with user that exists", () => {
			it("should return the user updated", async () => {
				const userCreated = await service.create({
					name: "John Doe",
					email: "email@example.com",
					password: "12345678",
				});

				const userChanges = {
					name: "New User",
					profession: "Developer",
				};

				const userUpdated = await service.update({
					filter: {
						logged_user_id: userCreated._id,
					},
					changes: userChanges,
				});

				expect(userUpdated).toHaveProperty("_id", userCreated._id);
				expect(userUpdated).toHaveProperty("name", userChanges.name);
				expect(userUpdated).toHaveProperty(
					"profession",
					userChanges.profession
				);
			});
		});
	});

	describe("#delete", () => {
		describe("with user_id that does not exist", () => {
			it("should return USER_NOT_FOUND", async () => {
				const removeResponse = await service
					.remove({
						logged_user_id: "641ae791c39cdb1e03aae77929929",
					})
					.catch((e) => e);

				expect(removeResponse).toMatchInlineSnapshot(
					`[CastError: Cast to ObjectId failed for value "641ae791c39cdb1e03aae77929929" (type string) at path "_id" for model "User"]`
				);
			});
		});

		describe("with user that exists", () => {
			it("should return true", async () => {
				const userCreated = await service.create({
					name: "John Doe",
					email: "email@example.com",
					password: "12345678",
				});

				const deleted = await service.remove({
					logged_user_id: userCreated._id,
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
						id: "641ae791c39cdb1e03aae77929929",
					})
					.catch((e) => e);

				expect(findResponse).toMatchInlineSnapshot(
					`[CastError: Cast to ObjectId failed for value "641ae791c39cdb1e03aae77929929" (type string) at path "_id" for model "User"]`
				);
			});
		});

		describe("with user that exists", () => {
			it("should return the user", async () => {
				const userCreated = await service.create({
					name: "John Doe",
					email: "email@example.com",
					password: "12345678",
				});

				const userFound = await service.find({
					id: userCreated._id,
				});

				expect(userFound).toEqual(userCreated);
			});
		});
	});
});
