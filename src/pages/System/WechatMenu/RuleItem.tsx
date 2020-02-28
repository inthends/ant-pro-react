import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { SaveItemForm } from "./WechatMenu.service";

interface RuleItemProps {
  visible: boolean;
  ruleId: string;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const RuleItem = (props: RuleItemProps) => {
  const { data, form, ruleId, visible } = props;
  let initData = data ? data : { itemType: '0', RuleId: ruleId };
  const baseFormProps = { form, initData };
  const [myitemType, setMyItemType] = useState<string>('0');


  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        setMyItemType(data.itemType);
      }
    }
  }, [visible]);

  const [itemTypeName, setItemTypeName] = useState<string>('自定义');
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    modifyData.itemTypeName = itemTypeName;
    return SaveItemForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="规则" save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="itemType"
              label="类型"
              rules={[{ required: true, message: "请选择类型" }]}
              type='select'
              items={[
                { label: '自定义', value: '0', title: '自定义' },
                { label: '日期', value: '1', title: '日期' },
                { label: '流水号', value: '2', title: '流水号' }]}
              onChange={(value, option) => {
                setMyItemType(value);
                setItemTypeName(option.props.children);
                initData.formatStr = '';
              }}
            ></ModifyItem>

            {myitemType == '0' ?
              <ModifyItem
                {...baseFormProps}
                field="formatStr"
                label="格式"
                rules={[{ required: true, message: "请输入格式" }]}
              ></ModifyItem> :
              <ModifyItem
                {...baseFormProps}
                field="formatStr"
                label="格式"
                rules={[{ required: true, message: "请选择格式" }]}
                type='select'
                items={myitemType == '1' ?
                  [{ label: 'yyyyMMdd', value: 'yyyyMMdd', title: 'yyyyMMdd' }, { label: 'yyMdd', value: 'yyMdd', title: 'yyMdd' }, { label: 'yyyyMdd', value: 'yyyyMdd', title: 'yyyyMdd' }, { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd', title: 'yyyy-MM-dd' }, { label: 'yyMMdd', value: 'yyMMdd', title: 'label' }] :
                  [{ label: '000', value: '000', title: '000' }, { label: '0000', value: '0000', title: '0000' }, { label: '00000', value: '00000', title: '00000' }, { label: '000000', value: '000000', title: '000000' }]
                }
              ></ModifyItem>}
          </Row>

          {myitemType == '2' ?
            < Row gutter={24} >
              <ModifyItem
                {...baseFormProps}
                field="stepValue"
                label="步长"
                type="inputNumber"
                rules={[{ required: true, message: "请输入步长" }]}
              ></ModifyItem>
              <ModifyItem
                {...baseFormProps}
                field="initValue"
                label="初始"
                rules={[{ required: true, message: "请输入初始" }]}
              ></ModifyItem>
            </Row> : null}

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
