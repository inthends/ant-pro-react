import { Layout } from 'antd';
import React, { Fragment } from 'react';
import { GlobalFooter } from 'ant-design-pro'; 
// import settings from 'config/defaultSettings'; 
const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[]}
      copyright={
        <Fragment>{/* Copyright <Icon type="copyright" /> 南京乐软 2019 {settings.company} */}</Fragment>
      }
    />
  </Footer>
);
export default FooterView;
