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
router.post('/profile', authMiddleware, async (req, res) => {
   try {
      const userId = req.user._id;
      const {
         fullName,
         phoneNumber,
         birthday,
         gender,
         avtUrl,
         address,
         newPassword,
      } = req.body;

      // Prepare update data
      const updateData = {
         'information.fullName': fullName,
         'information.phoneNumber': phoneNumber,
         'information.birthday': birthday,
         'information.gender': gender,
         'information.avtUrl': avtUrl,
         'information.address': address,
      };

      if (newPassword) {
         // Hash the new password and add it to update data
         const hashedPassword = await bcrypt.hash(newPassword, 10);
         updateData.password = hashedPassword;
      }

      // Update user information
      const updatedUser = await User.findByIdAndUpdate(
         userId,
         { $set: updateData },
         { new: true } // Return the updated document
      );

      if (!updatedUser) {
         return res.send(err400('Không tìm thấy người dùng'));
      }

      return res.send(
         ok('Cập nhật thông tin thành công', { user: updatedUser })
      );
   } catch (err) {
      console.log(err);
      return res.send(err500('Lỗi server', err));
   }
});

router.get('/profile', authMiddleware, async (req, res) => {
   try {
      const userId = req.user._id;
      const user = await User.findById(userId).select('-password'); // Exclude password from response

      if (!user) {
         return res.send(err400('Không tìm thấy người dùng'));
      }

      return res.send(ok('Lấy thông tin thành công', { user }));
   } catch (err) {
      console.log(err);
      return res.send(err500('Lỗi server', err));
   }
});

module.exports = router;
