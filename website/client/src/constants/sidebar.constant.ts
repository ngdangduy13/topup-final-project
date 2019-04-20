import { UserPermissions } from './user-permissions.constant';

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
  isExpandable: boolean;
  items?: MenuItem[];
}

const sidebarMenu: Submenu[] = [
  {
    key: 'user-management',
    title: 'Users',
    permissions: [UserPermissions.USERS_VIEW, UserPermissions.ROLES_VIEW],
    icon: 'user',
    isExpandable: false,
    path: '/admin/users',
  },
  {
    key: 'quizzes',
    title: 'Quizzes',
    permissions: [],
    icon: 'question',
    isExpandable: false,
    path: '/admin/quizzes',
  },
];

export default sidebarMenu;
