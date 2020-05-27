
import { connect } from 'dva';
import React from 'react';
import { AuthModelState } from '@/models/auth';

//有权限的连接，用于列表中的按钮
interface AuthLinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  module: string;
  code: string;
  authbtnlist?: any[];
}

const AuthLink = (props: AuthLinkProps) => {
  const { authbtnlist = [], module, code } = props;
  const show = authbtnlist.some(item => (item.moduleId == module && item.enCode == code));
  return show ? <a {...props} dispatch={null} ></a> : null;
};

export default connect(({ auth }: { auth: AuthModelState }) => ({
  authbtnlist: auth.authbtnlist
}))(AuthLink);
