import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';

// 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="403"
    title="403"
    subTitle="无权限"
    extra={
      <Button type="primary" onClick={() => router.replace('/')}>
        返回
      </Button>
    }
  ></Result>
);

export default NoFoundPage;
