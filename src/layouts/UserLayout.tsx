import { MenuDataItem } from '@/components/SiderMenu';
import { ConnectProps, ConnectState } from '@/models/connect';
import getPageTitle from '@/utils/getPageTitle';
import { GlobalFooter } from 'ant-design-pro';
import classnames from 'classnames';
import { Icon } from 'antd';
import { connect } from 'dva';
import React, { Component, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi-plugin-locale';
import Link from 'umi/link';
import logo from '../assets/logo.jpg';
import background from '../assets/background.jpg';
import styles from './UserLayout.less';
import settings from 'config/defaultSettings';
import { Button, Col, Layout, Row, Table, Tree } from 'antd';
const { Sider, Content } = Layout;

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 {settings.company}
  </Fragment>
);

export interface UserLayoutProps extends ConnectProps {
  route: MenuDataItem;
  breadcrumbNameMap: { [path: string]: MenuDataItem };
  navTheme: string;
}

class UserLayout extends Component<UserLayoutProps> {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch!({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const { children, location, breadcrumbNameMap } = this.props;
    return (
      <DocumentTitle title={getPageTitle(location!.pathname, breadcrumbNameMap)}>
        <Layout style={{ height: '100%' }}>
          <Sider theme="light" width="40%">
            <div className={classnames(styles.container)} style={{ background: '#ffffff' }}>
              <div style={{ height: '20%' }} />
              <div className={styles.content}>
                <div className={styles.top}>
                  <div className={styles.header}>
                    <Link to="/">
                      <img alt="logo" className={styles.logo} src={logo} />
                      <span className={styles.title}>{settings.title}</span>
                    </Link>
                  </div>
                  <div className={styles.desc}>{settings.description}</div>
                </div>
                {children}
              </div>
              <GlobalFooter links={links} copyright={copyright} />
            </div>
          </Sider>
          <Content>
            <img src={background} />
          </Content>
        </Layout>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }: ConnectState) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
