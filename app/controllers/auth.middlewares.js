const jwtVariable = require('../../variables/jwt');
const authMethod = require('./auth.method');

exports.isAuth = async (req, res, next) => {
	try {
		// Get access token from header
		const accessTokenFromHeader = req.headers.authorization.split(' ');
		if (!accessTokenFromHeader[1]) {
			return res.status(401).send({ error: 'Access token not found.' });
		}

		// Verify access token
		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
		const verified = await authMethod.verifyToken(accessTokenFromHeader[1], accessTokenSecret);
		if (!verified) {
			return res.status(401).send({ error: 'Invalid access token.' });
		}

		res.send(verified.payload);
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).send({ error: 'An error occurred while processing your request.' });
	}
};