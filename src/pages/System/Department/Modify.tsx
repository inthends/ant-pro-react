import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import { SaveForm, searchUser, ExistEnCode, searchOrgs } from './Main.service';
import { TreeNode } from 'antd/lib/tree-select';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  const [managers, setManagers] = useState<SelectItem[]>([]);
  const [types, setTypes] = useState<SelectItem[]>([
    {
      label: '集团',
      value: 'A',
    },
    {
      label: '区域',
      value: 'B',
    },
    {
      label: '公司',
      value: 'C',
    },
    {
      label: '管理处',
      value: 'D',
    },
  ]);
  const [orgs, setOrgs] = useState<TreeNode[]>();
  let initData = data ? data : { enabledMark: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  useEffect(() => { 

  }, []);

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.organizeId };
    if (modifyData.foundedTime != null)
      modifyData.foundedTime = modifyData.foundedTime.format('YYYY-MM-DD');
    return SaveForm(modifyData);
  };

 

  const checkExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyValue = initData.organizeId == undefined ? '' : initData.organizeId;
      ExistEnCode(keyValue, value).then(res => {
        if (res)
          callback('机构编号重复');
        else
          callback();
      })
    }
  };

  return (
    <BaseModifyProvider {...props} name="部门" save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="fullName"
              label="部门名称"
              rules={[{ required: true, message: '请输入部门名称' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="部门编号"
              rules={[{ required: true, message: '请输入部门编号' },
              {
                validator: checkExist
              }
              ]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="organizeId"
              label="所属机构"
              type="tree"
              treeData={orgs}
              disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择所属机构' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="parentId"
              label="上级部门"
              type="tree"
              disabled={initData.parentId === '0'}
              items={types}
              rules={[{ required: true, message: '请选择上级部门' }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="manager"
              label="负责人"
              type="autoComplete" 
              items={managers}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="email"
              label="邮箱" 
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem {...baseFormProps} field="outerPhone" label="电话"></ModifyItem>
            <ModifyItem {...baseFormProps} field="fax" label="传真"></ModifyItem>
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
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);