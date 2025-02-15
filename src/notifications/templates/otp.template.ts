export const forget_password_otp_template = (
  name: string,
  otp: string,
  expiresIn: number,
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
      text-align: center;
    }
    .header {
      background-color: #4CAF50;
      padding: 10px 0;
      color: #fff;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .header img {
      width: 100px;
    }
    .content {
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 8px;
      margin: 20px 0;
      display: inline-block;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #999;
    }
    a {
      text-decoration: none;
      color: #4CAF50;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://firebasestorage.googleapis.com/v0/b/flint-82e7b.appspot.com/o/website_images%2FF.png?alt=media&token=97e9c905-4ad7-4d03-9714-dda006b963e6" alt="Logo"> <!-- Replace with your logo URL -->
    </div>
    <div class="content">
      <h1>OTP Verification</h1>
      <p>Dear ${name},</p>
      <p>A request to reset your password was made! to reset your password, please use the following One-Time Password (OTP):</p>
      <div class="otp">${otp}</div>
      <p>Please enter this code on the website to verify your email address. This OTP is valid for the next ${Math.floor(expiresIn / 60)} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
      <p><a href="www.google.com">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
    `;
};

export const otpTemplate = (name: string, otp: string, expiresIn: number) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
      text-align: center;
    }
    .header {
      background-color: #4CAF50;
      padding: 10px 0;
      color: #fff;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .header img {
      width: 100px;
    }
    .content {
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 8px;
      margin: 20px 0;
      display: inline-block;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #999;
    }
    a {
      text-decoration: none;
      color: #4CAF50;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://firebasestorage.googleapis.com/v0/b/flint-82e7b.appspot.com/o/website_images%2FF.png?alt=media&token=97e9c905-4ad7-4d03-9714-dda006b963e6" alt="Logo"> <!-- Replace with your logo URL -->
    </div>
    <div class="content">
      <h1>OTP Verification</h1>
      <p>Dear ${name},</p>
      <p>Thank you for registering with us! To complete your registration, please use the following One-Time Password (OTP):</p>
      <div class="otp">${otp}</div>
      <p>Please enter this code on the website to verify your email address. This OTP is valid for the next ${Math.floor(expiresIn / 60)} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
      <p><a href="www.google.com">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
    `;
};
