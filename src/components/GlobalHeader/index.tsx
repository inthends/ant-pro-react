import { ConnectProps, ConnectState } from '@/models/connect';
import { EnvModelState } from '@/models/env';
import { getCurrEnv, setEnv } from '@/services/env';
import { Icon, Select } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import styles from './index.less';
import RightContent, { GlobalHeaderRightProps } from './RightContent';
const { Option } = Select;

type PartialGlobalHeaderRightProps = {
  [K in
    | 'onMenuClick'
    | 'onNoticeClear'
    | 'onNoticeVisibleChange'
    | 'currentUser']?: GlobalHeaderRightProps[K]
};

export interface GlobalHeaderProps extends PartialGlobalHeaderRightProps, ConnectProps {
  env: EnvModelState;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  logo?: string;
  history: any;
}

export interface GlobalHeaderStates {
  envCode?: string;
}

class GlobalHeader extends Component<GlobalHeaderProps, GlobalHeaderStates> {
  triggerResizeEvent = debounce(() => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  });
  constructor(props) {
    super(props);
    this.state = {
      envCode: undefined,
    };
  }
  componentDidMount() {
    const { list: envList } = this.props.env;
    const { dispatch } = this.props;
    if (envList === undefined) {
      dispatch!({ type: 'env/fetch' });
    }
    getCurrEnv().then(envCode => {
      this.setState({ envCode });
    });
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    if (onCollapse) onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  changeEnv = envCode => {
    setEnv(envCode).then(res => {
      if (res.code === '0') {
        this.setState({ envCode });
        const curr = this.props.history.location.pathname;
        router.push('/welcome');
        router.push(curr);
      }
    });
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    const envList = this.props.env.list || [];
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        <Select value={this.state.envCode} style={{ width: 200 }} onSelect={this.changeEnv}>
          {envList.map(element => {
            return (
              <Option value={element.envCode} key={element.envCode}>
                {element.envName}
              </Option>
            );
          })}
        </Select>
        <RightContent {...this.props} />
      </div>
    );
  }
}

export default connect(({ env }: ConnectState) => ({
  env,
}))(GlobalHeader);
