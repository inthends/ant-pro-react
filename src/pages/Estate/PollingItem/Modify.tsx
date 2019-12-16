import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import { SaveForm } from "./Main.service";
import { GetOrgs, getCommonItems } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  typeId: string;
  typeName: string;
};

const Modify = (props: ModifyProps) => {
  const { data, form, visible } = props;
  const { getFieldDecorator } = form;
  let initData = data ? data : { unit: '月' };
  const baseFormProps = { form, initData };
  const [pollingType, setPollingType] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<TreeNode[]>();

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    return SaveForm(modifyData);
  };

  useEffect(() => {
    if (visible) {
      GetOrgs().then(res => {
        setOrgs(res);
      });
      getCommonItems('PollingType').then(res => {
        setPollingType(res || []);
      });

    }
  }, [visible]);

  const onTypeSelect = (value, option) => {
    form.setFieldsValue({ typeName: option.props.children });
  };

  return (
    <BaseModifyProvider {...props} name="巡检项目" save={doSave}>
      <Card >
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
              field="typeId"
              label="巡检专业"
              type='select'
              items={pollingType}
              onChange={onTypeSelect}
              rules={[{ required: true, message: '请选择巡检专业' }]}
            ></ModifyItem>
            {getFieldDecorator('typeName', {
              initialValue: initData.typeName,
            })(
              <input type='hidden' />
            )}
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="unitNum"
              lg={8}
              label="频次"
              type='inputNumber'
              rules={[{ required: true, message: "请输入频次" }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="unit"
              lg={8}
              label="频次单位"
              type='select'
              items={[
                { label: '天', title: '天', value: '天' },
                { label: '周', title: '周', value: '周' },
                { label: '月', title: '月', value: '月' },
                { label: '季', title: '季', value: '季' },
                { label: '年', title: '年', value: '年' }
              ]}
              rules={[{ required: true, message: '请选择频次单位' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="frequency"
              lg={8}
              type='inputNumber'
              label="次数"
              rules={[{ required: true, message: '请输入次数' }]}
            ></ModifyItem>

          </Row>


          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              // wholeLine={true}
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
