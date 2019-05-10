import { UserPermissions } from './user-permissions.constant';
import config from '../../../configs';

export interface MenuItem {
  key: string;
  path: string;
  title: string;
  permissions: string[];
}

export interface Submenu {
  key: string;
  title: string;
  permissions: string[];
  icon: string;
  path?: string;
  role: string[];
  isExpandable: boolean;
  items?: MenuItem[];
}

const sidebarMenu: Submenu[] = [
  {
    key: '/admin/users',
    title: 'Users',
    permissions: [UserPermissions.USERS_VIEW, UserPermissions.ROLES_VIEW],
    role: [config.roles.admin],
    icon: 'user',
    isExpandable: false,
    path: '/admin/users',
  },
  {
    key: '/admin/quizzes',
    title: 'Quizzes',
    permissions: [],
    icon: 'question',
    isExpandable: false,
    role: [config.roles.admin, config.roles.quizzMaster],
    path: '/admin/quizzes',
  },
  {
    key: '/admin/voucher',
    title: 'Voucher',
    permissions: [],
    icon: 'gift',
    isExpandable: false,
    role: [config.roles.admin],
    path: '/admin/voucher',
  },
];

export default sidebarMenu;
