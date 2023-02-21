import Video from "../models/Video.js";
import { createError } from "./../error.js";
import User from "../models/User.js";
export const addVideo = async (req, res, next) => {
  console.log("Im in video");
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    console.log("before saved");
    const savedVideo = await newVideo.save();
    console.log("after saved", savedVideo);
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};
export const updateVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) return next(createError(404, "Video has not found !"));
  if (req.user.id === video.userId) {
    try {
      const updatedvideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedvideo);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can only update your own video !"));
  }
};
export const deleteVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) return next(createError(404, "Video has not found !"));
  if (req.user.id === video.userId) {
    try {
      const deletedvideo = await Video.findByIdAndDelete(req.params.id);
      res.status(200).json(deletedvideo);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can only delete your own video !"));
  }
};
export const getVideo = async (req, res, next) => {
  try {
    console.log("im here getting video");
    const video = await Video.findById(req.params.id);
    console.log("video found", video);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

export const randomVideos = async (req, res, next) => {
  try {
    const randomvideos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(randomvideos);
  } catch (error) {
    next(error);
  }
};

export const trendVideos = async (req, res, next) => {
  try {
    const trendvideos = await Video.find().sort({ views: -1 });
    res.status(200).json(trendvideos);
  } catch (error) {
    next(error);
  }
};

export const addView = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.status(200).json("view has been added");
  } catch (error) {
    next(error);
  }
};
export const subVideos = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribeChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribeChannels.map(async (channel) => {
        return await Video.find({ userId: channel });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

export const getByTag = async (req, res, next) => {
  try {
    const query = req.query.tags.split(",");
    const videos = await Video.find({ tags: { $in: query } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    console.log("im in search");
    const query = req.query.q;
    console.log("query", query);
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    console.log("videos", videos);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
