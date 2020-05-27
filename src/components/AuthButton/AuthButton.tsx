import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button/button';
import { connect } from 'dva';
import React from 'react';
import { AuthModelState } from '@/models/auth';

//控制权限的按钮
interface AuthButtonProps extends ButtonProps {
  module: string;
  code: string;
  authbtnlist?: any[];
  // pathname?: string;
  btype: any;
}

// const AuthButton = (props: AuthButtonProps) => {
//   const { authbtnlist = [], pathname = '', btype, encode, disabled = false } = props;
//   const authDisabled = !authbtnlist.some(item => (item.actionAddress = pathname && item.enCode === encode)) || disabled;
//   return <Button {...props} disabled={authDisabled} type={btype}></Button>;
// };

//没有权限不可见
const AuthButton = (props: AuthButtonProps) => {
  const { authbtnlist = [], btype, module, code, disabled = false } = props;
  const show = authbtnlist.some(item => (item.moduleId == module && item.enCode == code));
  return show ? <Button {...props} disabled={disabled} type={btype} dispatch={null} ></Button> : null;
};

// interface RoutingType {
//   location: {
//     pathname: string;
//   };
// }

// export default connect(({ routing, auth }: { routing: RoutingType; auth: AuthModelState }) => ({
//   pathname: routing.location.pathname,
//   authbtnlist: auth.authbtnlist  
// }))(AuthButton);

export default connect(({ auth }: { auth: AuthModelState }) => ({
  authbtnlist: auth.authbtnlist

}))(AuthButton);
