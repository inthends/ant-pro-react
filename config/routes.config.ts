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
      //个人中心
      {
        name: 'account',
        hideInMenu: true,
        path: '/account',
        icon: 'user',
        routes: [
          {
            name: 'settings',
            path: '/account/settings',
            component: './Account/Settings',
          },
        ],
      },
      //数据中心
      {
        name: 'dashboard',
        path: '/dashboard',
        component: './Dashboard/Dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard',
            redirect: '/dashboard/analysis',
          },
          {
            name: 'analysis',
            path: '/dashboard/analysis',
            component: './Dashboard/Analysis',
          },
          // {
          //   name: 'workplace',
          //   path: '/dashboard/workplace',
          //   component: './dashboard/workplace',
          // }, 
          {
            name: 'reconciliation',
            path: '/dashboard/reconciliation',
            component: './Dashboard/Reconciliation/Reconciliation',
          },

          {
            name: 'billdetails',
            path: '/dashboard/billdetails',
            component: './Dashboard/BillDetails/BillDetails',
          },

          {
            name: 'receiptdetails',
            path: '/dashboard/receiptdetails',
            component: './Dashboard/ReceiptDetails/ReceiptDetails',//js组件
          },

          {
            name: 'receivabledivide',
            path: '/dashboard/receivabledivide',
            component: './Dashboard/Receivabledivide/Receivabledivide',
          },
          {
            name: 'receiveddivide',
            path: '/dashboard/receiveddivide',
            component: './Dashboard/Receiveddivide/Receiveddivide',
          },

        ],
      },
      //资源管理
      {
        name: 'resource',
        path: '/resource',
        component: './Resource/Resource',
        icon: 'bank',
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
        icon: 'pay-circle',
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
            name: 'billingmain',
            path: '/financial/billingmain',
            component: './Financial/BillingMain/BillingMain',
          },
          {
            name: 'billnotice',
            path: '/financial/billnotice',
            component: './Financial/BillNotice/BillNotice',
          },
          {
            name: 'chargebill',
            path: '/financial/chargebill',
            component: './Financial/ChargeBill/Main',
          },
          {
            name: 'payment',
            path: '/financial/payment',
            component: './Financial/Payment/Payment',
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
          {
            name: 'rebate',
            path: '/financial/rebate',
            component: './Financial/Rebate/Main',
          },
        ],
      },
      {
        name: 'admin',
        path: '/admin',
        icon: 'reconciliation',
        component: './Admin/Admin',
        routes: [
          {
            path: '/admin',
            redirect: '/admin/news',
          },
          {
            name: 'news',
            path: '/admin/news',
            component: './Admin/News/Main',
          },
          {
            name: 'warehouse',
            path: '/admin/warehouse',
            component: './Admin/Warehouse/Main',
          },
        ],
      },

      {
        name: 'estate',
        path: '/estate',
        icon: 'security-scan',
        component: './Estate/Estate',
        routes: [
          {
            path: '/estate',
            redirect: '/estate/servicedesk',
          },
          {
            name: 'servicedesk',
            path: '/estate/servicedesk',
            component: './Estate/ServiceDesk/Main',
          },
          {
            name: 'repair',
            path: '/estate/repair',
            component: './Estate/Repair/Main',
          },
          {
            name: 'complaint',
            path: '/estate/complaint',
            component: './Estate/Complaint/Main',
          },

          {
            name: 'devicetype',
            path: '/estate/devicetype',
            component: './Estate/DeviceType/DeviceType',
          },
          {
            name: 'device',
            path: '/estate/device',
            component: './Estate/Device/Device',
          }
        ],
      },
      {
        name: 'contract',
        path: '/contract',
        icon: 'transaction',
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
          // {
          //   name: '归档合同',
          //   path: '/resource/test1',
          //   component: './Resource/Test1',
          // },
        ],
      },
      {
        name: 'workflow',
        path: '/workflow',
        // component: './workflow/editormain',
        icon: 'highlight',
        routes: [
          {
            name: 'flowedit',//name关联多语言
            path: '/workflow/flowedit',
            component: './Workflow/FlowEdit/Flow',
          },
          {
            name: 'flowtask',
            path: '/workflow/flowtask',//权限控制
            component: './Workflow/FlowTask/Main',
          },
          {
            name: 'flowcompleted',
            path: '/workflow/flowcompleted',//权限控制
            component: './Workflow/FlowCompleted/Main',
          },
          // {
          //   name: 'mind',
          //   path: '/editor/mind',
          //   component: './editor/mind',
          // },
          // {
          //   name: 'koni',
          //   path: '/editor/koni',
          //   component: './editor/koni',
          // },
        ],
      },

      {
        name: 'system',
        path: '/system',
        component: './System/System',
        icon: 'bank',
        routes: [
          {
            path: '/system',
            redirect: '/System/Organize',
          },
          {
            name: 'organize',
            path: '/system/organize',
            component: './System/Organize/Organize',
          },
          {
            name: 'department',
            path: '/system/department',
            component: './System/Department/Main',
          },
          {
            name: 'worker',
            path: '/system/worker',
            component: './System/Worker/Worker',
          },
          {
            name: 'user',
            path: '/system/user',
            component: './System/User/User',
          },
          {
            name: 'role',
            path: '/system/role',
            component: './System/Role/Role',
          },
          {
            name: 'code',
            path: '/system/code',
            component: './System/Code/Code',
          },
          {
            name: 'dictionary',
            path: '/system/dictionary',
            component: './System/Dictionary/Dictionary',
          },
          {
            name: 'template',
            path: '/system/template',
            component: './System/Template/Template',
          }
          // {
          //   name: '接口管理',
          //   path: '/resource/test1',
          //   component: './Resource/Test1',
          // },
        ],
      },
    ],
  },
];
