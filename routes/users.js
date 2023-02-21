import express from "express";
import {
  update,
  deleteUser,
  getUser,
  subscribe,
  unsubscribe,
  like,
  dislike,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const router = express.Router();

//update user
router.put("/:id", verifyToken, update);

//delete User

router.delete("/:id", verifyToken, deleteUser);

//get a user

router.get("/find/:id", getUser);

//subscribe

router.put("/sub/:id", verifyToken, subscribe);

//uncsubscribe

router.put("/unsub/:id", verifyToken, unsubscribe);

//like a video

router.put("/like/:videoId", verifyToken, like);

//dislike a video

router.put("/dislike/:videoId", verifyToken, dislike);
