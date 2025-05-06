const generateOTP = (length = 6): string => {
  const chars = "0123456789";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

export default generateOTP;
