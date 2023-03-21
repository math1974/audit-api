import HttpStatus from "http-status";
import { AuthMiddleware } from "middlewares";
import { AuthUtils } from "utils";
import GenerateUtils from "../utils/generate";

describe("AuthMiddleware", () => {
	describe("#isAuthorized", () => {
		test("should call next if token is valid", () => {
			const user = {
				id: 1,
				username: "username",
			};

			const token = AuthUtils.generateToken(user);

			const req = GenerateUtils.buildReq({
				headers: {
					authorization: `Bearer ${token}`,
				},
			});

			const next = GenerateUtils.buildNext();

			AuthMiddleware.isAuthorized(req, {}, next);

			expect(req.auth).toMatchObject({
				id: user.id
			})

			expect(next).toHaveBeenCalledWith();
			expect(next).toHaveBeenCalledTimes(1);
		});

		test("should return 401 if the token is invalid or is not passed", () => {
			const req = GenerateUtils.buildReq();
			const res = GenerateUtils.buildRes();

			AuthMiddleware.isAuthorized(req, res);

			expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
			expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
			[
			  {
			    "message": "INVALID_TOKEN",
			  },
			]
		`);
		});
	});
});
