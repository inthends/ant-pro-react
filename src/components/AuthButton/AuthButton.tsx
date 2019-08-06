import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button/button';
import { connect } from 'dva';
import React from 'react';
import { AuthModelState } from '@/models/auth';

interface AuthButtonProps extends ButtonProps {
  code: string;
  authbtnlist?: any[];
  pathname?: string;
}

const AuthButton = (props: AuthButtonProps) => {
  const { authbtnlist = {}, pathname = '', code, disabled = false } = props;
  let authlist: any[] = [];
  for (let key in authbtnlist) {
    authlist = [...authlist, authbtnlist[key]];
  }
  console.log(authbtnlist);
  const authDisabled =
    authlist.some(item => (item.actionAddress = pathname && item.enCode === code)) || disabled;

  return <Button {...props} disabled={authDisabled}></Button>;
};

interface RoutingType {
  location: {
    pathname: string;
  };
}
export default connect(({ routing, auth }: { routing: RoutingType; auth: AuthModelState }) => ({
  pathname: routing.location.pathname,
  authbtnlist: auth.authbtnlist,
}))(AuthButton);
