import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Modal, message, Divider, Icon, Button, Table, Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { ColumnProps } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { SaveForm } from "./Code.service";

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form, visible } = props;
  let initData = data ? data : { enabledMark: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.roleId };
    return SaveForm(modifyData);
  };

  const [ruleList, setRuleList] = useState<any[]>([]);
  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        //获取明细
        setRuleList(JSON.parse(data.ruleFormatJson));
      }
    }
  }, [visible]);

  const doModify = record => {
    //modify({ ...record });
  };

  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确定要移除吗？`,
      onOk: () => {
        // RemoveForm(record.ruleId)
        //   .then(() => {
        //     message.success("删除成功");
        //   })
        //   .catch(e => { });
      }
    });
  };

  const addRuleItem = () => {  


  };

  const columns = [
    {
      title: "前缀",
      dataIndex: "ItemTypeName",
      key: "ItemTypeName",
      width: 100,
    },
    {
      title: "格式",
      dataIndex: "FormatStr",
      key: "FormatStr",
      width: 100
    },
    {
      title: "步长",
      dataIndex: "StepValue",
      key: "StepValue",
      width: 80
    },
    {
      title: "初始值",
      dataIndex: "InitValue",
      key: "InitValue",
      width: 100
    },
    {
      title: "说明",
      dataIndex: "Description",
      key: "Description",
      width: 100,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      width: 85,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => doModify(record)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => doDelete(record)} key="delete">删除</a>
          </span>
        ];
      }
    }
  ] as ColumnProps<any>[];

  return (
    <BaseModifyProvider {...props} name="编号" save={doSave}>
      <Card>
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
              wholeLine={true}
              type="textarea"
              field="description"
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>

        <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
          <Button type="link" style={{ float: 'right', marginLeft: '10px' }} onClick={addRuleItem}  >
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
        /> 
      </Card>
    </BaseModifyProvider >

    

  );
};

export default Form.create<ModifyProps>()(Modify);
