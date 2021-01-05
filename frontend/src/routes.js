import Roles from './types/Roles.js'

export const sidebarRoutes = {
  user: {
    headTitle: 'USER',
    roles: [Roles.OWNER, Roles.ADMIN],
    routes: [
      {
        id: 1,
        path: '/admin/user-table',
        name: 'Manage Users list',
        iconClass: 'ni ni-bullet-list-67 text-red'
      },
      {
        id: 2,
        path: '/admin/insert-user',
        name: 'Insert user',
        iconClass: 'ni ni-single-02 text-yellow'
      }
    ]
  },
  factory: {
    headTitle: 'FACTORY',
    roles: [Roles.OWNER],
    routes: [
      {
        id: 3,
        path: '/admin/factory-table',
        name: 'Manage Factories list',
        iconClass: 'ni ni-bullet-list-67 text-red'
      },
      {
        id: 4,
        path: '/admin/insert-factory',
        name: 'Insert factory',
        iconClass: 'ni ni-building text-yellow'
      }
    ]
  },
  classification: {
    headTitle: 'NU/NP/NM',
    roles: [Roles.ADMIN],
    routes: [
      {
        id: 5,
        path: '/admin/tree/classification',
        name: 'Manage UC/NA/NM list',
        iconClass: 'ni ni-bullet-list-67 text-red'
      },
      {
        id: 6,
        path: '/admin/tree/items',
        name: 'Items',
        iconClass: 'ni ni-bullet-list-67 text-blue'
      },
      {
        id: 7,
        path: '/admin/tree/insert-classification',
        name: 'Insert UC/NA/NM/Item',
        iconClass: 'ni ni-single-copy-04 text-yellow'
      }
    ]
  },
  audit: {
    headTitle: 'AUDIT',
    roles: [Roles.ADMIN],
    routes: [
      {
        id: 1,
        path: '/admin/audit/table-audit',
        name: 'Audit table',
        iconClass: 'ni ni-bullet-list-67 text-red'
      },
      {
        id: 2,
        path: '/admin/audit/insert-audit',
        name: 'Insert audit',
        iconClass: 'ni ni-building text-yellow'
      }
    ]
  }
}
