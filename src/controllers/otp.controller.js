const OtpModel = require('../models/otp.model');
const otpVerification = require('../helpers/otpValidate.helper.js')
const otpGenerator =  require('otp-generator');
const twilio = require('twilio');
const twilioClient = new twilio(accountSid,authToken)
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse  = require('../utils/ApiResponse.js'); 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const sendOtp = asyncHandler(async (req,res) =>{
    try {
        const { phoneNumber } = req.body;
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false , specialChars : false, lowerCaseAlphabets: false});
        const cDate = new Date();
        await OtpModel.findByIdAndUpdate(
            { phoneNumber },
            { otp , otpExpiration: new Date(cDate.getTime())},
            { upsert: true , new: true , setDefaultsOnInsert:true}
        );
        twilioClient.message.create({
            body: `Your OTP is : ${otp}`,
            to: phoneNumber,
            from:process.env.TWILIO_PHONE_NUMBER
        });
        return res.status(201).json(
            new ApiResponse(200, createdUser, 'OTP Send Successfully !'+otp)
        )    
    } catch (error) {
        throw new ApiError(400, "user name or password is required")
    }
})
const verifyOtp = asyncHandler(async (req,res)=>{
    try {
        const { phoneNumber , otp} = req.body;
        const otpData = await OtpModel.findOne({
           $or: [{phoneNumber},{otp}]
        })
        if(!otpData){
            throw new ApiError(404, otpData,"You entred wrong OTP")
        }

        const isOtpExpired = otpVerification(otpData.otpExpiration);
        if(isOtpExpired){
            return res.status(400).json({
                success:false,
                msg:'Your OTP has been expired!'
            });
        }
        return res.status(200).json({
            success:false,
            msg:'OTP Verified Successfully !'
        });
        
    } catch (error) {
       return res.status(400).json({
        success:false,
        msg: error.message
       })
    }
})
module.exports = {
    sendOtp,
    verifyOtp
}