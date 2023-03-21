import HttpStatus from "http-status";
import app from "@test-utils/server";
import supertest from "supertest";
import { UserModel } from "@models";
import { AuthUtils } from "@utils";

describe("UserController", () => {
	beforeEach(async () => {
		await UserModel.sync({
			force: true,
		});
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
				username: "test",
				password: "12345678",
				born: "2022-07-09",
				email: "test@example.com",
			};

			const { body: createUserResponse } = await supertest(app)
				.post("/users")
				.send(userInfo)
				.expect(HttpStatus.OK);

			expect(createUserResponse.data).toHaveProperty("id");

			const { body: loginWithEmailResponse } = await supertest(app)
				.post("/auth/login")
				.send({
					username: userInfo.email,
					password: userInfo.password,
				})
				.expect(HttpStatus.OK);

			expect(loginWithEmailResponse.data.user).toHaveProperty(
				"id",
				createUserResponse.data.id
			);
			expect(loginWithEmailResponse.data.token).not.toBeNull();

			const { body: loginWithUsername } = await supertest(app)
				.post("/auth/login")
				.send({
					username: userInfo.username,
					password: userInfo.password,
				})
				.expect(HttpStatus.OK);

			expect(loginWithUsername.data.user).toHaveProperty(
				"id",
				createUserResponse.data.id
			);
			expect(loginWithUsername.data.token).not.toBeNull();
		});

		test("with username that exists", async () => {
			const userInfo = {
				name: "test",
				username: "test",
				password: "12345678",
				born: "2022-07-09",
				email: "test@example.com",
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
					username: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "test@example.com",
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
					username: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "test@example.com",
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
					username: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "test@example.com",
				};

				const userCreated = await UserModel.create(userInfo);

				const token = AuthUtils.generateToken(userCreated.toJSON());

				const userChanges = {
					name: "new name ful",
					born: "2022-07-11",
					profession: "developer",
				};

				const { body: updateUserResponse } = await supertest(app)
					.put("/users")
					.set("Authorization", `Bearer ${token}`)
					.send(userChanges)
					.expect(HttpStatus.OK);

				expect(updateUserResponse.data).toHaveProperty(
					"id",
					userCreated.id
				);
				expect(updateUserResponse.data).toHaveProperty(
					"profession",
					userChanges.profession
				);
				expect(updateUserResponse.data).toHaveProperty(
					"born",
					userChanges.born
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
					username: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "test@example.com",
					is_deleted: true,
				};

				const userCreated = await UserModel.create(userInfo);

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
					username: "test",
					password: "12345678",
					born: "2022-07-09",
					email: "test@example.com",
				};

				const userCreated = await UserModel.create(userInfo);

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
