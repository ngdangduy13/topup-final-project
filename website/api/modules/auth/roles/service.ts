import * as Joi from 'joi';
import rolesRepository from './repository';
import { ICreateRoleInput, IFindRolesQuery, IFindRolesResult, IFindRoleDetail, IUpdateRoleInput, IActivateRole, IGetAllRolesResult } from './interface';

const addNormalizeName = (role: ICreateRoleInput) => {
  const normalizedName = role.name.toLocaleLowerCase();

  return {
    ...role,
    normalizedName,
  };
};

const findRoles = async (query: IFindRolesQuery): Promise<IFindRolesResult> => {
  return await rolesRepository.findRoles(query);
};

const createRole = async (body: ICreateRoleInput): Promise<IFindRoleDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array().required(),
    isDefault: Joi.boolean(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Name Exist
  const existedRole = await rolesRepository.findRoleByName(body.name);
  if (existedRole) {
    throw new Error('Role Name Has Been Used');
  }

  // Save to db
  return await rolesRepository.createNewRole(addNormalizeName(body));
};

const updateRole = async (body: IUpdateRoleInput): Promise<void> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string(),
    permissions: Joi.array(),
    isDefault: Joi.boolean(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Role Exist
  const existedRole = await rolesRepository.findRoleById(body._id);
  if (!existedRole) {
    throw new Error('Role Not Found');
  }

  // Update
  await rolesRepository.updateRole(body);
};

const activateRole = async (params: IActivateRole): Promise<void> => {
  // Check RoleId
  if (!params.roleId) {
    throw new Error('Role ID Is Empty');
  }

  // Check If RoleId Exist
  const existedRole = await rolesRepository.findRoleById(params.roleId);
  if (!existedRole) {
    throw new Error('Role Not Found');
  }

  // Activate
  await rolesRepository.activateRole(params);
};

const deactivateRole = async (params: IActivateRole): Promise<void> => {
  // Check RoleId
  if (!params.roleId) {
    throw new Error('Role ID Is Empty');
  }

  // Check If RoleId Exist
  const existedRole = await rolesRepository.findRoleById(params.roleId);
  if (!existedRole) {
    throw new Error('Role Not Found');
  }

  // Activate
  await rolesRepository.deactivateRole(params);
};

const getAllRoles = async (): Promise<IGetAllRolesResult> => {
  return await rolesRepository.getAllRoles();
};

export default {
  findRoles,
  createRole,
  updateRole,
  activateRole,
  deactivateRole,
  getAllRoles,
};
