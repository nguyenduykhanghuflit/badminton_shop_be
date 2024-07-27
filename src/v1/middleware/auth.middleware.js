const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
module.exports = {
  async authMiddleware(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'mysecretkey');
      const userId = decodedToken.userId;

      // Lưu thông tin người dùng vào đối tượng req để các middleware khác có thể sử dụng
      req.user = await User.findById(userId);

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Không có quyền truy cập' });
    }
  },
};
