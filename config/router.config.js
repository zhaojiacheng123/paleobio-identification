export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // iden result
  {
    path: '/iden-result',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/iden-result/:id',
        component: './Identification/result/$id',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'contact', 'member', 'identifier'],
    routes: [
      { path: '/', redirect: '/identification' },
      {
        path: '/user-manager',
        name: 'usermgr',
        icon: 'user',
        authority: ['admin'],
        component: './User/UserManager',
      },
      {
        path: '/identification',
        name: 'iden',
        icon: 'experiment',
        routes: [
          { path: '/identification', redirect: '/identification/application-form' },
          {
            authority: ['member', 'admin'],
            path: '/identification/application-form',
            name: 'app',
            component: './Identification/ApplicationForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/identification/application-form',
                redirect: '/identification/application-form/detail',
              },
              {
                path: '/identification/application-form/detail',
                component: './Identification/ApplicationFormStep0',
              },
              {
                path: '/identification/application-form/result',
                component: './Identification/ApplicationFormStep1',
              },
            ],
          },
          {
            authority: ['member', 'admin'],
            path: '/identification/list4member',
            name: 'member',
            component: './Identification/List4member',
          },
          // {
          //   authority: ['contact', 'admin'],
          //   path: '/identification/list4contact',
          //   name: 'contact',
          //   component: './Identification/List4contact',
          // },
          {
            authority: ['identifier', 'admin'],
            path: '/identification/list4indentifier',
            name: 'identifier',
            component: './Identification/List4identifier',
          },
          // {
          //   path: '/identification/list',
          //   name: 'list',
          //   component: './Identification/List',
          // },
        ],
      },
      {
        path: '/account/settings',
        name: 'settings',
        icon: 'setting',
        component: './Account/Settings/Info',
        routes: [
          {
            path: '/account/settings',
            redirect: '/account/settings/base',
          },
          {
            path: '/account/settings/base',
            component: './Account/Settings/BaseView',
          },
          {
            path: '/account/settings/security',
            component: './Account/Settings/SecurityView',
          },
          {
            path: '/account/settings/binding',
            component: './Account/Settings/BindingView',
          },
          {
            path: '/account/settings/notification',
            component: './Account/Settings/NotificationView',
          },
        ],
      },
    ],
  },
];
