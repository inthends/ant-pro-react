import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import { SaveForm, searchUser, ExistEnCode, ExistName, GetDepartmentTree } from './Main.service';
import { GetOrgs } from '@/services/commonItem';


import { TreeNode } from 'antd/lib/tree-select';
import styles from './style.less';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  const { getFieldDecorator } = form;
  const [managers, setManagers] = useState<SelectItem[]>([]);
  // const [types, setTypes] = useState<SelectItem[]>([
  //   {
  //     label: '集团',
  //     value: 'A',
  //   },
  //   {
  //     label: '区域',
  //     value: 'B',
  //   },
  //   {
  //     label: '公司',
  //     value: 'C',
  //   },
  //   {
  //     label: '管理处',
  //     value: 'D',
  //   },
  // ]);
  const [orgs, setOrgs] = useState<TreeNode[]>();
  const [depts, setDepts] = useState<TreeNode[]>();
  let initData = data ? data : { enabledMark: 1 };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };

  const getOrgs = () => {
    GetOrgs().then(res => {
      setOrgs(res);
    });
  };

  useEffect(() => {
    getOrgs();
  }, []);

  const searchManager = value => {
    searchUser(value).then(res => {
      const users = res.map(item => {
        return {
          label: item.name,
          value: item.name,
          key: item.id,
        };
      });
      setManagers(users);
    });
  };

  //数据保存
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.departmentId };
    if (modifyData.foundedTime != null)
      modifyData.foundedTime = modifyData.foundedTime.format('YYYY-MM-DD');
    if (modifyData.parentId === undefined)
      modifyData.parentId = 0;
    return SaveForm(modifyData);
  };

  const checkCodeExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyValue = initData.departmentId == undefined ? '' : initData.departmentId;
      ExistEnCode(keyValue, value).then(res => {
        if (res)
          callback('部门编号重复');
        else
          callback();
      })
    }
  };

  const checkNameExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyValue = initData.departmentId == undefined ? '' : initData.departmentId;
      ExistName(keyValue, value).then(res => {
        if (res)
          callback('部门名称重复');
        else
          callback();
      })
    }
  };

  const getDepts = (value) => {
    GetDepartmentTree(value).then(res => {
      setDepts(res || []);
    });
  };

  //设置负责人
  const onSelect = (value, option) => { 
    form.setFieldsValue({ chargeLeaderId: option.key });
  };

  return (
    <BaseModifyProvider {...props} name="部门" save={doSave}>
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="organizeId"
              label="所属机构"
              type="tree"
              treeData={orgs}
              disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择所属机构' }]}
              onChange={getDepts}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="parentId"
              label="上级部门"
              type="tree"
              disabled={initData.parentId === '0'}
              treeData={depts}
            //  rules={[{ required: true, message: '请选择上级部门' }]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="fullName"
              label="部门名称"
              rules={[{ required: true, message: '请输入部门名称' },
              {
                validator: checkNameExist
              }
              ]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="部门编号"
              rules={[{ required: true, message: '请输入部门编号' },
              {
                validator: checkCodeExist
              }
              ]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="chargeLeader"
              label="负责人"
              onSearch={searchManager}
              type="autoComplete"
              items={managers}
              onSelect={onSelect}
            ></ModifyItem>

            {getFieldDecorator('chargeLeaderId', {
              initialValue: initData.chargeLeaderId,
            })(
              <input type='hidden' />
            )}

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