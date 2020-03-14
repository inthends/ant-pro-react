import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button/button';
import { connect } from 'dva';
import React from 'react';
import { AuthModelState } from '@/models/auth';

interface AuthButtonProps extends ButtonProps {
  encode: string;
  authbtnlist?: any[];
  pathname?: string;
  btype: any;
  
}

const AuthButton = (props: AuthButtonProps) => {
  const { authbtnlist = [], pathname = '', btype, encode, disabled = false } = props;
  const authDisabled = !authbtnlist.some(item => (item.actionAddress = pathname && item.enCode === encode)) || disabled;
  return <Button {...props} disabled={authDisabled} type={btype}></Button>;
};

interface RoutingType {
  location: {
    pathname: string;
  }; 
}

export default connect(({ routing, auth }: { routing: RoutingType; auth: AuthModelState }) => ({
  
  pathname: routing.location.pathname,
  authbtnlist: auth.authbtnlist

}))(AuthButton);
