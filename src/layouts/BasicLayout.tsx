import SiderMenu, { MenuDataItem, SiderMenuProps } from '@/components/SiderMenu';
import { ConnectProps, ConnectState, SettingModelState, UserModelState } from '@/models/connect';
import getPageTitle from '@/utils/getPageTitle';
import { Layout } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { ContainerQuery } from 'react-container-query';
import DocumentTitle from 'react-document-title';
import useMedia from 'react-media-hook2';
import Cookies from 'js-cookie';
import qs from 'query-string';

import logo from '../assets/logo.jpg';
import Footer from './Footer';
import Header, { HeaderViewProps } from './Header';
import Context from './MenuContext';
import settings from 'config/defaultSettings';

import styles from './BasicLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

export interface BasicLayoutProps
  extends ConnectProps,
    SiderMenuProps,
    HeaderViewProps,
    Partial<SettingModelState> {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
  route: MenuDataItem;
  user: Partial<UserModelState>;
  currentUserLoading: boolean;
}

export interface BasicLayoutContext {
  location: Location;
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    breadcrumbNameMap,
    dispatch,
    children,
    collapsed,
    fixedHeader,
    fixSiderbar,
    layout: PropsLayout,
    location,
    menuData,
    navTheme,
    route: { routes, authority },
    history,
  } = props;

  if (settings.sso) {
    useEffect(() => {
      // @ts-ignore
      const { query: q = {} } = props.location!;
      if (q.access_token && q.refresh_token) {
        Cookies.set('access_token', q.access_token);
        Cookies.set('refresh_token', q.refresh_token);
        delete q.access_token;
        delete q.refresh_token;
        const search = qs.stringify(q);
        history!.replace({
          pathname: props.location!.pathname,
          search,
        });
      }
    }, [props.location!.search]);

    useEffect(() => {
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');
      if (accessToken && refreshToken) {
        dispatch!({
          type: 'login/doLogin',
        });
      }
    }, []);
  }

  /**
   * constructor
   */
  useState(() => {
    dispatch!({ type: 'user/fetchCurrent' });
    dispatch!({ type: 'setting/getSetting' });
    dispatch!({ type: 'menu/getMenuData', payload: { routes, authority } });
  });
  /**
   * init variables
   */
  const isMobile = useMedia({ id: 'BasicLayout', query: '(max-width: 599px)' })[0];
  const hasLeftPadding = fixSiderbar && PropsLayout !== 'topmenu' && !isMobile;
  const handleMenuCollapse = (payload: boolean) =>
    dispatch!({ type: 'global/changeLayoutCollapsed', payload });

  const layout = (
    <Layout>
      {PropsLayout === 'topmenu' && !isMobile ? null : (
        <SiderMenu
          logo={logo}
          theme={navTheme}
          onCollapse={handleMenuCollapse}
          menuData={menuData}
          isMobile={isMobile}
          {...props}
        />
      )}
      <Layout
        style={{
          paddingLeft: hasLeftPadding ? (collapsed ? 80 : 256) : void 0,
          minHeight: '100vh',
        }}
      >
        <Header
          menuData={menuData}
          handleMenuCollapse={handleMenuCollapse}
          logo={logo}
          isMobile={isMobile}
          {...props}
        />
        <Content className={styles.content} style={!fixedHeader ? { paddingTop: 0 } : {}}>
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );

  return (
    <React.Fragment>
      <DocumentTitle title={getPageTitle(location!.pathname, breadcrumbNameMap)}>
        <ContainerQuery query={query}>
          {params => (
            <Context.Provider value={{ location: location!, breadcrumbNameMap }}>
              <div className={classNames(params)}>{layout}</div>
            </Context.Provider>
          )}
        </ContainerQuery>
      </DocumentTitle>
    </React.Fragment>
  );
};

export default connect(({ global, setting, menu: menuModel, user, loading }: ConnectState) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  user,
  ...setting,
}))(BasicLayout);
