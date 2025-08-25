import mongoose, {Schema} from 'mongoose';
import {ICard} from '../interfaces/interfaces';

const cardSchema = new Schema<ICard>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned user is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastUpdatedAt on save
cardSchema.pre('save', function (next) {
  this.lastUpdatedAt = new Date();
  next();
});

export const Card = mongoose.model<ICard>('Card', cardSchema);
