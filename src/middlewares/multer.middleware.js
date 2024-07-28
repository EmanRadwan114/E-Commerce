const validExtensions = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};

export default function multerMiddleware(extension = validExtensions.image) {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (extension.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  const upload = multer({
    storage,
  });

  return upload;
}
