import { UserPermissions } from './user-permissions.constant'

export interface MenuItem {
    key: string
    path: string
    title: string
    permissions: string[]
}

export interface Submenu {
    key: string
    title: string
    permissions: string[]
    icon: string
    items: MenuItem[]
}

const sidebarMenu: Submenu[] = [
    {
        key: 'user-management',
        title: 'Users',
        permissions: [UserPermissions.USERS_VIEW, UserPermissions.ROLES_VIEW],
        icon: 'user',
        items: [
            {
                key: '/admin/users',
                path: '/admin/users',
                title: 'Sidebar.users',
                permissions: [UserPermissions.USERS_VIEW],
            },
            {
                key: '/admin/roles',
                path: '/admin/roles',
                title: 'Sidebar.roles',
                permissions: [UserPermissions.ROLES_VIEW],
            },
        ],
    },
    {
        key: 'company',
        title: 'Sidebar.website',
        permissions: [],
        icon: 'idcard',
        items: [
            {
                key: '/main/company',
                path: '/main/company',
                title: 'Sidebar.companyInfo',
                permissions: [],
            },
            {
                key: '/main/uploadImages',
                path: '/main/uploadImages',
                title: 'Sidebar.uploadImages',
                permissions: [],
            },
            {
                key: '/main/blog',
                path: '/main/blog',
                title: 'Sidebar.blog',
                permissions: [],
            },
            {
                key: '/main/menuconfig',
                path: '/main/menuconfig',
                title: 'Sidebar.menuconfig',
                permissions: [],
            },
        ],
    },
]

export default sidebarMenu
