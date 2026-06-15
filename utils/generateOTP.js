const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const generateOTPWithExpiry = () => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return { otp, expiresAt };
};

module.exports = {
  generateOTP,
  generateOTPWithExpiry
};
