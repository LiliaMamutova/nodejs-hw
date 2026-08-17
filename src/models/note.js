import {model, Schema} from "mongoose";

const noteSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    tag: {
      type: String,
      enum: [
        "Work",
        "Personal",
        "Meeting",
        "Shopping",
        "Ideas",
        "Travel",
        "Finance",
        "Health",
        "Important",
        "Todo",
      ],
      default: "Todo",
    },
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt.
    versionKey: false, // вимикає службове поле __v.
  }
);

export const Note = model("Note", noteSchema);

