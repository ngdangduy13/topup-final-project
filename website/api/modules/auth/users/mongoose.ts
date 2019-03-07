import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { IUser } from './interface';

const UsersSchema = new mongoose.Schema(addAuditSchema(addActiveSchema({
  username: String,
  email: String,
  password: String,
  profileImgUrl: String,
  firstName: String,
  lastName: String,
  fullName: String,
  normalizedFullName: String,
  dob: Date,
  phoneNumber: String,
  i18n: {
    type: String,
    default: 'en-US',
  },
  permissions: [String],
  roles: [String],

  externalLogin: {
    google: {
      id: String,
      email: String,
    },
    facebook: {
      id: String,
      email: String,
    },
  },

  failLoginTryCount: Number,
  emailConfirmed: Boolean,
  lastLoginTime: Date,

  scorePoint: Number,
  rewardPoint: Number,

  resetPasswordToken: String,
  resetPasswordExpires: Date,
})));

const UsersModel = mongoose.model<IUser>('User', UsersSchema);
UsersSchema.index({ email: 1 });
UsersSchema.index({ fullName: 1 });
UsersSchema.index({ username: 1 });
export {
  UsersSchema,
};
export default UsersModel;
