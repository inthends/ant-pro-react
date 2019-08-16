export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: './Login',
      },
    ],
  },
  {
    path: '/exception/403',
    component: './403',
  },

  
  // {
  //   path: '/register',
  //   component: '../layouts/UserLayout',
  //   routes: [
  //     {
  //       path: '/register',
  //       name: 'register',
  //       component: './Register/Register',
  //
  //     },
  //   ],
  // },

  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/login',
      },
      {
        name: 'resource',
        path: '/resource',
        component: './Resource/Resource',
        icon:'bank',
        routes: [
          {
            path: '/resource',
            redirect: '/resource/house',
          },
          {
            name: 'house',
            path: '/resource/house',
            component: './Resource/House/House',
          },
          {
            name: 'housemore',
            hideInMenu: true,
            path: '/resource/housemore',
            component: './Resource/House/HouseMore',
          },
          {
            name: 'publicarea',
            path: '/resource/publicarea',
            component: './Resource/PublicArea/PublicArea',
          },
          {
            name: 'parkinglot',
            path: '/resource/parkinglot',
            component: './Resource/ParkingLot/ParkingLot',
          },
          {
            name: 'pstructuser',
            path: '/resource/pstructuser',
            component: './Resource/PStructUser/PStructUser',
          },
          {
            name: 'reciprocatingunit',
            path: '/resource/reciprocatingunit',
            component: './Resource/ReciprocatingUnit/ReciprocatingUnit',
          },
        ],
      },

      {
        name: 'financial',
        path: '/financial',
        icon:'pay-circle', 
        component: './Financial/Financial',
        routes: [
          {
            path: '/financial',
            redirect: '/financial/feeitem',
          },
          {
            name: 'feeitem',
            path: '/financial/feeitem',
            component: './Financial/FeeItem/Main',
          },
          {
            name: 'meter',
            path: '/financial/meter',
            component: './Financial/Meter/Meter',
          },
          {
            name: '周期费计算',
            path: '/financial/test2',
            component: './Financial/Test1',
          },
          {
            name: '通知单',
            path: '/financial/test3',
            component: './Financial/Test1',
          },
          {
            name: 'chargebill',
            path: '/financial/chargebill',
            component: './Financial/ChargeBill/Main',
          },
          {
            name: '付款管理',
            path: '/financial/test5',
            component: './Financial/Test1',
          },
          {
            name: 'offset',
            path: '/financial/offset',
            component: './Financial/Offset/Offset',
          },
          {
            name: 'reduction',
            path: '/financial/reduction',
            component: './Financial/Reduction/Main',
          },
        ],
      },
      {
        name: 'admin',
        path: '/admin', 
        icon:'security-scan',
        component: './Admin/Admin',
        routes: [
          {
            path: '/admin',
            redirect: '/admin/servicedesk',
          },
          {
            name: 'servicedesk',
            path: '/admin/servicedesk',
            component: './Admin/ServiceDesk/Main',
          },
          {
            name: 'repair',
            path: '/admin/repair',
            component: './Admin/Repair/Main',
          },
          {
            name: 'complaint',
            path: '/admin/complaint',
            component: './Admin/Complaint/Main',
          },
        ],
      },

      {
        name: 'contract',
        path: '/contract',
        icon:'transaction',
        component: './Contract/Contract',
        routes: [
          {
            path: '/contract',
            redirect: '/contract/list',
          },
          {
            name: 'list',
            path: '/contract/list',
            component: './Contract/List/Main',
          },
          {
            name: '归档合同',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
        ],
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
        path: '/System',

        routes: [
          {
            path: '/system',
            redirect: '/System/Organize',
          },
          {
            name: '机构设置',
            path: '/system/organize',
            component: './System/Organize/Main',
          },
          {
            name: '部门资料',
            path: '/system/department',
            component: './System/Department/Main',
          },
          {
            name: '员工资料',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
          {
            name: '角色资料',
            path: '/system/role',
            component: './System/Role/Main',
          },
          {
            name: '用户管理',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
          {
            name: '菜单管理',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
          {
            name: '编码管理',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
          {
            name: '词典管理',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
          {
            name: '模板管理',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
          {
            name: '接口管理',
            path: '/resource/test1',
            component: './Resource/Test1',
          },
        ],
      },
    ],
  },
];
