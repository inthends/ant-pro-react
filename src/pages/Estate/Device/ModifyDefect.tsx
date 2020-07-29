//设备缺陷
import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem  from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React from "react";
import { SaveDefectForm } from "./Main.service";

interface ModifyDefectProps {
  visible: boolean;
  deviceId: string;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const ModifyDefect = (props: ModifyDefectProps) => {
  const { data, form, deviceId } = props;
  let initData = data ? data : { deviceId: deviceId };
  const baseFormProps = { form, initData };

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    modifyData.createDate = modifyData.createDate.format('YYYY-MM-DD');
    return SaveDefectForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="设备缺陷" save={doSave}>
      <Card  hoverable>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="billCode"
              label="缺陷单号"
              rules={[{ required: true, message: "请输入维保单号" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="createDate"
              label="登记日期"
              rules={[{ required: true, message: "请选择维修日期" }]}
              type='date'
            ></ModifyItem>
          </Row> 

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps} 
              lg={24}
              type="textarea"
              field="memo"
              label="缺陷内容"
            ></ModifyItem>
          </Row>

        </Form>
      </Card>
    </BaseModifyProvider >
  );
};

export default Form.create<ModifyDefectProps>()(ModifyDefect);
