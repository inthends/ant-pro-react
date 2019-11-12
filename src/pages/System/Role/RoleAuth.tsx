//权限设置
import React, { useEffect, useState, useRef } from 'react';
import { Modal, Tree, Tabs, message, Spin } from 'antd';
import styles from './style.less';
import { GetDataHalfCheckIds, GetDataCheckIds, GetHalfCheckIds, GetCheckIds, GetAuths, GetDataAuths, SaveDataAuthorize, SaveModuleAuthorize } from './Role.service';
const { TabPane } = Tabs;
interface RoleAuthProps {
  visible: boolean;
  roleId?;
  close(): void;
}
const RoleAuth = (props: RoleAuthProps) => {
  const { visible, close, roleId } = props;
  const treeRef = useRef(null);
  useEffect(() => {
    if (visible) {
      changeTab(ACTIVEKEYS.功能权限);
    }
  }, [visible]);

  const [auths, setAuths] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>(ACTIVEKEYS.功能权限);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);//选中的模块节点 
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<string[]>([]);//半选中节点

  const save = (tab, treeData) => {
    //let keys = checkedKeys;//[];
    // if (treeRef.current) {
    //   keys = (treeRef!.current! as any).tree.state.checkedKeys;
    // } else {
    //   return;
    // } 

    if (checkedKeys.length == 0)
      return;

    if (tab === ACTIVEKEYS.数据权限) {
      //const halfchecks = halfCheckedKeys.join(',');//半选节点 
      SaveDataAuthorize({ roleId, halfchecks: halfCheckedKeys.join(','), authorizeDataJson: checkedKeys.join(',') }).then(() => {
        message.success('保存成功！');
        close();
      });
    } else if (tab === ACTIVEKEYS.功能权限) {
      const moduleIds = getMenu(checkedKeys, treeData, 'menu').join(',');
      const moduleButtonIds = getMenu(checkedKeys, treeData, 'button').join(',');
      const halfchecks = halfCheckedKeys.join(',');//半选节点
      SaveModuleAuthorize({ roleId, halfchecks, moduleIds, moduleButtonIds }).then(() => {
        message.success('保存成功！');
        close();
      });
    }
  };

  //点击事件
  const onCheck = (checkedKeys, info) => { 
    //let checkedKeysResult = [...checkedKeys, ...info.halfCheckedKeys];
    setCheckedKeys(checkedKeys);
    setHalfCheckedKeys(info.halfCheckedKeys);//半选中节点
  };

  const changeTab = (e: string) => {
    setActiveKey(e);
    setIsLoaded(false);
    if (e === ACTIVEKEYS.功能权限) {
      GetAuths(roleId).then(res => {
        setAuths(res || []);

        //半选
        GetHalfCheckIds(roleId).then(res => {
          setHalfCheckedKeys(res || []);
        })

        //全选
        GetCheckIds(roleId).then(res => {
          setCheckedKeys(res || []);
        })

        setIsLoaded(true);
      });
      // } else if (e === ACTIVEKEYS.操作权限) {
      //   GetButtonAuths(roleId).then(res => {
      //     console.log(res);
      //     setAuths(res);
      //     setIsLoaded(true);
      //   });
    } else if (e === ACTIVEKEYS.数据权限) {
      GetDataAuths(roleId).then(res => {
        //console.log(JSON.parse(res));


        //半选
        GetDataHalfCheckIds(roleId).then(res => {
          setHalfCheckedKeys(res || []);
        })

        //全选
        GetDataCheckIds(roleId).then(res => {
          setCheckedKeys(res || []);
        })

        setAuths(res || []);
        //setAuths(JSON.parse(res).treeJson || []);
        setIsLoaded(true);
      });
    }
  };
  return (
    <Modal
      title={
        <Tabs size="small" style={{ height: 30 }} activeKey={activeKey} onChange={changeTab}>
          <TabPane tab="功能权限" key={ACTIVEKEYS.功能权限} disabled={!isLoaded}></TabPane>
          {/* <TabPane tab="操作权限" key={ACTIVEKEYS.操作权限}></TabPane> */}
          <TabPane tab="数据权限" key={ACTIVEKEYS.数据权限} disabled={!isLoaded}></TabPane>
        </Tabs>
      }
      visible={visible}
      okText="保存"
      cancelText="取消"
      onCancel={() => close()}
      onOk={() => save(activeKey, auths)}
      destroyOnClose={true}
      // bodyStyle={{ background: '#f6f7fb' }}
      width="500px"
    >
      {visible ? (
        <div style={{ height: 400, overflow: 'auto' }}>
          {isLoaded ? (
            <Tree
              showLine
              checkable
              // checkedKeys={checkedKeys}
              checkedKeys={{ checked: checkedKeys, halfChecked: halfCheckedKeys }}
              onCheck={onCheck}
              treeData={auths}
              key={activeKey}
              defaultExpandAll
              ref={treeRef} 
            ></Tree>
          ) : <Spin className={styles.spin}   />}
        </div>
      ) : null}
    </Modal>
  );
};

export default RoleAuth;
enum ACTIVEKEYS {
  功能权限 = '1',
  // 操作权限 = '2',
  数据权限 = '3',
}

const getMenu = (keys: string[], treeData: any[], type: string, list: string[] = []) => {
  treeData.forEach(item => {
    if (item.children) {
      getMenu(keys, item.children, type, list);
    }
    if (keys.includes(item.value) && item.type === type) {
      list.push(item.value);
    }
  });
  return list;
};
