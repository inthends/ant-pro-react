import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm } from './Organize.service';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  let initData = data ? data : { enabledMark: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date();

  const baseFormProps = { form, initData };

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.organizeId };
    return SaveForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="角色" save={doSave}>
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="fullName"
            label="机构名称"
            rules={[{ required: true, message: '请输入机构名称' }]}
          ></ModifyItem>
          <ModifyItem
            {...baseFormProps}
            field="enCode"
            label="角色编号"
            rules={[{ required: true, message: '请输入角色编号' }]}
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="parentId"
            label="隶属上级"
            rules={[{ required: true, message: '请选择隶属上级' }]}
          ></ModifyItem>{' '}
          <ModifyItem
            {...baseFormProps}
            field="manager"
            label="负责人"
          ></ModifyItem>
        </Row>

        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="parentId"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          ></ModifyItem>{' '}
          <ModifyItem
            {...baseFormProps}
            field="createDate"
            label="成立时间"
            type="date"
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="telPhone"
            label="电话"
          ></ModifyItem>{' '}
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
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
