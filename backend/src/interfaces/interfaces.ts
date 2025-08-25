import mongoose, {Document} from 'mongoose';
import {UserRole} from '../constants/roles';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ICard extends Document {
  _id: string;
  // User Profile Information
  profilePicture?: string;
  fullName: string;
  title: string;
  location: string;
  companyName: string;
  description: string;

  // Contact Information
  contact: {
    phone?: string;
    email: string;
  };

  // Social Links (optional)
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };

  // Optional sections
  services?: string[];
  products?: string[];
  gallery?: string[];

  // System fields
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  lastUpdatedAt: Date;
  createdAt: Date;
}
