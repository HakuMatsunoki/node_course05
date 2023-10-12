const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const { AppError } = require('../utils');

/**
 * Image service class
 */
class ImageService {
  /**
   * Init express middleware
   * @param {string} name
   * @returns {Object}
   */
  static initUploadMiddleware(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith('image/')) {
        cbk(null, true);
      } else {
        cbk(new AppError(400, 'Please, upload images only!!'), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  /**
   * Save file to local disk and return image link.
   * @param {Object} file - multer file object
   * @param {Object} options - saving options
   * @param {...string} pathSegments - path segments
   * @returns {string}
   */
  static async save(file, options, ...pathSegments) {
    if (file.size > (options?.maxSize ? options.maxsize * 1024 * 1024 : 1 * 1024 * 1024)) {
      throw new AppError(400, 'File is too large..');
    }

    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

    await fse.ensureDir(fullFilePath);
    await sharp(file.buffer)
      .resize({ height: options?.height || 300, width: options?.width || 300 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;

/* OPTIONAL Jimp example
const avatar = await jimp.read(file.buffer);
await avatar
  .cover(options.width || 500, options.height || 500)
  .quality(90)
  .writeAsync(path.join(fullFilePath, fileName));
*/
