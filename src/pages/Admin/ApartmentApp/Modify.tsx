// import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
// import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Input, Col, Drawer, message, Modal, Divider, Card, Form, Row, Table, Button, Icon } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { GetAppInfo, ReSubmitAppForm, SubmitAppForm, SaveAppForm, GetPageItemListJson, RemoveItemForm } from "./ApartmentApp.service";
import { GetTaskCounts } from '../../Workflow/FlowTask/FlowTask.service'
import MemberModify from './MemberModify';
import { DefaultPagination } from "@/utils/defaultSetting";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import styles from './style.less';
// import { GetOrgs } from '@/services/commonItem';
// import { TreeNode } from 'antd/lib/tree-select';
const { TextArea } = Input;
interface ModifyProps {
  isReSubmit: boolean;
  instanceId?: string;//实例id
  taskId?: string;//任务id
  visible: boolean;
  // data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { reload, taskId, instanceId, form, visible, isReSubmit, closeDrawer } = props;
  // let initData = data ? data : {};
  // const baseFormProps = { form, initData };
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [ruleItemVisible, setRuleItemVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [ruleItem, setRuleItem] = useState<any>();
  const { getFieldDecorator } = form;
  // let mainId = data ? data.id : '';
  // const doSave = dataDetail => {
  //   let modifyData = { ...initData, ...dataDetail, keyvalue: keyvalue };
  //   return SaveAppForm(modifyData);
  // };

  const [loading, setLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [keyvalue, setKeyvalue] = useState<any>();

  const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  // const [orgs, setOrgs] = useState<TreeNode[]>();

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (instanceId) {
        setLoading(true);
        GetAppInfo(instanceId).then((res) => {
          setKeyvalue(instanceId);
          setInfoDetail(res);
          //获取明细
          initLoadData();
          form.resetFields();
          setLoading(false);
        });
      }
      else {
        setKeyvalue(guid());
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
    const queryJson = { mainId: keyvalue };
    const sidx = "id";
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
      queryJson: { mainId: keyvalue },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
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
    setIsAdd(false);
    setRuleItem(record);
    setRuleItemVisible(true);
  };

  const doAdd = () => {
    //modify({ ...record });  
    form.validateFields((errors, values) => {
      if (!errors) {
        let modifyData = { ...infoDetail, ...values, keyvalue: keyvalue };
        SaveAppForm(modifyData).then(res => {
          setIsAdd(true);
          setRuleItem({ mainId: keyvalue });
          setRuleItemVisible(true);
        });
      }
    });
  };


  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        //doSave(newData);
        //newData.keyvalue = newData.id;
        SaveAppForm({ ...newData, keyvalue: keyvalue}).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
        });
      }
    });
  };

  const submit = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        //doSave(newData);
        //newData.keyvalue = newData.id;  
        SubmitAppForm({ ...newData, keyvalue: keyvalue }).then(res => {
          message.success('提交成功');
          closeDrawer();
          reload();
        }).catch(res => {
          message.warn(res);
        });;
      }
    });
  };


  const resubmit = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        //doSave(newData);
        //newData.keyvalue = newData.id;
        ReSubmitAppForm({ ...newData, keyvalue: keyvalue, taskId: taskId }).then(res => {
          message.success('提交成功');
          closeDrawer();
          //刷新待办数量
          GetTaskCounts().then(count => {
            localStorage.setItem('unreadCount', count);//待办数量  
          })
          reload();
        }).catch(res => {
          message.warn(res);
        });;
      }
    });
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
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 80,
    },
    {
      title: "手机号码",
      dataIndex: "phoneNum",
      key: "phoneNum",
      width: 100
    },
    {
      title: "证件类型",
      dataIndex: "certificateType",
      key: "certificateType",
      width: 80
    },
    {
      title: "证件号码",
      dataIndex: "certificateNO",
      key: "certificateNO",
      width: 150
    },
    {
      title: "学历",
      dataIndex: "education",
      key: "education",
      width: 60,
    },
    {
      title: "荣誉证书",
      dataIndex: "certificate",
      key: "certificate",
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
    // <BaseModifyProvider {...props}
    //   name="入住"
    //   width={850}
    //   save={doSave}>
    <Drawer
      title='我的资料'
      placement="right"
      width={850}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >

      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card} hoverable>

          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label='标题' required>
                {getFieldDecorator('title', {
                  initialValue: infoDetail.title,
                  rules: [{ required: true, message: '请输入标题' }]
                })(<Input placeholder="请输入标题" maxLength={50} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={24}>
              <Form.Item label='备注' >
                {getFieldDecorator('memo', {
                  initialValue: infoDetail.memo,
                })(<TextArea rows={4} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>


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
      </Form>

      <MemberModify
        visible={ruleItemVisible}
        closeDrawer={() => setRuleItemVisible(false)}
        data={ruleItem}
        reload={initLoadData}
        isAdd={isAdd}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 999,
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={closeDrawer}  >
          关闭
        </Button>

        {!isReSubmit ?
          <Button onClick={save} style={{ marginRight: 8 }}>
            保存
        </Button> : null}

        <Button type="primary"
          onClick={isReSubmit ? resubmit : submit}
        >
          提交
        </Button>
      </div>
    </Drawer>

  );
};

export default Form.create<ModifyProps>()(Modify);
