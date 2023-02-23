import multer from "multer";
import { Router } from "express";
import { createUser, loginUser } from "../controllers/usersControllers.js";

const usersRouter = Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "/uploads");
  },

  filename(req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ dest: "uploads/" });

usersRouter.post("/login", loginUser);
usersRouter.post("/register", upload.single("avatar"), createUser);

export default usersRouter;
