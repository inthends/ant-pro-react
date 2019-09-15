import { Modal, Tree, Input, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import userImg from './UserCard03.png';

const UserLabel = props => {
  const { Account, DepartmentName, Name, ischeck } = props;
  const userChecked = ischeck === 1 ? ` ${styles.checked}` : ' ';
  return (
    <Col span={12}>
      <div className={styles.userLabel + userChecked}>
        <div className={styles.userImg}>
          <img src={userImg}></img>
        </div>
        <div className={styles.userContent}>
          <p>账户：{Account}</p>
          <p>姓名：{Name}</p>
          <p>部门：{DepartmentName}</p>
        </div>
      </div>
    </Col>
  );
};

export default UserLabel;
