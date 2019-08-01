/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import RightContent from '@/components/GlobalHeader/RightContent';
import SettingDrawer from '@/components/SettingDrawer';
import { ConnectState, Dispatch } from '@/models/connect';
import  AuthPage from '@/pages/Authorized';
import Authorized from '@/utils/Authorized';
import ProLayout, { BasicLayoutProps as ProLayoutProps, MenuDataItem, Settings } from '@ant-design/pro-layout';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import logo from '../assets/logo.svg';





export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  dispatch: Dispatch;
  auth: any;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[], auth: any[]): MenuDataItem[] => {
  if (auth === undefined || (auth && auth.length === 0)) {
    return [];
  }
  return menuList
    .filter(item => {
      return auth.includes(item.path);
    })
    .map(item => {
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children, auth) : [],
      };
      return Authorized.check(item.authority, localItem, null) as MenuDataItem;
    });
};
const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  // if (!isAntDesignPro()) {
  //   return defaultDom;
  // }
  return (
    <>
      {/* {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div> */}
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
    children,
    settings,
    auth: { authlist },
  } = props;
  const auths =  (authlist && authlist.map(item => item.urlAddress)) || [];
  // const [settings, setSettings] = useState<Partial<Settings>>(defaultSettings as Partial<Settings>);
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
      dispatch({
        type: 'auth/fetch',
      });
    }
  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  const setSettings = (payload): void =>
    dispatch &&
    dispatch({
      type: 'settings/changeSetting',
      payload,
    });

  return (
    <>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: '/',
        //     breadcrumbName: formatMessage({
        //       id: 'menu.home',
        //       defaultMessage: 'Home',
        //     }),
        //   },
        //   ...routers,
        // ]}
        // itemRender={(route, params, routes, paths) => {
        //   const first = routes.indexOf(route) === 0;
        //   return first ? (
        //     <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        //   ) : (
        //     <span>{route.breadcrumbName}</span>
        //   );
        // }}
        footerRender={footerRender}
        menuDataRender={menuList => menuDataRender(menuList, auths)}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        <AuthPage>
          {children}
        </AuthPage>
      </ProLayout>

      <SettingDrawer settings={settings} onSettingChange={config => setSettings(config)} />
    </>
  );
};

export default connect(({ global, settings, auth }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  auth,
}))(BasicLayout);