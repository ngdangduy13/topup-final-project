import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { IRole } from './interface';

const RolesSchema = new mongoose.Schema(addAuditSchema(addActiveSchema({
  name: String,
  normalizedName: String,
  permissions: Array,
  isDefault: Boolean,
})));
const RolesModel = mongoose.model<IRole>('Role', RolesSchema);

export {
  RolesSchema
};
export default RolesModel;