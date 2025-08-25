import mongoose, {Schema} from 'mongoose';
import {ICard} from '../interfaces/interfaces';

const cardSchema = new Schema<ICard>(
  {
    // User Profile Information
    profilePicture: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Contact Information
    contact: {
      phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone cannot exceed 20 characters'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
      },
    },

    // Social Links (optional)
    socialLinks: {
      instagram: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
    },

    // Optional sections
    services: [
      {
        type: String,
        trim: true,
      },
    ],
    products: [
      {
        type: String,
        trim: true,
      },
    ],
    gallery: [
      {
        type: String,
        trim: true,
      },
    ],

    // System fields
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
