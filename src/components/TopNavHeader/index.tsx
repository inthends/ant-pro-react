import { SiderMenuProps } from '@/components/SiderMenu';
import React, { Component } from 'react';
import Link from 'umi/link';
import RightContent, { GlobalHeaderRightProps } from '../GlobalHeader/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
import styles from './index.less';
import defaultSettings, { ContentWidth } from '../../../config/defaultSettings';
import { Menu } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { MenuModel } from '@/models/menu';

export interface TopNavHeaderProps extends SiderMenuProps, GlobalHeaderRightProps {
  contentWidth?: ContentWidth;
  menu: MenuModel;
}

interface TopNavHeaderState {
  maxWidth?: number;
}

class TopNavHeader extends Component<TopNavHeaderProps, TopNavHeaderState> {
  static getDerivedStateFromProps(props: TopNavHeaderProps) {
    return {
      maxWidth: (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) - 280 - 165 - 40,
    };
  }

  state: TopNavHeaderState = {};

  maim: HTMLDivElement | null = null;

  render() {
    const { theme, contentWidth, menuData, logo } = this.props;
    console.log(this.props);
    const { maxWidth } = this.state;
    const flatMenuKeys = getFlatMenuKeys(menuData);
    const {
      menu: { secondMenu },
    } = this.props;
    return (
      <div
        className={`${styles.head} ${theme === 'light' ? styles.light : ''}`}
        style={{ height: '80px' }}
      >
        <div
          ref={ref => (this.maim = ref)}
          className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}
          style={{ paddingLeft: 0 }}
        >
          <div className={styles.left}>
            <div className={styles.logo} key="logo" id="logo">
                <img src={logo} alt="logo" />
            </div>
            <div style={{ flexGrow: 1,background: '#EBEBED'}} id="first_menu">
              <BaseMenu
                {...this.props}
                flatMenuKeys={flatMenuKeys}
                className={styles.menu}
                style={{ lineHeight: '40px', width: '100%' }}
              />
            </div>
            <RightContent {...this.props} />
          
          </div>
          
         
        </div>
        <Menu
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '40px', width: '100%' }}
          >
            {secondMenu.map(item => {
              return (
                <Menu.Item key={item.path}>
                  <Link to={item.path}>{item.name}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
      </div>
    );
  }
}
export default connect(({ menu }: ConnectState) => ({
  menu,
}))(TopNavHeader);
