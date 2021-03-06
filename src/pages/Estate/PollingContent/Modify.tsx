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
  const [pollingType, setPollingType] = useState<any[]>([]);
  // const [orgs, setOrgs] = useState<TreeNode[]>();

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    return SaveContentForm(modifyData);
  };

  useEffect(() => {
    // GetOrgs().then(res => {
    //   setOrgs(res);
    // });

    GetCommonItemsNew('PollingType').then(res => {
      setPollingType(res || []);
    });
  }, []);

  const onTypeSelect = (value, option) => {
    form.setFieldsValue({ typeName: option.props.children });
  };

  return (
    <BaseModifyProvider {...props} name="巡检内容" save={doSave}>
      <Card  hoverable>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="名称"
              rules={[{ required: true, message: "请输入名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="code"
              label="编号"
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
              label="巡检类型"
              type='select'
              items={pollingType}
              onChange={onTypeSelect}
              rules={[{ required: true, message: '请选择巡检类型' }]}
            ></ModifyItem>
            {getFieldDecorator('typeName', {
              initialValue: initData.typeName,
            })(
              <input type='hidden' />
            )}
            <ModifyItem
              {...baseFormProps}
              field="checkWay"
              label="检查方法"
              rules={[{ required: true, message: '请输入检查方法' }]}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="criterion"
              label="标准要求"
              lg={24}
              rules={[{ required: true, message: "请输入标准要求" }]}
            ></ModifyItem>

          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              lg={24}
              type="textarea"
              field="memo"
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
