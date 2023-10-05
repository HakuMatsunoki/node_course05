const { checkUserExistsById, checkUserExists } = require('../services/userService');
const { catchAsync, AppError, userValidators, userNameHandler } = require('../utils');
const ImageService = require('../services/imageService');

/**
 * Check user exists by id and id is valid mongodb id.
 * @category middlewares
 * @author Sergii
 */
exports.checkUserId = catchAsync(async (req, res, next) => {
  await checkUserExistsById(req.params.id);

  next();
});

exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidators.createUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await checkUserExists({ email: value.email });

  const { name, ...restUserData } = value;

  req.body = {
    name: userNameHandler(name),
    ...restUserData,
  };

  next();
});

exports.checkUpdateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidators.updateUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, 'Invalid user data..');
  }

  await checkUserExists({ email: value.email, _id: { $ne: req.params.id } });

  req.body = value;

  next();
});

// SIMPLE MULTER EXAMPLE
/*
// config multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, 'public/img');
  },
  filename: (req, file, cbk) => {
    const extension = file.mimetype.split('/')[1];

    // <userId>-<random uuid>.<extension> => fny4327fny378xn-bry43728ibtr423btrc32.jpg
    cbk(null, `${req.user.id}-${uuid()}.${extension}`);
  },
});

// config multer filter
const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith('image/')) {
    cbk(null, true);
  } else {
    cbk(new AppError(400, 'Please, upload images only!!'), false);
  }
};

// create multer middleware
exports.uploadUserAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single('avatar');
*/

exports.uploadUserAvatar = ImageService.initUploadMiddleware('avatar');
