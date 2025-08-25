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
  title: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  lastUpdatedAt: Date;
  createdAt: Date;
}
