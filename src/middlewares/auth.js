import { AuthUtils } from "@utils";

export default class AuthMiddleware {
	static isAuthorized(req, res, next) {
		const token = AuthUtils.getBearerToken(req);

		const decryptedToken = AuthUtils.decryptToken(token);

		if (!token || !decryptedToken?.user?._id) {
            return res.status(401).json({
                message: 'INVALID_TOKEN'
            });
        }

		req.auth = {
			id: decryptedToken.user._id
		};

		return next();
	}
}
