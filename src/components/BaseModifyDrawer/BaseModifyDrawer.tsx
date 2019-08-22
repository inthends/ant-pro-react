import React, { useEffect, useState } from 'react';
import { Drawer, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
interface BaseModifyProps {
  visible: boolean;
  closeDrawer(): void;
  reload(): void;
  name: string;
  data?: any;
  children?: React.ReactNode;
  form: WrappedFormUtils;
}
interface BaseModifyStates {
  saveSuccess?(): void;
}

const BaseModify = React.createContext<BaseModifyStates>({});

const BaseModifyProvider = (props: BaseModifyProps) => {
  const { closeDrawer, reload, children, data, name, visible, form } = props;
  const title = data === undefined ? `添加${name}` : `修改${name}`;
  const saveSuccess = () => {
    message.success('保存成功');
    closeDrawer();
    reload();
  };

  return (
    <BaseModify.Provider value={{ saveSuccess }}>
      <Drawer
        title={title}
        placement="right"
        width={600}
        onClose={closeDrawer}
        visible={visible}
        bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
      >
        {visible ? children : null}
      </Drawer>
    </BaseModify.Provider>
  );
};

export { BaseModify, BaseModifyProvider };
