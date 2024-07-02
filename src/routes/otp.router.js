const Router = require('express');
const verifyJWT = require('../middlewares/auth.middleware.js');
const otpController = require('../controllers/otp.controller');
const router = Router();
router.use(verifyJWT)

router.route("/send-otp").post(otpController.sendOtp);
router.route("/verify-otp").post(otpController.verifyOtp);
module.exports = router