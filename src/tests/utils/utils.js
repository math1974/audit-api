export default class Utils {
	static getResponseTextCode(response) {
		if (!response?.text) {
			return null
		}

		return JSON.parse(response.text)?.code;
	}
}
