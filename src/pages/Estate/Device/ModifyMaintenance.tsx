import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React  from "react";
import { SaveItemForm } from "./Main.service";

interface ModifyMaintenanceProps {
  visible: boolean;
  deviceId: string;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const ModifyMaintenance = (props: ModifyMaintenanceProps) => {
  const { data, form, deviceId } = props;
  let initData = data ? data : { deviceId: deviceId };
  const baseFormProps = { form, initData };

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    return SaveItemForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="维保记录" save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}> 

            <ModifyItem
              {...baseFormProps}
              field="billCode"
              label="维保单号"
              rules={[{ required: true, message: "请输入维保单号" }]}
            ></ModifyItem>
              <ModifyItem
              {...baseFormProps}
              field="planDate"
              label="计划时间"
              rules={[{ required: true, message: "请选择计划时间" }]}
              type='date'
            ></ModifyItem>
          </Row> 

          < Row gutter={24} >
            <ModifyItem
              {...baseFormProps}
              field="finishDate"
              label="完成时间"
              type="date"
              rules={[{ required: true, message: "请选择完成时间" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="finishUserName"
              label="完成人"
              rules={[{ required: true, message: "请输入完成人" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps} 
              lg={24}
              type="textarea"
              field="memo"
              label="维保内容"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider >
  );
};

export default Form.create<ModifyMaintenanceProps>()(ModifyMaintenance);
