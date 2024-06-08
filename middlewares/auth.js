// const jwt = require('jsonwebtoken');
// let decoded;

// const authenticate = (req, res, next) => {
// let token = req.headers.authorization;

//   if (token) {
//     try {
//       // console.log(process.env.SECRET_KEY);
//       console.log(token);

//       try {
//         if (token.startsWith("Bearer ")) {
//           token = token.slice(7, token.length).trimLeft();
//         }
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         req.userId = decoded.userId;
//         next();
//         return;
//       } catch (error) {
//         console.error('Token verification error:', error.message);
//         res.status(401).json({ message: 'Unauthorized', error: error.message });
//         return;
//       }

//     } catch (error) {
//       console.error('Token verification error:', error.message);
//       res.status(401).json({ message: 'Unauthorized', error: error.message });
//       return;
//     }
//   }

//   // No authentication token found
//   res.status(401).json({ message: 'Unauthorized' });
// };

// module.exports = authenticate;
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  

  let token = req.headers.authorization;

  if (token) {
    try {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7).trimLeft();
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // console.log('Decoded Token:', decoded);

      // Add user details from token to the request object
      req.userId = decoded.userId;
      req.brokerId = decoded.brokerId;  // This line will safely set brokerId if it exists in the token
      req.role = decoded.role;

      // console.log('Role set in req:', req.role);

      // Proceed to the next middleware or route handler
      if (req.role === 'broker' || req.role === 'user') {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden: Invalid role' });
      }
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
  } else {
    // No authentication token found
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

module.exports = authenticate;

