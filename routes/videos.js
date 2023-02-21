import express from "express";
import { verifyToken } from "./../middleware/verifyToken.js";
import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  randomVideos,
  trendVideos,
  subVideos,
  addView,
  search,
  getByTag,
} from "../controllers/video.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", verifyToken, getVideo);
router.get("/random", randomVideos);
router.get("/trend", trendVideos);
router.get("/sub", verifyToken, subVideos);
router.get("/tags", getByTag);
router.get("/search", search);

export default router;
