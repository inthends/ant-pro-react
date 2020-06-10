
//跟进
import { Button, Drawer, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React from 'react';
import CommentBox from './CommentBox';

interface FollowProps {
  visible: boolean;
  id?: string;
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
};

const Follow = (props: FollowProps) => {
  const { id, visible, closeDrawer, reload } = props;

  //打开抽屉时初始化
  // useEffect(() => {
  //   if (visible) { 
  //     if (id) {
  //     }
  //   }
  // }, [visible]);

  return (
    <Drawer
      title='跟进'
      placement="right"
      width={500}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <CommentBox
          visible={visible}
          id={id}
          reload={reload}
        />
      </Form>
      <div
        style={{
          position: 'absolute',
          zIndex: 999,
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
          关闭
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<FollowProps>()(Follow);

