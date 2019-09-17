import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import {  Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form"; 
import React  from "react";
import { SaveForm } from "./Code.service";

interface RuleItemProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}
const RuleItem = (props: RuleItemProps) => {
  const { data, form } = props;
  let initData = data ? data : {  };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData }; 
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.roleId };
    return SaveForm(modifyData);
  }; 
  
  return (
    <BaseModifyProvider {...props} name="编号" save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="编号"
              rules={[{ required: true, message: "请输入编号" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="fullName"
              label="名称"
              rules={[{ required: true, message: "请输入名称" }]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              wholeLine={true}
              type="textarea"
              field="description"
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider >
  );
};

export default Form.create<RuleItemProps>()(RuleItem);
