const { catchAsync } = require('../utils');
const userService = require('../services/userService');
const Email = require('../services/emailService');

exports.signup = catchAsync(async (req, res) => {
  const { user, token } = await userService.signupUser(req.body);

  try {
    await new Email(user, '<some home page url>').sendHello();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    msg: 'Success',
    user,
    token,
  });
});

exports.login = catchAsync(async (req, res) => {
  const { user, token } = await userService.loginUser(req.body);

  res.status(200).json({
    user,
    token,
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    return res.status(200).json({
      msg: 'Password reset instruction sent via email..',
    });
  }

  const otp = user.createPasswordResetToken();

  await user.save();

  // send otp via email
  try {
    // temporary use backend url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/restore-password/${otp}`;

    await new Email(user, resetUrl).sendRestorePassword();
  } catch (err) {
    console.log(err);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
  }

  // const emailTransport = nodemailer.createTransport({
  //   // service: 'Gmail',
  //   host: 'sandbox.smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });

  // const emailConfig = {
  //   from: 'Todos app admin <admin@example.com>',
  //   to: user.email,
  //   subject: 'Password reset instruction.',
  //   html: '<h1>Bla bla bla..</h1>',
  //   // text: 'Hi from todo!!!!',
  // };

  // await emailTransport.sendMail(emailConfig);

  res.status(200).json({
    msg: 'Password reset instruction sent via email..',
  });
});

exports.restorePassword = catchAsync(async (req, res) => {
  await userService.resetPassword(req.params.otp, req.body.password);

  res.status(200).json({
    msg: 'Success',
  });
});
