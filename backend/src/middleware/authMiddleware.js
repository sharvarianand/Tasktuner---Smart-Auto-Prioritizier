const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res, next) => {
    res.status(401).json({ message: 'Unauthorized access', error: err });
  },
});

module.exports = requireAuth;
