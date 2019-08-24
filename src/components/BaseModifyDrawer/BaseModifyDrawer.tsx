import React, { useEffect, useState } from 'react';
import { Drawer, message, Button } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
interface BaseModifyProps {
  visible: boolean;
  closeDrawer(): void;
  reload(): void;
  save(data): Promise<any>;
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
  const { closeDrawer, reload, children, data, name, visible, form, save } = props;
  const title = data === undefined ? `添加${name}` : `修改${name}`;

  const saveSuccess = () => {
    message.success('保存成功');
    closeDrawer();
    reload();
  };
  const clickSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        save(values).then(saveSuccess);
      }
    });
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
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={clickSave} type="primary">
            提交
          </Button>
        </div>
      </Drawer>
    </BaseModify.Provider>
  );
};

export { BaseModify, BaseModifyProvider };
