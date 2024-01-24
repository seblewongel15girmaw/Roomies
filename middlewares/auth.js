const jwt = require('jsonwebtoken');
let decoded;

const authenticate = (req, res, next) => {
let token = req.headers.authorization;

 

  if (token) {
    try {
      // console.log(process.env.SECRET_KEY);
      console.log(token);

      try {
        if (token.startsWith("Bearer ")) {
          token = token.slice(7, token.length).trimLeft();
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        next();
        return;
      } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ message: 'Unauthorized', error: error.message });
        return;
      }

    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Unauthorized', error: error.message });
      return;
    }
  }

  // No authentication token found
  res.status(401).json({ message: 'Unauthorized' });
};

module.exports = authenticate;
