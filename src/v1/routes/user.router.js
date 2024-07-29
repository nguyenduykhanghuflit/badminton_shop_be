const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth.middleware');
const { err400, err500, ok } = require('../utils/handleResponse');
// Đăng ký tài khoản
router.post('/register', async (req, res) => {
   try {
      const { email, password, fullName, phoneNumber } = req.body;

      const [existingEmailUser, existingPhoneUser] = await Promise.all([
         User.findOne({ email }),
         User.findOne({ 'information.phoneNumber': phoneNumber }),
      ]);

      if (existingEmailUser || existingPhoneUser) {
         return res.send(err400('Số điện thoại đã được đăng ký'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
         email,
         password: hashedPassword,
         information: {
            fullName,
            phoneNumber,
         },
      });

      await user.save();

      return res.send(ok('Tạo tài khoản thành công'));
   } catch (err) {
      console.log(err);
      return res.send(err500('Lỗi server', err));
   }
});

// Đăng nhập và trả về JWT
router.post('/login', async (req, res) => {
   try {
      // Tìm người dùng theo email hoặc số điện thoại
      const user = await User.findOne({
         $or: [
            { email: req.body.email },
            { 'information.phoneNumber': req.body.phoneNumber },
         ],
      });
      if (!user) {
         return res.send(err400('Không tìm thấy người dùng'));
      }

      // Kiểm tra mật khẩu
      const validPassword = await bcrypt.compare(
         req.body.password,
         user.password
      );
      if (!validPassword) {
         return res.send(err400('Email hoặc mật khẩu không đúng'));
      }

      // Tạo JWT
      const token = jwt.sign({ userId: user._id }, 'mysecretkey', {
         expiresIn: '30d',
      });

      user.password = '';

      return res.send(ok('Đăng nhập thành công', { user, token }));
   } catch (err) {
      console.log(err);
      return res.send(err500('Lỗi server', err));
   }
});

// Lấy thông tin người dùng đang đăng nhập
// router.get('/me', authMiddleware, (req, res) => {
//    req.user.password = '';
//    res.json(req.user);
// });

// // Thay đổi thông tin người dùng
// router.put('/me', authMiddleware, async (req, res) => {
//    try {
//       // Cập nhật thông tin người dùng
//       req.user.information.fullName =
//          req.body.fullName || req.user.information.fullName;
//       req.user.information.phoneNumber =
//          req.body.phoneNumber || req.user.information.phoneNumber;
//       req.user.information.dateOfBirth =
//          req.body.dateOfBirth || req.user.information.dateOfBirth;
//       req.user.information.gender =
//          req.body.gender || req.user.information.gender;
//       req.user.information.address =
//          req.body.address || req.user.information.address;

//       await req.user.save();

//       return res.json({ message: 'Cập nhật thông tin thành công' });
//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Đã có lỗi xảy ra' });
//    }
// });

// // Thay đổi mật khẩu người dùng
// router.put('/me/password', authMiddleware, async (req, res) => {
//    try {
//       // Kiểm tra mật khẩu cũ
//       const validPassword = await bcrypt.compare(
//          req.body.currentPassword,
//          req.user.password
//       );
//       if (!validPassword) {
//          return res.status(400).json({ message: 'Mật khẩu không đúng' });
//       }

//       // Cập nhật mật khẩu mới
//       req.user.password = await bcrypt.hash(req.body.newPassword, 10);

//       await req.user.save();

//       return res.json({ message: 'Cập nhật mật khẩu thành công' });
//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Đã có lỗi xảy ra' });
//    }
// });

module.exports = router;
