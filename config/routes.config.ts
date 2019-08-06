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
        name: '资源管理',
        path: '/resource',
        component: './Resource/Resource',
        icon:'bank',
        routes: [
          {
            path: '/resource',
            redirect: '/resource/house',
          },
          {
            name: '项目资料',
            path: '/resource/house',
            component: './Resource/House/House',
          },
          {
            name: '房产资料',
            path: '/resource/housemore',
            component: './Resource/House/HouseMore',
          },
          {
            name: '公共区域',
            path: '/resource/publicarea',
            component: './Resource/PublicArea/PublicArea',
          },
          {
            name: '车位资料',
            path: '/resource/parkinglot',
            component: './Resource/ParkingLot/ParkingLot',
          },
          {
            name: '住户资料',
            path: '/resource/pstructuser',
            component: './Resource/PStructUser/PStructUser',
          },
          {
            name: '往来单位',
            path: '/resource/reciprocatingunit',
            component: './Resource/ReciprocatingUnit/ReciprocatingUnit',
          },
        ],
      },

      {
        name: '财务管理',
        path: '/financial',
        icon:'pay-circle',
        component: './Financial/Financial',
        routes: [
          {
            path: '/financial',
            redirect: '/financial/feeitem',
          },
          {
            name: '费项设置',
            path: '/financial/feeitem',
            component: './Financial/FeeItem/Main',
          },
          {
            name: '水电费管理',
            path: '/financial/test1',
            component: './Financial/Test1',
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
            name: '收款管理',
            path: '/financial/chargebill',
            component: './Financial/ChargeBill/Main',
          },
          {
            name: '付款管理',
            path: '/financial/test5',
            component: './Financial/Test1',
          },
          {
            name: '费用冲抵',
            path: '/financial/test6',
            component: './Financial/Test1',
          },
          {
            name: '费用减免',
            path: '/financial/reduction',
            component: './Financial/Reduction/Main',
          },
        ],
      },
      {
        name: '物业管理',
        path: '/admin', 
        icon:'security-scan',
        component: './Admin/Admin',
        routes: [
          {
            path: '/admin',
            redirect: '/admin/servicedesk',
          },
          {
            name: '服务总台',
            path: '/admin/servicedesk',
            component: './Admin/ServiceDesk/Main',
          },
          {
            name: '报修管理',
            path: '/admin/repair',
            component: './Admin/Repair/Main',
          },
          {
            name: '投诉管理',
            path: '/admin/complaint',
            component: './Admin/Complaint/Main',
          },
        ],
      },

      {
        name: '资产运营',
        path: '/contract',
        icon:'transaction',
        component: './Contract/Contract',
        routes: [
          {
            path: '/contract',
            redirect: '/contract/list',
          },
          {
            name: '合同列表',
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
