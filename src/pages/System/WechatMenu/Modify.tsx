import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { message, Modal, Divider, Card, Form, Row, Table, Button, Icon } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { SaveForm, GetPageItemListJson, RemoveItemForm } from "./WechatMenu.service";
import SubItem from './SubItem';
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
  const { getFieldDecorator } = form;
  let initData = data ? data : {}; 
  const baseFormProps = { form, initData };
  const [ruleItemVisible, setRuleItemVisible] = useState<boolean>(false);
  const [ruleItem, setRuleItem] = useState<any>();
  let menuId = data ? data.id : '';
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
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
        setMyItemType(data.type);
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
    formData.sidx = formData.sidx || "sortCode";
    formData.sord = formData.sord || "asc";
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
    const queryJson = { menuId: menuId };
    const sidx = "sortCode";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

   //刷新
   const loadData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { menuId: menuId },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'sortCode';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
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
      title: "菜单名称",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "菜单类型",
      dataIndex: "type",
      key: "type",
      width: 100
    },
    {
      title: "系统功能",
      dataIndex: "moduleName",
      key: "moduleName",
      width: 100
    },
    {
      title: "排序号",
      dataIndex: "sortCode",
      key: "sortCode",
      width: 80
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

  const [myitemType, setMyItemType] = useState<string>('');

  return (
    <BaseModifyProvider {...props}
      name="菜单"
      width={700}
      save={doSave}>
      <Card className={styles.card} hoverable>
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
          onChange={(pagination: PaginationConfig, filters, sorter) =>
            changePage(pagination, filters, sorter)
          }
        /> 
      </Card>

      <SubItem
        visible={ruleItemVisible}
        closeDrawer={() => setRuleItemVisible(false)}
        data={ruleItem}
        reload={initLoadData}
        menuId={menuId}
      />

    </BaseModifyProvider >

  );
};

export default Form.create<ModifyProps>()(Modify);
