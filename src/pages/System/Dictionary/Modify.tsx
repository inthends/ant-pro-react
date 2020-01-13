import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React from "react";
import { SaveDetailForm } from "./Dictionary.service";
import styles from './style.less';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  itemId: any;
}

const Modify = (props: ModifyProps) => {
  const { itemId, data, form } = props;
  let initData = data ? data : { enabledMark: 1, itemId: itemId };
  const baseFormProps = { form, initData };
  const doSave = dataDetail => { 
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.itemDetailId };
    return SaveDetailForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="词典" save={doSave}>
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="itemName"
              label="名称"
              rules={[{ required: true, message: "请输入名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="itemValue"
              label="值"
              rules={[{ required: true, message: "请输入值" }]}
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
