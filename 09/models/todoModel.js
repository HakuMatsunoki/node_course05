const { model, Schema, Types } = require('mongoose');

const todoSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      maxLength: [30, 'Too much symbols..'],
      trim: true,
    },
    description: {
      type: String,
      maxLength: 300,
    },
    due: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Todo must have an owner..'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Todo = model('Todo', todoSchema);

module.exports = Todo;
