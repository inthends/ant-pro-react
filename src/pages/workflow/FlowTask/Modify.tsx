import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React from "react";
import { SaveForm } from "./FlowTask.service";


interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  let initData = data ? data : { enabledMark: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date(); 
  const baseFormProps = { form, initData }; 
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.roleId };
    return SaveForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="角色" save={doSave}>
      <Card >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="fullName"
              label="角色名称"
              rules={[{ required: true, message: "请输入角色名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="角色编号"
              rules={[{ required: true, message: "请输入角色编号" }]}
            ></ModifyItem>

          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              // wholeLine={true}
              lg={24}
              type="textarea"
              field="description"
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
