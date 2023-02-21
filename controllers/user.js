import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can only delete you account !"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    console.log("im getting user");
    const user = await User.findById(req.params.id);
    console.log("user is getted", user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscribed");
  } catch (error) {
    next(error);
  }
};
export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("UnSubscribed");
  } catch (error) {
    next(error);
  }
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoid = req.params.videoId;
  console.log("im in like", videoid);
  try {
    const video = await Video.findByIdAndUpdate(videoid, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    console.log("just liked");
    res.status(200).json("The video has been liked");
  } catch (error) {
    next(error);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoid = req.params.videoId;
  try {
    const video = await Video.findByIdAndUpdate(videoid, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The video has been Disliked");
  } catch (error) {
    next(error);
  }
};
