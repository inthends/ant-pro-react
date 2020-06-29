import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState } from "react";
import { SaveForm } from "./WechatMenu.service";
// import RuleItem from './RuleItem';
// import { GetOrgs } from '@/services/commonItem';
// import { TreeNode } from 'antd/lib/tree-select';

interface AddProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Add = (props: AddProps) => {
  const { data, form } = props;
  const { getFieldDecorator } = form;
  let initData = data ? data : {};
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  // const [ruleItemVisible, setRuleItemVisible] = useState<boolean>(false);
  // const [ruleItem, setRuleItem] = useState<any>();
  // const [orgs, setOrgs] = useState<TreeNode[]>();

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    return SaveForm(modifyData);
  };

  const [myitemType, setMyItemType] = useState<string>('');

  return (
    <BaseModifyProvider {...props}
      name="菜单"
      width={700}
      save={doSave}>
      <Card hoverable>
        <Form layout="vertical" hideRequiredMark> 
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="菜单名称"
              rules={[{ required: true, message: "请输入菜单名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="type"
              label="菜单类型"
              type='select'
              rules={[{ required: true, message: "请选择菜单类型" }]}
              items={[
                { label: '无', value: '无', title: '无' },
                { label: '自定义链接', value: '自定义链接', title: '自定义链接' },
                { label: '系统功能', value: '系统功能', title: '系统功能' }]}
              onChange={(value, option) => {
                setMyItemType(value);
              }}
            ></ModifyItem>
          </Row>

          {myitemType == '自定义链接' ?
            <Row gutter={24}>
              <ModifyItem
                {...baseFormProps}
                lg={24}
                field="url"
                label="自定义链接"
                rules={[{ required: true, message: "请输入自定义链接" }]}
              ></ModifyItem>
            </Row> : null}
          {myitemType == '系统功能' ?
            <Row gutter={24}>
              <ModifyItem
                {...baseFormProps}
                lg={24}
                field="modulePath"
                type='select'
                label="系统功能"
                items={[
                  { label: '物业', value: 'home', title: '物业' },
                  { label: '我的', value: 'user', title: '我的' }]}
                onChange={(value, option) => {
                  form.setFieldsValue({ moduleName: option.props.children });
                }}
                rules={[{ required: true, message: "请选择系统功能" }]}
              ></ModifyItem>
              {getFieldDecorator('moduleName', {
                initialValue: initData.modulePath,
              })(
                <input type='hidden' />
              )}
            </Row> : null}
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="sortCode"
              label="排序号"
              type="inputNumber"
              rules={[{ required: true, message: "请输入排序号" }]}
            ></ModifyItem>
          </Row>
        </Form>

        {/* <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
          <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
            onClick={() => doAdd()}  >
            <Icon type="plus" />新增</Button>
        </div>
        <Table
          key='list'
          style={{ border: 'none' }}
          bordered={false}
          size="middle"
          dataSource={ruleList}
          columns={columns}
        // rowKey={record => record.allName}
        // pagination={orgPagination}
        // scroll={{ y: 420 }}
        // onChange={(pagination: PaginationConfig, filters, sorter) =>
        //   orgLoadData(pagination, sorter)
        // }
        // loading={orgLoading}
        /> */}
      </Card>

      {/* <RuleItem
        visible={ruleItemVisible}
        closeDrawer={closeRuleItem}
        data={ruleItem}
        reload={reload}
      /> */}

    </BaseModifyProvider >

  );
};

export default Form.create<AddProps>()(Add);
