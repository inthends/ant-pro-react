import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React  from "react";
import { SaveForm } from "./ApartmentApp.service"; 

interface AddProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Add = (props: AddProps) => {
  const { data, form } = props;
  let initData = data ? data : { enabledMark: 1 };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  // const [ruleItemVisible, setRuleItemVisible] = useState<boolean>(false);
  // const [ruleItem, setRuleItem] = useState<any>();
  // const [orgs, setOrgs] = useState<TreeNode[]>();

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.ruleId };
    return SaveForm(modifyData);
  };

  
  return (
    <BaseModifyProvider {...props}
      name="申请资料"
      width={700}
      save={doSave}>
      <Card  hoverable>
        <Form layout="vertical" hideRequiredMark>
         
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="编号"
              rules={[{ required: true, message: "请输入编号" }]}
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
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>  
      </Card> 
    </BaseModifyProvider>
  );
};

export default Form.create<AddProps>()(Add);
