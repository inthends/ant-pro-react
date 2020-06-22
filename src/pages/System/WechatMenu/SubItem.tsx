import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { SaveItemForm } from "./WechatMenu.service";

interface SubItemProps {
  visible: boolean;
  menuId: string;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const SubItem = (props: SubItemProps) => {
  const { data, form, menuId, visible } = props;
  const { getFieldDecorator } = form;
  let initData = data ? data : { menuId: menuId };
  const baseFormProps = { form, initData };
  const [myitemType, setMyItemType] = useState<string>(''); 
  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        setMyItemType(data.type);
      }
    }
  }, [visible]);

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    return SaveItemForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="二级菜单" save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="菜单名称"
              rules={[{ required: true, message: "请输入菜单名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="type"
              label="菜单类型"
              type='select'
              rules={[{ required: true, message: "请选择菜单类型" }]}
              items={[
                { label: '自定义链接', value: '自定义链接', title: '自定义链接' },
                { label: '系统功能', value: '系统功能', title: '系统功能' }]}
              onChange={(value, option) => {
                setMyItemType(value);
              }}
            ></ModifyItem>
          </Row> 
          {myitemType == '自定义链接' ?
            <Row gutter={24}>
              <ModifyItem
                {...baseFormProps}
                lg={24}
                field="url"
                label="自定义链接(http://www.xxx.com)"
                rules={[{ required: true, message: "请输入自定义链接" }]}
              ></ModifyItem>
            </Row> : null}
          {myitemType == '系统功能' ?
            <Row gutter={24}>
              <ModifyItem
                {...baseFormProps}
                lg={24}
                field="modulePath"
                type='select'
                label="系统功能"
                items={[
                  { label: '物业', value: 'home', title: '物业' },
                  { label: '我的', value: 'user', title: '我的' }]}
                onChange={(value, option) => {
                  form.setFieldsValue({ moduleName: option.props.children });
                }}
                rules={[{ required: true, message: "请选择系统功能" }]}
              ></ModifyItem>
              {getFieldDecorator('moduleName', {
                initialValue: initData.modulePath,
              })(
                <input type='hidden' />
              )}
            </Row> : null}
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="sortCode"
              label="排序号"
              type="inputNumber"
              rules={[{ required: true, message: "请输入排序号" }]}
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider >
  );
};

export default Form.create<SubItemProps>()(SubItem);
