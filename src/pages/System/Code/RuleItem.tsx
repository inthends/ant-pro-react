import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React from "react";
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
  let initData = data ? data : {};
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.roleId };
    return SaveForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="规则" save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="ItemTypeName"
              label="前缀"
              rules={[{ required: true, message: "请选择前缀" }]}
              type='select'
              items={[{ label: '日期', value: 1 }, { label: '流水号', value: 2 }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="FormatStr"
              label="格式"
              rules={[{ required: true, message: "请选择格式" }]}
              type='select' 
              items={form.getFieldValue('ItemTypeName') == 1 ?
                [{ label: 'yyyyMMdd', value: 'yyyyMMdd' }, { label: 'yyMdd', value: 'yyMdd' }, { label: 'yyyyMdd', value: 'yyyyMdd' }, { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' }, { label: 'yyMMdd', value: 'yyMMdd' }] :
                [{ label: '000', value: '000' },{ label: '0000', value: '0000' },{ label: '00000', value: '00000' },{ label: '000000', value: '000000' }]
              } 
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="StepValue"
              label="步长" 
              rules={[{ required: true, message: "请输入步长" }]} 
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="InitValue"
              label="初始"
              rules={[{ required: true, message: "请输入初始" }]}
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
    </BaseModifyProvider >
  );
};

export default Form.create<RuleItemProps>()(RuleItem);
