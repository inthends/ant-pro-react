import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React from "react";
import { SaveForm } from "./FlowTask.service";


interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  let initData = data ? data : { enabledMark: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date(); 
  const baseFormProps = { form, initData }; 
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.roleId };
    return SaveForm(modifyData);
  };

  return (
    <BaseModifyProvider {...props} name="流程" save={doSave}>
      <Card >
        <Form layout="vertical" hideRequiredMark>
          
          


          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              // wholeLine={true}
              lg={24}
              type="textarea"
              field="description"
              label="审核内容"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
