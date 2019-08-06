import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { connect } from 'dva';
import HeaderDropdown from '../HeaderDropdown';
import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { Menu, Icon } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import { router } from 'umi';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  currentUser?: CurrentUser;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { currentUser, theme, layout } = props;
  let className = styles.right;
  const menu = (
    <Menu className={styles.menu}>
      <Menu.Item key="userCenter">
        <Icon type="user" />
        <FormattedMessage id="menu.account.center" defaultMessage="account center" />
      </Menu.Item>
      <Menu.Item key="userinfo">
        <Icon type="setting" />
        <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={() => { router.replace('/') }}>
        <Icon type="logout" />
        <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
      </Menu.Item>
    </Menu>
  );
  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <div className={className}>
      {currentUser && currentUser.name ? (
        <HeaderDropdown overlay={menu}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={currentUser.avatar}
              icon="user"
              alt="avatar"
            />
          </span>
        </HeaderDropdown>
      ) : (
          <div />
        )}
    </div>
  );
};

export default connect(({ settings, user }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  currentUser: user.currentUser,
}))(GlobalHeaderRight);
