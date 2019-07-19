export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: './Login',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/register',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/register',
        name: 'register',
        component: './Register/Register',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/login',
      },
      {
        name: '资源管理',
        path: '/resource',
        component: './Resource/Resource',
        routes: [
          {
            path: '/resource',
            redirect: '/resource/house',
          },
          {
            name: '房产资料',
            path: '/resource/house',
            component: './Resource/House/House',
            hideInMenu: true,
          },
          {
            name: '公共区域',
            path: '/resource/publicArea',
            component: './Resource/PublicArea/PublicArea',
            hideInMenu: true,
          },
          {
            name: '车位资料',
            path: '/resource/ParkingLot',
            component: './Resource/ParkingLot/ParkingLot',
            hideInMenu: true,
          },
        ],
      },
      {
        name: '财务管理',
        path: '/welcome2',
        component: './Welcome',
      },
      {
        name: '物业管理',
        path: '/welcome3',
        component: './Welcome',
      },
      {
        name: '资产运营',
        path: '/welcome4',
        component: './Welcome',
      },
      {
        name: '行政管理',
        path: '/welcome5',
        component: './Welcome',
      },
      {
        name: '流程中心',
        path: '/welcome6',
        component: './Welcome',
      },
      {
        name: '商务智能',
        path: '/welcome7',
        component: './Welcome',
      },
      {
        name: '系统管理',
        path: '/welcome8',
        component: './Welcome',
      },
    ],
  },
];
