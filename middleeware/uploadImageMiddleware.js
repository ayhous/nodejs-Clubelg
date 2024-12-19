const multer = require("multer");
// eslint-disable-next-line import/no-extraneous-dependencies
const cloudinary = require("cloudinary").v2;
// eslint-disable-next-line import/no-extraneous-dependencies
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// eslint-disable-next-line import/no-extraneous-dependencies
const { removeBackground } = require("@imgly/background-removal-node");
const sharp = require("sharp");
const AsyncHandler = require("express-async-handler");

const fs = require("fs");

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dqrlbvdfc",
  api_key: process.env.CLOUDINARY_API_KEY || "523132222674519",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "ywQkQ8jxpfzJ28hVkjme2SudtaQ",
});

exports.uploadSingleImageDisk = (filename, namePath = null, format = null) => {
  console.log("uploadSingleImageDisk ===>", filename);
  let imageName = "";
  const filenameImage = filename;
  let fullPath = "";
  console.log("In function upload image ===> uploadSingleImageDisk");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("In function destination ===> destination");
      const { NID } = req; // Adjust as needed depending on where NID is coming from
      fullPath = `uploads/${namePath}/${NID}/${filename}/`;
      console.log("In fullPath ===> fullPath", fullPath);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },

    filename: function (req, file, cb) {
      console.log("In function filename ===> filename");

      imageName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${
        format || "jpg"
      }`; // Default format to 'jpg' if not provided
      cb(null, `${imageName}`);
    },
  });

  const upload = multer({ storage: storage }).single(filename); // Use `single` if uploading one file
  console.log("In after upload image ===> upload");

  return AsyncHandler(async (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.log("err ===> err", err);
        return next(err);
      }
      // File is uploaded, proceed to the next middleware
      req.body[filenameImage] = fullPath + imageName;
      next();
    });
  });
};

// exports.resizeMultiImageMiddleware = (req, res, next) => {
//   if (req.files.images) {
//     console.log(req.files);
//   }
// };

async function removeImageBackground(imgSource) {
  try {
    // Removing background
    const blob = await removeBackground(imgSource);

    // // Converting Blob to buffer
    // const buffer = Buffer.from(await blob.arrayBuffer());

    // // Generating data URL
    // const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;

    // Returning the data URL
    return blob;
  } catch (error) {
    // Handling errors
    throw new Error(`Error removing background: ${error}`);
  }
}

exports.resizeImageMiddleware = (
  sizeWidth,
  sizeHight,
  fieldname,
  namePath,
  format = "jpeg",
  quality = 90,
  removeBg = true
) =>
  AsyncHandler(async (req, res, next) => {
    const imageName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${format}`;
    const { NID } = req;

    const fullDir = `uploads/${namePath}/${NID}/${fieldname}`;
    const fullPath = `uploads/${namePath}/${NID}/${fieldname}/${imageName}`;

    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }
    console.log(imageName);
    if (req.file) {
      try {
        console.log("=======> start resize");
        const imageSharp = await sharp(req.file.buffer)
          .resize(sizeWidth, sizeHight, {
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy,
            withoutEnlargement: true,

            // background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .toFormat(format, { quality: quality })
          // .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .toFile(`${fullPath}`);

        if (imageSharp && removeBg) {
          console.log("removeImageBackground ====> ", imageSharp);
          await removeImageBackground(fullPath).then(() => {
            console.log("remove background ==>  ", fullPath);
          });
        }
      } catch (err) {
        console.log("Error resize image ", err);
      }

      req.body[fieldname] = fullPath;
    }
    next();
  });

exports.uploadMultiImages = (
  filename,
  sizeWidth = 1000,
  sizeHeight = 600,
  fieldname = "",
  namePath = "",
  format = "webp",
  quality = 90
) => {
  // const storage = multer.memoryStorage();
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const { NID } = req;

      // Construct the dynamic folder path
      const fullDir = `uploads/${namePath}/${NID}/${fieldname}`;

      return {
        folder: fullDir, // Use the dynamic folder path
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"], // Allowed image formats
        public_id: `${Date.now()}_${file.originalname.split(".")[0]}`, // Unique name for each file
        transformation: [
          {
            width: sizeWidth,
            crop: "scale",
            format: format,
            quality: "auto",
          },
        ],
      };
    },
  });

  console.log("uploadMultiImages");

  const multerFilter = (req, file, cb) => {
    console.log("uploadMultiImages file ===>", file);
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(Error("This file is not image, please select image"), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: multerFilter });

  // return upload.fields([{ name: filename, maxCount: 4 }]);

  const pathImages = [];
  return (req, res, next) => {
    if (!req.body[fieldname]) {
      req.body[fieldname] = [];
    }

    upload.fields([{ name: filename }])(req, res, (err) => {
      console.log("in fields ==>");
      if (err) {
        console.log("in err ==>", err);
        return next(err); // Handle error
      }

      // After upload, add each file's Cloudinary URL to req.body[fieldname]
      if (req.files && req.files[filename]) {
        console.log("Files uploaded successfully, processing files...");
        req.files[filename].forEach((file) => {
          console.log("Processing file:", file);
          pathImages.push(file.path);
          // req.body[fieldname].push(file.path); // 'file.path' will contain the Cloudinary URL
        });

        console.log("Updated req.body:", req.body);
      } else {
        console.warn("No files found in req.files or filename mismatch.");
      }
      console.log("before next() pathImages  ==>", pathImages);
      req.body[fieldname] = pathImages;
      next();
    });
  };
};

exports.resizeMultiImageMiddleware = (
  sizeWidth,
  sizeHeight,
  fieldname,
  namePath,
  format = "webp",
  quality = 90
) =>
  AsyncHandler(async (req, res, next) => {
    const { NID } = req; // Ensure NID is present in req
    const fullDir = `uploads/${namePath}/${NID}/${fieldname}`;
    const createFullPath = (imageName) => `${fullDir}/${imageName}`;

    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }
    console.log("i am out req.files");
    console.log("i am out req.files value", req.files[fieldname]);

    if (req.files && req.files[fieldname]) {
      req.body[fieldname] = [];
      console.log("i am in req.files");

      await Promise.all(
        req.files[fieldname].map(async (file) => {
          const imageName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}.${format}`;
          const fullPath = createFullPath(imageName);

          try {
            await sharp(file.buffer)
              .resize(sizeWidth, sizeHeight, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy,
                withoutEnlargement: true,
              })
              .toFormat(format, { quality: quality })
              .toFile(fullPath);

            req.body[fieldname].push(fullPath);
          } catch (err) {
            console.log("Error resizing image ", err);
          }
        })
      );
    }
    next();
  });

// const storage = multer.memoryStorage();
// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new Error("This file is not an image, please select an image"), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: multerFilter });

// exports.uploadMultiImages = (filename) => upload.fields([{ name: filename, maxCount: 4 }]);
