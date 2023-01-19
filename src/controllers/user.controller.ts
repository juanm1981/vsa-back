import e, { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { err_codes, msgs } from "../utils/messages";

const UserServiceInstance = new UserService();

const updateProfile = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const payload = req.body;

  try {
    await UserServiceInstance.updateProfile(payload, token);
    res.status(200).send();
  } catch (error: any) {
    if (error.message === msgs.username_taken) {
      res.status(400).send(msgs.username_taken);
    } else if (error.code === err_codes.not_found) {
      res.status(404).send(msgs.user_not_found);
    } else {
      console.log(error);
      res.status(500).send(error);
    }
  }
};

const likePost = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const postId = Number(req.params.id);

  try {
    await UserServiceInstance.likePost(postId, token);
    res.status(200).send();
  } catch (error: any) {
    if (error.message === msgs.user_not_found) {
      res.status(404).send(msgs.user_not_found);
    } else if (error.message === msgs.post_not_found) {
      res.status(404).send(msgs.post_not_found);
    } else {
      res.status(500).send(error.message);
    }
  }
};

const likeComment = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const commentId = Number(req.params.id);

  try {
    await UserServiceInstance.likeComment(commentId, token);
    res.status(200).send();
  } catch (error: any) {
    if (error.message === msgs.user_not_found) {
      res.status(404).send(msgs.user_not_found);
    } else if (error.message === msgs.comment_not_found) {
      res.status(404).send(msgs.comment_not_found);
    } else {
      res.status(500).send(error.message);
    }
  }
};

const follow = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const followId = Number(req.params.followId);

  try {
    if (await UserServiceInstance.follow(followId, token)) {
      res.status(200).send(msgs.followed);
    } else {
      res.status(200).send(msgs.unfollowed);
    }
  } catch (error: any) {
    if (error.code === err_codes.not_found) {
      res.status(404).send(msgs.user_not_found);
    } else {
      res.status(500).send(error);
    }
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserServiceInstance.getUsers();
    res.status(200).send(users);
  } catch (error: any) {
    if (error.message === "No users found") {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(msgs.internal);
    }
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const user = await UserServiceInstance.getUser(userId);
    res.status(200).send(user);
  } catch (error: any) {
    if (error.code === err_codes.not_found) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(msgs.internal);
    }
  }
};

export { getUsers, getUser, follow, updateProfile, likePost, likeComment };
