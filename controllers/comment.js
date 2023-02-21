import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

export const addComment = async (req, res, next) => {
  try {
    const newcmnt = new Comment({ ...req.body, userId: req.user.id });

    const savedcmnt = await newcmnt.save();

    res.status(200).json(savedcmnt);
  } catch (error) {
    next(error);
  }
};
export const getComments = async (req, res, next) => {
  const videoid = req.params.videoId;

  try {
    const comments = await Comment.find({ videoId: videoid });

    res.status(200).json(comments);
  } catch (error) {}
};
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(req.params.id);
    if (Comment.userId === req.user.id || video.userId === req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("Comment has been deleted !");
    } else {
      return next(createError(403, "You can delelte your own Comment"));
    }
  } catch (error) {
    next(error);
  }
};
