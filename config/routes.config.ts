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
        icon: 'bar-chart',
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
            icon: 'project',
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
            icon: 'shop',
            component: './Resource/PublicArea/Main',
          },
          {
            name: 'parkinglot',
            path: '/resource/parkinglot',
            icon: 'car',
            component: './Resource/ParkingLot/Main',
          },
          {
            name: 'pstructuser',
            path: '/resource/pstructuser',
            icon: 'idcard',
            component: './Resource/PStructUser/Main',
          },
          {
            name: 'reciprocatingunit',
            path: '/resource/reciprocatingunit',
            icon: 'contacts',
            component: './Resource/ReciprocatingUnit/Main',
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
            icon: 'book',
            component: './Financial/FeeItem/Main',
          },
          {
            name: 'meter',
            path: '/financial/meter',
            icon: 'account-book',
            component: './Financial/Meter/Main',
          },
          {
            name: 'billingmain',
            path: '/financial/billingmain',
            icon: 'calculator',
            component: './Financial/BillingMain/Main',
          },
          {
            name: 'billnotice',
            path: '/financial/billnotice',
            icon: 'message',
            component: './Financial/BillNotice/Main',
          },
          {
            name: 'chargebill',
            path: '/financial/chargebill',
            icon: 'money-collect',
            component: './Financial/ChargeBill/Main',
          },
          {
            name: 'payment',
            path: '/financial/payment',
            icon: 'pay-circle',
            component: './Financial/Payment/Payment',
          },
          {
            name: 'offset',
            path: '/financial/offset',
            icon: 'swap',
            component: './Financial/Offset/Offset',
          },
          {
            name: 'reduction',
            path: '/financial/reduction',
            icon: 'strikethrough',
            component: './Financial/Reduction/Main',
          },
          {
            name: 'rebate',
            path: '/financial/rebate',
            icon: 'percentage',
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
            icon: 'edit',
            component: './Admin/News/Main',
          },
          {
            name: 'warehouse',
            path: '/admin/warehouse',
            icon: 'layout',
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
            icon: 'question-circle',
            component: './Estate/ServiceDesk/Main',
          },
          {
            name: 'repair',
            path: '/estate/repair',
            icon: 'file-search',
            component: './Estate/Repair/Main',
          },
          {
            name: 'complaint',
            path: '/estate/complaint',
            icon: 'phone',
            component: './Estate/Complaint/Main',
          },

          {
            name: 'devicetype',
            path: '/estate/devicetype',
            icon: 'unordered-list',
            component: './Estate/DeviceType/Main',
          },
          {
            name: 'device',
            path: '/estate/device',
            icon: 'laptop',
            component: './Estate/Device/Main',
          },
          {
            name: 'pollingcontent',
            path: '/estate/pollingcontent',
            icon: 'menu',
            component: './Estate/PollingContent/Main',
          },
          {
            name: 'pollingline',
            path: '/estate/pollingline',
            icon: 'gateway',
            component: './Estate/PollingLine/Main',
          },
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
            icon: 'snippets',
            component: './Contract/List/Main',
          },
          {
            name: 'channel',
            path: '/contract/channel',
            icon: 'snippets',
            component: './Contract/Channel/Main',
          },
          {
            name: 'merchants',
            path: '/contract/merchants',
            icon: 'snippets',
            component: './Contract/Merchants/Main',
          },
        ],
      },
      {
        name: 'workflow',
        path: '/workflow',
        // component: './workflow/editormain',
        icon: 'cluster',
        routes: [
          {
            name: 'flowedit',//name关联多语言
            path: '/workflow/flowedit',
            icon: 'tool',
            component: './Workflow/FlowEdit/Flow',
          },
          {
            name: 'flowtask',
            path: '/workflow/flowtask',//权限控制
            icon: 'form',
            component: './Workflow/FlowTask/Main',
          },
          {
            name: 'flowcompleted',
            path: '/workflow/flowcompleted',//权限控制
            icon: 'history',
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
        icon: 'setting',
        routes: [
          {
            path: '/system',
            redirect: '/System/Organize',
          },
          {
            name: 'organize',
            path: '/system/organize',
            icon: 'home',
            component: './System/Organize/Organize',
          },
          {
            name: 'department',
            path: '/system/department',
            icon: 'block',
            component: './System/Department/Main',
          },
          {
            name: 'worker',
            path: '/system/worker',
            icon: 'team',
            component: './System/Worker/Worker',
          },
          {
            name: 'user',
            path: '/system/user',
            icon: 'user',
            component: './System/User/Main',
          },
          {
            name: 'role',
            path: '/system/role',
            icon: 'solution',
            component: './System/Role/Main',
          },
          {
            name: 'code',
            path: '/system/code',
            icon: 'code',
            component: './System/Code/Code',
          },
          {
            name: 'dictionary',
            path: '/system/dictionary',
            icon: 'profile',
            component: './System/Dictionary/Dictionary',
          },
          {
            name: 'template',
            path: '/system/template',
            icon: 'file-done',
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
