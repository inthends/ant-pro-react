import { Button, Drawer, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React from 'react';
interface BaseModifyProps {
  visible: boolean;
  closeDrawer(): void;
  reload(): void;
  save(data): Promise<any>;
  name: string;
  data?: any;
  children?: React.ReactNode;
  form: WrappedFormUtils;
  width?: number;
}
interface BaseModifyStates {
  saveSuccess?(): void;
}
const BaseModify = React.createContext<BaseModifyStates>({});
const BaseModifyProvider = (props: BaseModifyProps) => {
  const { width, closeDrawer, reload, children, data, name, visible, form, save } = props;
  const mywidth = width === undefined ? 600 : width;
  const title = data === undefined ? `添加${name}` : `修改${name}`;
  const saveSuccess = () => {
    message.success('保存成功！');
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
        width={mywidth}
        onClose={closeDrawer}
        visible={visible}
        style={{ height: 'calc(100vh-50px)' }}
        bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 50px)' }}
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
            zIndex: 999,
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
