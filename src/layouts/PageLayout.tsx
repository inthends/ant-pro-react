import { ConnectState } from '@/models/connect';
import { Layout } from 'antd';
import { connect } from 'dva';
import React from 'react';
const { Content } = Layout;

const PageLayout = props => {
  const {
    children,
    menu: { secondMenu },
  } = props;
  return (
    <Layout>
      <Content
        style={{
          padding: '0',
          position: 'absolute',
          top: 55,
          bottom: 0,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default connect(({ menu }: ConnectState) => ({
  menu,
}))(PageLayout);
