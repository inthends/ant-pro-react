import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem , { SelectItem }from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React from "react";
import { SaveItemForm } from "./Main.service";

interface ModifyRepairProps {
  visible: boolean;
  deviceId: string;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const ModifyRepair = (props: ModifyRepairProps) => {
  const { data, form, deviceId } = props;
  let initData = data ? data : { deviceId: deviceId };
  const baseFormProps = { form, initData };

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    return SaveItemForm(modifyData);
  };

  const checkItems: SelectItem[] = [{ label: '不合格', value: 0 }, { label: '合格', value: 1 }];

  return (
    <BaseModifyProvider {...props} name="维修记录" save={doSave}>
      <Card  hoverable>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="billCode"
              label="维修单号"
              rules={[{ required: true, message: "请输入维保单号" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="billDate"
              label="维修日期"
              rules={[{ required: true, message: "请选择维修日期" }]}
              type='date'
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="contents"
              label="维修内容"
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="breakdown"
              label="故障判断"
            ></ModifyItem>
          </Row>

          <Row gutter={24}> 
            <ModifyItem
              {...baseFormProps}
              field="fee"
              label="维修费用"
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="gender"
              label="是否合格"
              type='radio'
              items={checkItems}
              rules={[{ required: true, message: '请选择' }]}
            ></ModifyItem>

          </Row>

          <Row gutter={24} >
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
 
          <Row gutter={24} >
            <ModifyItem
              {...baseFormProps}
              field="checkDate"
              label="验收时间"
              type="date"
              rules={[{ required: true, message: "请选择验收时间" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="checkMemo"
              label="验收情况"
              rules={[{ required: true, message: "请输入验收情况" }]}
            ></ModifyItem>
          </Row>  
        </Form>
      </Card>
    </BaseModifyProvider >
  );
};

export default Form.create<ModifyRepairProps>()(ModifyRepair);
