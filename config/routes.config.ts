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
  // {
  //   path: '/register',
  //   component: '../layouts/UserLayout',
  //   routes: [
  //     {
  //       path: '/register',
  //       name: 'register',
  //       component: './Register/Register',
  //       hideInMenu: true,
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
          {
            name: '住户资料',
            path: '/resource/PStructUser',
            component: './Resource/PStructUser/PStructUser',
            hideInMenu: true,
          },
          {
            name: '往来单位',
            path: '/resource/reciprocatingUnit',
            component: './Resource/ReciprocatingUnit/ReciprocatingUnit',
            hideInMenu: true,
          },
        ],
      },

      {
        name: '财务管理',
        path: '/financial',
        component: '../layouts/PageLayout',
        routes: [
          {
            path: '/financial',
            redirect: '/financial/feeitem',
          },
          {
            name: '费项设置',
            path: '/financial/feeitem',
            component: './Financial/FeeItem/Main',
            hideInMenu: true,
          },
          {
            name: '水电费管理',
            path: '/financial/test1',
            component: './Financial/Test1',
            hideInMenu: true,
          }, {
            name: '周期费计算',
            path: '/financial/test2',
            component: './Financial/Test1',
            hideInMenu: true,
          }, {
            name: '通知单',
            path: '/financial/test3',
            component: './Financial/Test1',
            hideInMenu: true,
          }, {
            name: '收款管理',
            path: '/financial/chargebill',
            component: './Financial/ChargeBill/Main',
            hideInMenu: true,

          }, {
            name: '付款管理',
            path: '/financial/test5',
            component: './Financial/Test1',
            hideInMenu: true,
          }, {
            name: '费用冲抵',
            path: '/financial/test6',
            component: './Financial/Test1',
            hideInMenu: true,
          }, {
            name: '费用减免',
            path: '/financial/test7',
            component: './Financial/Test1',
            hideInMenu: true,
          }
        ],
      }, 
      {
        name: '物业管理',
        path: '/admin',
        component: '../layouts/PageLayout',
        routes: [
          {
            path: '/admin',
            redirect: '/admin/servicedesk',
          },
          {
            name: '服务总台',
            path: '/admin/servicedesk',
            component: './Admin/ServiceDesk/Main',
            hideInMenu: true,
          },
          {
            name: '报修管理',
            path: '/admin/repair',
            component: './Admin/Repair/Main',
            hideInMenu: true,
          },   {
            name: '投诉管理',
            path: '/admin/complaint',
            component: './Admin/Complaint/Main',
            hideInMenu: true,
          },
        ],
      },


      {
        name: '合同管理',
        path: '/contract',
        component: '../layouts/PageLayout',
        routes: [
          {
            path: '/contract',
            redirect: '/contract/list',
          },
          {
            name: '合同列表',
            path: '/contract/list',
            component: './Contract/List/Main',
            hideInMenu: true,
          },
          {
            name: '归档合同',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
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
        component: '../layouts/PageLayout',
        routes: [
          {
            path: '/system',
            redirect: '/System/Organize',
          },
          {
            name: '机构设置',
            path: '/system/organize',
            component: './System/Organize/Main',
            hideInMenu: true,
          },
          {
            name: '部门资料',
            path: '/system/department',
            component: './System/Department/Main',
            hideInMenu: true,
          }, {
            name: '员工资料',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
          }, {
            name: '角色资料',
            path: '/system/role',
            component: './System/Role/Main',
            hideInMenu: true,
          }, {
            name: '用户管理',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
          }, {
            name: '菜单管理',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
          }, {
            name: '编码管理',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
          }, {
            name: '词典管理',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
          }, {
            name: '模板管理',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
          }, {
            name: '接口管理',
            path: '/resource/test1',
            component: './Resource/Test1',
            hideInMenu: true,
          }
        ],
      },

    ],
  },
];
