import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
//configure stroage
const stroage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an mage! Please upload only images."));
  }
};

export const upload = multer({
  storage: stroage,
  fileFilter: fileFilter,
  limits: { fieldSize: 1024 * 1024 * 5 },
});
