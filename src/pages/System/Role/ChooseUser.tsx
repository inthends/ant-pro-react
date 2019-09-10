import { Modal } from "antd";
import React from "react";

interface ModifyProps {
  visible: boolean;
  data?: any;
  close(): void;
}
const ChooseUser = (props: ModifyProps) => {
  const { visible, data, close } = props;

  return (
    <Modal
      title="选择角色成员"
      maskClosable={false}
      visible={visible}
      onOk={close}
      onCancel={close}
      width={800}
    >
      <div style={{ height: 500, display: "flex" }}>
        <div
          style={{
            width: 250,
            height: "100%",
            overflow: "auto"
          }}
        >
          111111
        </div>
      </div>
    </Modal>
  );
};

export default ChooseUser;
