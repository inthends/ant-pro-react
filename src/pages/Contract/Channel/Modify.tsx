import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { SaveForm } from "./Main.service";
import { getCommonItems } from '@/services/commonItem';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { visible, data, form } = props;
  let initData = data ? data : {};
  const baseFormProps = { form, initData };
  const [area, setArea] = useState<any[]>([]);//商圈
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    return SaveForm(modifyData);
  };

  useEffect(() => {
    if (visible) {
      getCommonItems('TradingArea').then(res => {
        setArea(res || []);
      });
    }
  }, [visible]);

  return (
    <BaseModifyProvider {...props} name="联系人" save={doSave}>
      <Card >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="姓名"
              rules={[{ required: true, message: "请输入姓名" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="telephone"
              label="电话"
              rules={[{ required: true, message: "请输入电话" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="company"
              label="公司"
            // rules={[{ required: true, message: "请输入公司" }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="tradingArea"
              label="所属城市/区域/商圈"
              type='select'
              items={area}
            // rules={[{ required: true, message: "请输入商圈" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="email"
              label="电子邮箱"
            // rules={[{ required: true, message: "请输入电子邮箱" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="addresss"
              label="通讯地址"
            // rules={[{ required: true, message: "请输入通讯地址" }]}
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};
export default Form.create<ModifyProps>()(Modify);
