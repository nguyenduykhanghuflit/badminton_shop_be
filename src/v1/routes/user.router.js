const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth.middleware');
const { handleRespone } = require('../utils/handleResponse');
// Đăng ký tài khoản
router.post('/register', async (req, res) => {
   try {
      const {
         email,
         password,
         fullName,
         phoneNumber,
         dateOfBirth,
         gender,
         address,
      } = req.body;

      const [existingEmailUser, existingPhoneUser] = await Promise.all([
         User.findOne({ email }),
         User.findOne({ 'information.phoneNumber': phoneNumber }),
      ]);

      if (existingEmailUser || existingPhoneUser) {
         return res
            .status(400)
            .json({ message: 'Email hoặc số điện thoại đã được sử dụng' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
         email,
         password: hashedPassword,
         information: {
            fullName,
            phoneNumber,
            dateOfBirth,
            gender,
            address,
         },
      });

      await user.save();

      return res.status(201).json({ message: 'Tạo tài khoản thành công' });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Đã có lỗi xảy ra' });
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
         return res.send(
            handleRespone(false, 'Email or password invalid', null, 401)
         );
      }

      // Kiểm tra mật khẩu
      const validPassword = await bcrypt.compare(
         req.body.password,
         user.password
      );
      if (!validPassword) {
         return res.send(
            handleRespone(false, 'Email or password invalid', null, 401)
         );
      }

      // Tạo JWT
      const token = jwt.sign({ userId: user._id }, 'mysecretkey', {
         expiresIn: '30d',
      });
      return res.send(handleRespone(true, 'Success', token, 200));
   } catch (err) {
      return res.send(handleRespone(false, 'Server error', null, 401));
   }
});

// Lấy thông tin người dùng đang đăng nhập
router.get('/me', authMiddleware, (req, res) => {
   req.user.password = '';
   res.json(req.user);
});

// Thay đổi thông tin người dùng
router.put('/me', authMiddleware, async (req, res) => {
   try {
      // Cập nhật thông tin người dùng
      req.user.information.fullName =
         req.body.fullName || req.user.information.fullName;
      req.user.information.phoneNumber =
         req.body.phoneNumber || req.user.information.phoneNumber;
      req.user.information.dateOfBirth =
         req.body.dateOfBirth || req.user.information.dateOfBirth;
      req.user.information.gender =
         req.body.gender || req.user.information.gender;
      req.user.information.address =
         req.body.address || req.user.information.address;

      await req.user.save();

      return res.json({ message: 'Cập nhật thông tin thành công' });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Đã có lỗi xảy ra' });
   }
});

// Thay đổi mật khẩu người dùng
router.put('/me/password', authMiddleware, async (req, res) => {
   try {
      // Kiểm tra mật khẩu cũ
      const validPassword = await bcrypt.compare(
         req.body.currentPassword,
         req.user.password
      );
      if (!validPassword) {
         return res.status(400).json({ message: 'Mật khẩu không đúng' });
      }

      // Cập nhật mật khẩu mới
      req.user.password = await bcrypt.hash(req.body.newPassword, 10);

      await req.user.save();

      return res.json({ message: 'Cập nhật mật khẩu thành công' });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Đã có lỗi xảy ra' });
   }
});

module.exports = router;
