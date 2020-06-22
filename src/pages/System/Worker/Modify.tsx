import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import { ExistCode, GetDepartmentTreeByOrgId, SaveForm } from './Worker.service';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './style.less';
import { GetOrgs } from '@/services/commonItem';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { data, form, visible } = props;
  const [orgs, setOrgs] = useState<TreeNode[]>();
  const [depts, setDepts] = useState<TreeNode[]>();
  let initData = data ? data : { state: 1, gender: 1 };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };

  // const getOrgs = () => {
  //   GetOrgs().then(res => {
  //     setOrgs(res);
  //   });
  // };

  useEffect(() => {
    GetOrgs().then(res => {
      setOrgs(res);
    });
  }, []);

  useEffect(() => {
    if (initData.organizeId)
      getDepts(initData.organizeId)
  }, [visible]);

  //数据保存
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    return SaveForm(modifyData);
  };

  const getDepts = (value) => {
    GetDepartmentTreeByOrgId(value).then(res => {
      setDepts(res || []);
    });
  };

  const genderItems: SelectItem[] = [{ label: '男', value: 1 }, { label: '女', value: 0 }];

  const checkCodeExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyvalue = initData.id == undefined ? '' : initData.id;
      ExistCode(keyvalue, value).then(res => {
        if (res)
          callback('工号重复');
        else
          callback();
      })
    }
  };

  return (
    <BaseModifyProvider {...props} name="员工" save={doSave} >
      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card}>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="名称"
              rules={[{ required: true, message: '请输入名称' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="code"
              label="工号"
              // rules={[{ required: true, message: '请输入工号' }]} 
              rules={[{ required: true, message: '请输入工号' }, { validator: checkCodeExist }]} 
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="organizeId"
              label="所属机构"
              type="tree"
              treeData={orgs}
              // disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择所属机构' }]}
              onChange={getDepts}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="departmentId"
              label="部门"
              type="tree"
              // disabled={initData.parentId === '0'}
              treeData={depts}
            //  rules={[{ required: true, message: '请选择上级部门' }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="gender"
              label="性别"
              type='radio'
              items={genderItems}
              rules={[{ required: true, message: '请选择性别' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="phoneNum"
              label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' }]}
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
        </Card>
      </Form>

    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);