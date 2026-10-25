import { Schema, model, InferSchemaType } from 'mongoose';

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 100, unique: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type TaskDoc = InferSchemaType<typeof taskSchema>;
export const Task = model('Task', taskSchema);
