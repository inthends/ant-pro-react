
import {
  Table, Input, message, Button, Card, Col, Drawer, Form, Row
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetPageItemListJson, GetAppInfo } from './ApartmentApp.service';
import { ApproveForm, RejectForm } from '../../Workflow/FlowTask/FlowTask.service'
import { DefaultPagination } from "@/utils/defaultSetting";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import CommentBox from '../../Workflow/CommentBox';
import MemberShow from './MemberShow';
import styles from './style.less';

interface ApproveProps {
  visible: boolean;
  // flowId?: string;//流程id
  code?: string;//流程类别编号
  id?: string;//任务id
  instanceId?: string;//实例id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
  isView: boolean;//是否是查看
}

const Approve = (props: ApproveProps) => {
  const { isView, visible, closeDrawer, code, id, instanceId, form } = props;
  const title = isView ? '单据详情' : '入住审批';
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [ruleItem, setRuleItem] = useState<any>();
  const [ruleItemVisible, setRuleItemVisible] = useState<boolean>(false);

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (instanceId) {
        setLoading(true);
        GetAppInfo(instanceId).then((res) => {
          setInfoDetail(res);
          initLoadData();
          form.resetFields();
          setLoading(false);
        });

      } else {
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [visible]);

  const [itemData, setItemData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(
    new DefaultPagination()
  );

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
    const queryJson = { mainId: instanceId };
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
      queryJson: { mainId: instanceId },
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


  const doModify = record => {
    //modify({ ...record }); 
    setRuleItem(record);
    setRuleItemVisible(true);
  };

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
      width: 120
    },
    {
      title: "证件类型",
      dataIndex: "certificateType",
      key: "certificateType",
      width: 100
    },
    {
      title: "证件号码",
      dataIndex: "certificateNO",
      key: "certificateNO",
      width: 180
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
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      width: 60,
      render: (text, record) => {
        return [
          <a onClick={() => doModify(record)} key="modify">查看</a>
        ];
      }
    }
  ] as ColumnProps<any>[];

  const reject = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        RejectForm({
          code: code,
          id: id,
          instanceId: instanceId,
          verifyMemo: values.verifyMemo
        }).then(res => {
          setLoading(false);
          message.success('退回成功');
          closeDrawer();
          // reload(); 
          //刷新页面
          location.reload();

        }).catch(res => {
          message.warn(res);
        });
      }
    });
  };

  const approve = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        ApproveForm({
          code: code,
          id: id,
          instanceId: instanceId,
          verifyMemo: values.verifyMemo
        }).then(res => {
          setLoading(false);
          message.success('审批成功');
          closeDrawer();
          //刷新待办数量
          // GetTaskCounts().then(count => {
          //   localStorage.setItem('unreadCount', count);//待办数量  
          // })
          //reload(); 
          //刷新页面
          location.reload();

        }).catch(res => {
          message.warn(res);
        });
      }
    });
  };


  return (
    <Drawer
      title={title}
      placement="right"
      width={900}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      {/* <Spin tip="数据处理中..." spinning={loading}> */}
      <Form layout="vertical">
        <Card className={styles.card2} hoverable>
          <Row gutter={24}>
            <Col lg={24}>
              <Form.Item label='标题'>
                {infoDetail.title}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={24}>
              <Form.Item label='备注' >
                {infoDetail.memo}
              </Form.Item>
            </Col>
          </Row>

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

          <CommentBox instanceId={instanceId} />
          {!isView ?
            < Form.Item label="">
              {getFieldDecorator('verifyMemo', {
                rules: [{ required: true, message: '请输入审核意见' }]
              })(
                <Input.TextArea rows={4} />
              )}
            </Form.Item>
            : null}

        </Card>
      </Form>
      {/* </Spin> */}

      <MemberShow
        visible={ruleItemVisible}
        closeDrawer={() => setRuleItemVisible(false)}
        data={ruleItem}
        reload={initLoadData}
      />

      <div
        style={{
          position: 'absolute',
          zIndex: 999,
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
          关闭
          </Button>

        {!isView ?
          <>
            <Button onClick={reject} type='danger' style={{ marginRight: 8 }}>
              退回
        </Button>
            <Button onClick={approve} type="primary">
              通过
        </Button>
          </>
          : null}
      </div>

    </Drawer >
  );

};

export default Form.create<ApproveProps>()(Approve);

