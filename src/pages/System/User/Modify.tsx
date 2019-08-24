import { Form, Input, Select, Tree, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState, useContext } from 'react';
import { BaseModify, BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  const { saveSuccess } = useContext(BaseModify);
  const initData = data ? data : { accountType: 2 };

  const doSave = dataDetail => {
    console.log(dataDetail);
    // SaveForm({ ...initData,...dataDetail }).then(res => {
    //   saveSuccess();
    // });
  };
  const baseFormProps = { form, initData };
  const accountTypes: SelectItem[] = [
    { label: '系统初始账户', value: 1 },
    { label: '员工账户', value: 2 },
    { label: '客户账户', value: 3 },
    { label: '供应商账户', value: 4 },
    { label: '其他', value: 5 },
  ];

  const expModes: SelectItem[] = [{ label: '永久有效', value: 1 }, { label: '临时', value: 2 }];
  return (
    <BaseModifyProvider {...props} name="用户" save={doSave} initData={initData}>
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={24}>
          <ModifyItem {...baseFormProps} field="organizeId" label="所属机构"></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="account"
            label="账户"
            rules={[{ required: true, message: '请输入账户' }]}
          ></ModifyItem>
          <ModifyItem
            {...baseFormProps}
            field="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            type="radio"
            field="expMode"
            label="有效期"
            items={expModes}
          ></ModifyItem>
          {form.getFieldValue('expMode') === 2 ? (
            <ModifyItem {...baseFormProps} field="expDate" label="有效期限"></ModifyItem>
          ) : null}
        </Row>

        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            wholeLine={true}
            type="textarea"
            field="description"
            label="备注"
            items={accountTypes}
          ></ModifyItem>
        </Row>
      </Form>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
