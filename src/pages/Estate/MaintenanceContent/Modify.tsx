import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import { SaveContentForm, GetCommonItemsNew } from "./Main.service";
// import { GetOrgs } from '@/services/commonItem';
// import { TreeNode } from 'antd/lib/tree-select';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  // typeId: string;
  // typeName: string;
};

const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  const { getFieldDecorator } = form;
  let initData = data ? data : {};
  const baseFormProps = { form, initData };
  const [maintenanceType, setMaintenanceType] = useState<any[]>([]);
  // const [orgs, setOrgs] = useState<TreeNode[]>();

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    return SaveContentForm(modifyData);
  };

  useEffect(() => {
    // GetOrgs().then(res => {
    //   setOrgs(res);
    // });

    GetCommonItemsNew('MaintenanceType').then(res => {
      setMaintenanceType(res || []);
    });
  }, []);

  const onTypeSelect = (value, option) => {
    form.setFieldsValue({ typeName: option.props.children });
  };

  return (
    <BaseModifyProvider {...props} name="维保内容" save={doSave}>
      <Card >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="名称"
              maxLength={50}
              rules={[{ required: true, message: "请输入名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="code"
              label="编号"
              maxLength={50}
              rules={[{ required: true, message: "请输入编号" }]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            {/* <ModifyItem
              {...baseFormProps}
              field="organizeId"
              label="所属机构"
              type="tree"
              treeData={orgs}
              disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择所属机构' }]}
            ></ModifyItem> */}
            <ModifyItem
              {...baseFormProps}
              field="typeId"
              label="维保类型"
              type='select'
              items={maintenanceType}
              onChange={onTypeSelect}
              rules={[{ required: true, message: '请选择维保类型' }]}
            ></ModifyItem>
            {getFieldDecorator('typeName', {
              initialValue: initData.typeName,
            })(
              <input type='hidden' />
            )}
            <ModifyItem
              {...baseFormProps}
              field="standard"
              label="作业标准"
              maxLength={50}
              rules={[{ required: true, message: '请输入作业标准' }]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="essentials"
              label="作业要点"
              maxLength={200}
              type="textarea"
              lg={24}
              rows={3}
              rules={[{ required: true, message: "请输入作业要点" }]}
            ></ModifyItem>

          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              lg={24} 
              type="textarea"
              field="memo"
              maxLength={500}
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
