import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { SaveForm } from "./Main.service";
import { GetOrgs } from '@/services/commonItem';
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
  let initData = data ? data : { enabledMark: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date();

  const baseFormProps = { form, initData };
  const [orgs, setOrgs] = useState<TreeNode[]>();
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.roleId };
    return SaveForm(modifyData);
  };

  const getOrgs = () => {
    GetOrgs().then(res => {
      setOrgs(res);
    });
  };

  useEffect(() => {
    getOrgs();
  }, []);

  return (
    <BaseModifyProvider {...props} name="仓库" save={doSave}>
      <Card>
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
            ></ModifyItem> 
          </Row> 
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="code"
              label="仓库编号"
              rules={[{ required: true, message: "请输入仓库编号" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="仓库名称"
              rules={[{ required: true, message: "请输入仓库名称" }]}
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
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
