import HttpStatus from "http-status";
import app from "@test-utils/server";
import { resetTable } from "@tests/helper";
import supertest from "supertest";
import { UserModel } from "@models";
import { AuthUtils } from "@utils";
import { ObjectId } from "mongoose";

describe("UserController", () => {
	beforeEach(async () => {
		await resetTable(UserModel);
	});

	describe("#create", () => {
		test("with invalid data", async () => {
			const { body } = await supertest(app)
				.post("/users")
				.expect(HttpStatus.BAD_REQUEST);

			expect(body.message).toMatchInlineSnapshot(`"INVALID_SCHEMA"`);
		});

		test("with valid data", async () => {
			const userInfo = {
				name: "test",
				password: "12345678",
				born: "2022-07-09",
				email: "email@example.com",
			};

			const { body: createUserResponse } = await supertest(app)
				.post("/users")
				.send(userInfo)
				.expect(HttpStatus.OK);

			expect(createUserResponse.data).toHaveProperty("_id");

			const { body: loginResponse } = await supertest(app)
				.post("/auth/login")
				.send({
					email: userInfo.email,
					password: userInfo.password,
				})
				.expect(HttpStatus.OK);

			expect(loginResponse.data.user).toHaveProperty(
				"_id",
				createUserResponse.data._id
			);

			expect(loginResponse.data.token).not.toBeNull();
		});

		test("with email that exists", async () => {
			const userInfo = {
				name: "test",
				password: "12345678",
				born: "2022-07-09",
				email: "email@example.com",
			};

			await supertest(app)
				.post("/users")
				.send(userInfo)
				.expect(HttpStatus.OK);

			const { body } = await supertest(app)
				.post("/users")
				.send(userInfo)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);

			expect(body.message).toMatchInlineSnapshot(`"USER_EXISTS"`);
		});
	});

	describe("#update", () => {
		describe("with invalid token", () => {
			it("should return INVALID_TOKEN", async () => {
				const { body } = await supertest(app)
					.put("/users")
					.expect(HttpStatus.UNAUTHORIZED);

				expect(body.message).toMatchInlineSnapshot(`"INVALID_TOKEN"`);
			});
		});

		describe("with invalid data", () => {
			it("should return INVALID_SCHEMA", async () => {
				const userInfo = {
					name: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "email@example.com",
				};

				const userCreated = await UserModel.create(userInfo);

				const token = AuthUtils.generateToken(userCreated.toJSON());

				const { body } = await supertest(app)
					.put("/users")
					.set("Authorization", `Bearer ${token}`)
					.expect(HttpStatus.BAD_REQUEST);

				expect(body.message).toMatchInlineSnapshot(`"INVALID_SCHEMA"`);
			});
		});

		describe("with deleted user", () => {
			it("should return USER_NOT_FOUND", async () => {
				const userInfo = {
					name: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "email@example.com",
					is_deleted: true,
				};

				const userCreated = await UserModel.create(userInfo);

				const token = AuthUtils.generateToken(userCreated.toJSON());

				const userChanges = {
					name: "new name ful",
					born: "2022-07-11",
					profession: "developer",
				};

				const { body } = await supertest(app)
					.put("/users")
					.set("Authorization", `Bearer ${token}`)
					.send(userChanges)
					.expect(HttpStatus.INTERNAL_SERVER_ERROR);

				expect(body.message).toMatchInlineSnapshot(`"USER_NOT_FOUND"`);
			});
		});

		describe("with valid data", () => {
			it("should return the user updated", async () => {
				const userInfo = {
					name: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "email@example.com",
				};

				const userCreated = await UserModel.create(userInfo);

				const token = AuthUtils.generateToken(userCreated.toJSON());

				const userChanges = {
					name: "new name ful",
					profession: "developer",
				};

				const { body: updateUserResponse } = await supertest(app)
					.put("/users")
					.set("Authorization", `Bearer ${token}`)
					.send(userChanges)
					.expect(HttpStatus.OK);

				expect(updateUserResponse.data).toHaveProperty(
					"_id",
					`${userCreated._id}`
				);
				expect(updateUserResponse.data).toHaveProperty(
					"profession",
					userChanges.profession
				);
				expect(updateUserResponse.data).toHaveProperty(
					"name",
					userChanges.name
				);
			});
		});
	});

	describe("#delete", () => {
		describe("with invalid token", () => {
			it("should return INVALID_TOKEN", async () => {
				const { body } = await supertest(app)
					.delete("/users")
					.expect(HttpStatus.UNAUTHORIZED);

				expect(body.message).toMatchInlineSnapshot(`"INVALID_TOKEN"`);
			});
		});

		describe("with non-existent or deleted user id", () => {
			it("should return USER_NOT_FOUND", async () => {
				const userInfo = {
					name: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "email@example.com",
					is_deleted: true,
				};

				const userCreated = await UserModel.create(userInfo);

				userCreated._id = `${userCreated._id}`;

				const token = AuthUtils.generateToken(userCreated.toJSON());

				const { body } = await supertest(app)
					.delete("/users")
					.set("Authorization", `Bearer ${token}`)
					.expect(HttpStatus.INTERNAL_SERVER_ERROR);

				expect(body.message).toMatchInlineSnapshot(`"USER_NOT_FOUND"`);
			});
		});

		describe("with user_id valid and not deleted", () => {
			it("should return true", async () => {
				const userInfo = {
					name: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "email@example.com",
				};

				const userCreated = await UserModel.create(userInfo);

				userCreated._id = `${userCreated._id}`;

				const token = AuthUtils.generateToken(userCreated.toJSON());

				const { body: deleteUserResponse } = await supertest(app)
					.delete("/users")
					.set("Authorization", `Bearer ${token}`)
					.expect(HttpStatus.OK);

				expect(deleteUserResponse.data).toBe(true);

				const { body } = await supertest(app)
					.get("/users")
					.set("Authorization", `Bearer ${token}`)
					.expect(HttpStatus.INTERNAL_SERVER_ERROR);

				expect(body.message).toMatchInlineSnapshot(`"USER_NOT_FOUND"`);
			});
		});
	});
});
