import { ConnectProps, ConnectState, UserModelState } from '@/models/connect';
import { connect } from 'dva';
import React from 'react';
import router from 'umi/router';

interface AuthComponentProps extends ConnectProps {
  user: UserModelState;
  auth: any;
}

const AuthComponent: React.FC<AuthComponentProps> = props => {
  const {
    children,
    location,
    user,
    auth: { authlist },
  } = props;
  const { currentUser } = user;
  const auths = (authlist && authlist.map(item => item.urlAddress)) || [];
  
  const isAuth = authlist === undefined || auths.includes(location!.pathname);
  console.log(isAuth, currentUser);
  // const isLogin =
  //   currentUser && currentUser.name && isAuth
  if (!isAuth) {
    router.push(`/exception/403`);
  }
  return <>{children}</>;
};

export default connect(({ user, auth }: ConnectState) => ({
  user,
  location,
  auth,
}))(AuthComponent);
