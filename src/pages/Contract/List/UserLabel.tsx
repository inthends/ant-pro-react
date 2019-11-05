import { Col } from 'antd';
import React from 'react';
import styles from './style.less';
import userImg from './UserCard03.png';

const UserLabel = props => {
  const { account, departmentName, name, ischeck,onClick } = props;
  const userChecked = ischeck === 1 ? ` ${styles.checked}` : ' ';
  return (
    <Col span={12} onClick={onClick}>
      <div className={styles.userLabel + userChecked}>
        <div className={styles.userImg}>
          <img src={userImg}></img>
        </div>
        <div className={styles.userContent}>
          <p key="account">账户：{account}</p>
          <p key="name">姓名：{name}</p>
          <p key="departmentName">部门：{departmentName}</p>
        </div>
      </div>
    </Col>
  );
};

export default UserLabel;
