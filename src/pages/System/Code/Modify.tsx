import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { message, Modal, Divider, Card, Form, Row, Table, Button, Icon } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { SaveForm, GetPageItemListJson, RemoveItemForm } from "./Code.service";
import RuleItem from './RuleItem';
import { DefaultPagination } from "@/utils/defaultSetting";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import styles from './style.less';
// import { GetOrgs } from '@/services/commonItem';
// import { TreeNode } from 'antd/lib/tree-select';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { data, form, visible } = props;
  let initData = data ? data : { enabledMark: 1 };
  const baseFormProps = { form, initData };
  const [ruleItemVisible, setRuleItemVisible] = useState<boolean>(false);
  const [ruleItem, setRuleItem] = useState<any>();
  let ruleId = data ? data.ruleId : '';
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.ruleId };
    return SaveForm(modifyData);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(
    new DefaultPagination()
  );

  // const [orgs, setOrgs] = useState<TreeNode[]>();

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        //获取明细
        initLoadData();
        // GetOrgs().then(res => {
        //   setOrgs(res);
        // });
      }
    }
  }, [visible]);


  // const loadData = (
  //   paginationConfig?: PaginationConfig,
  //   sorter?
  // ) => {
  //   const { current: pageIndex, pageSize, total } = paginationConfig || {
  //     current: 1,
  //     pageSize: pagination.pageSize,
  //     total: 0
  //   };
  //   const searchCondition: any = {
  //     pageIndex,
  //     pageSize,
  //     total,
  //     queryJson: { ruleId: ruleId }
  //   };

  //   if (sorter) {
  //     const { field, order } = sorter;
  //     searchCondition.sord = order === "ascend" ? "asc" : "desc";
  //     searchCondition.sidx = field ? field : "id";
  //   }
  //   return load(searchCondition).then(res => {
  //     return res;
  //   });
  // };


  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "id";
    formData.sord = formData.sord || "desc";
    return GetPageItemListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setItemData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = () => {
    const queryJson = { ruleId: ruleId };
    const sidx = "id";
    const sord = "desc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  // //关闭弹出的规则页面
  // const closeRuleItem = () => {
  //   setRuleItemVisible(false);
  // };

  const doModify = record => {
    //modify({ ...record });
    setRuleItem(record);
    setRuleItemVisible(true);
  };

  const doAdd = (record?) => {
    //modify({ ...record }); 
    setRuleItem(record);
    setRuleItemVisible(true);
  };

  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确定要删除吗？`,
      onOk: () => {
        RemoveItemForm(record.id)
          .then(() => {
            message.success("删除成功");
            initLoadData();
          })
          .catch(e => { });
      }
    });
  };

  // const showRuleItem = (item?) => {
  //   setRuleItem(item);
  //   setRuleItemVisible(true);
  // };

  const columns = [
    {
      title: "前缀",
      dataIndex: "itemTypeName",
      key: "itemTypeName",
      width: 80,
    },
    {
      title: "格式",
      dataIndex: "formatStr",
      key: "formatStr",
      width: 100
    },
    {
      title: "步长",
      dataIndex: "stepValue",
      key: "stepValue",
      width: 60
    },
    {
      title: "初始值",
      dataIndex: "initValue",
      key: "initValue",
      width: 100
    },
    {
      title: "说明",
      dataIndex: "description",
      key: "description",
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
    <BaseModifyProvider {...props}
      name="编码"
      width={700}
      save={doSave}>
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          {/* <Row gutter={24}> 
            <ModifyItem
              {...baseFormProps}
              field="organizeId"
              label="所属机构"
              type="tree"
              treeData={orgs}
              disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择所属机构' }]}
            ></ModifyItem> 
          </Row> */}
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="编号"
              rules={[{ required: true, message: "请输入编号" }]}
              disabled={true}
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

        <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
          <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
            onClick={() => doAdd()}  >
            <Icon type="plus" />新增</Button>
        </div>

        <Table
          style={{ border: 'none' }}
          bordered={false}
          size="middle"
          dataSource={itemData}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
          scroll={{ y: 420 }}
          loading={loading}
        /> 
      </Card>

      <RuleItem
        visible={ruleItemVisible}
        closeDrawer={() => setRuleItemVisible(false)}
        data={ruleItem}
        reload={initLoadData}
        ruleId={ruleId}
      />

    </BaseModifyProvider >

  );
};

export default Form.create<ModifyProps>()(Modify);
