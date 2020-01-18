import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React from 'react';
import { SaveForm, ExistEnCode } from "./Main.service";
import styles from './style.less';
// import { TreeNode } from 'antd/lib/tree-select';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  types?: any[];
}

const Modify = (props: ModifyProps) => {
  const { data, form, types } = props;
  let initData = data ? data : { enabledMark: 1 };
  const baseFormProps = { form, initData };
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    return SaveForm(modifyData);
  };

  const checkExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyValue = initData.id == undefined ? '' : initData.id;
      ExistEnCode(keyValue, value).then(res => {
        if (res)
          callback('机构编号重复');
        else
          callback();
      })
    }
  };

  return (
    <BaseModifyProvider {...props} name="分类" save={doSave}>
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24} hidden={initData.parentId == 0 ? true : false} >
            <ModifyItem
              {...baseFormProps}
              field="parentId"
              label="隶属上级"
              treeData={types}
              dropdownStyle={{ maxHeight: 400 }}
              type="tree"
            // rules={[{ required: true, message: '请选择隶属上级' }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="编号"
              rules={[{ required: true, message: '请输入编号' },
              { validator: checkExist }
              ]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="fullName"
              label="名称"
              rules={[{ required: true, message: "请输入名称" }]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              // wholeLine={true}
              lg={24}
              type="textarea"
              field="description"
              label="描述"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider >
  );
};
export default Form.create<ModifyProps>()(Modify);
