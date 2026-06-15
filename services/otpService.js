const OTPVerification = require('../models/OTPVerification');
const { generateOTPWithExpiry } = require('../utils/generateOTP');
const { sendOTPEmail } = require('./mailService');

const createOTP = async (email) => {
  try {
    // Delete any existing OTP for this email
    await OTPVerification.deleteMany({ email });

    const { otp, expiresAt } = generateOTPWithExpiry();

    console.log(`📝 Creating OTP for email: ${email}`);

    const otpRecord = await OTPVerification.create({
      email,
      otp,
      expiresAt,
      attempts: 0
    });

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp);
      console.log(`✅ OTP created and email sent to ${email}`);
      return { success: true, otpId: otpRecord._id };
    } catch (emailErr) {
      // Delete the OTP record if email sending fails
      await OTPVerification.deleteOne({ _id: otpRecord._id });
      console.error(`❌ OTP: Email sending failed for ${email}`);
      throw new Error(`Failed to send verification email: ${emailErr.message}`);
    }
  } catch (err) {
    console.error('❌ OTP creation failed:', err.message);
    return { success: false, error: err.message };
  }
};

const verifyOTP = async (email, otp) => {
  try {
    console.log(`🔍 Verifying OTP for email: ${email}`);
    
    const otpRecord = await OTPVerification.findOne({ email });

    if (!otpRecord) {
      return { success: false, error: 'OTP not found. Please request a new one.' };
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTPVerification.deleteOne({ _id: otpRecord._id });
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return { success: false, error: 'Max attempts exceeded. Please request a new OTP.' };
    }

    if (otpRecord.otp !== otp.toString()) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return { success: false, error: `Invalid OTP. (Attempts: ${otpRecord.attempts}/${otpRecord.maxAttempts})` };
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    console.log(`✅ OTP verified successfully for ${email}`);
    return { success: true };
  } catch (err) {
    console.error('❌ OTP verification failed:', err.message);
    return { success: false, error: err.message };
  }
};

const resendOTP = async (email) => {
  try {
    console.log(`🔄 Resending OTP to ${email}`);
    await OTPVerification.deleteMany({ email });
    return await createOTP(email);
  } catch (err) {
    console.error('❌ OTP resend failed:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  createOTP,
  verifyOTP,
  resendOTP
};
