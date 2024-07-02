const ApiError = require('../utils/ApiError');
const otpVerification = async(otpTime) =>{
    try { 
        const cDateTime = new Date();
        let differenceValue = (otpTime - cDateTime.getTime())/100; //if let is not working so add var
        differenceValue /= 60;
        const minutes = Math.abs(differenceValue);
        if(minutes > 2){
            throw new ApiError(500, "OTP expired")
        }
        return false

    } catch (error) {
        throw new ApiError(500, "Something went wrong in otp verification")
    }
}
module.exports = {
    otpVerification
}