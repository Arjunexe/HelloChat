import { model, models, Schema } from "mongoose";
import mongoose from "mongoose";

export interface Thread extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  postImage: string;
  likedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const ThreadSchema = new Schema<Thread>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: false,
      trim: true,
    },

    postImage: {
      type: String,
      required: false,
    },

    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },

  { timestamps: true },
);

const Thread = models.Thread || model<Thread>("Thread", ThreadSchema);

export default Thread;

