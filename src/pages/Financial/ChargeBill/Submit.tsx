//送审
import { message, DatePicker, Card, Button, Col, Drawer, Form, Input, Row, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetTotalAmount, GetReceiveList, SubmitForm } from './Main.service';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import styles from './style.less';
import moment from 'moment';

interface SubmitProps {
  visible: boolean;
  close(): void;
  form: WrappedFormUtils;
  ids?: string[];
  reload(): void;
}

const Submit = (props: SubmitProps) => {
  const { visible, close, ids, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = "收款单送审";
  const [loading, setLoading] = useState<boolean>(false);
  const [chargeBillData, setChargeBillData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [amount, setAmount] = useState<any>();
  const [receiveDetail, setReceiveDetail] = useState<any>();

  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (visible) {
      if (ids != null) {
        setLoading(true);
        GetTotalAmount({ ids: JSON.stringify(ids) }).then(res => {
          setAmount(res.amount);
          setReceiveDetail(res.receiveDetail);
          initLoad();
          setLoading(false);
        })
      }
    }
  }, [visible]);

  // const close = () => {
  //   closeVerify();
  // };

  const doSubmit = () => {
    form.validateFields((errors, values) => {
      var newData = {
        ids: JSON.stringify(ids),
        receiveDetail: receiveDetail,
        amount: amount, 
        memo: values.memo
      };
      SubmitForm(newData).then(res => {
        if (!res.flag) {
          message.warning(res.message);
        }
        else {
          message.success('送审成功');
          reload();
          close();
        }

      });
    });
  };

  const initLoad = () => {
    // const queryJson = { billIds: JSON.stringify(ids) };
    const sidx = 'billCode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, billIds: JSON.stringify(ids) }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billCode';
    data.sord = data.sord || 'asc';
    return GetReceiveList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setChargeBillData(res.data);
      setLoading(false);
      return res;
    });
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
      billIds: JSON.stringify(ids) 
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billCode';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };


   //翻页
   const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
  };

  const columns = [
    {
      title: '收款单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true,
    },
    {
      title: '收款日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => moment(val).format('YYYY-MM-DD')
    },
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 150,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      sorter: true,
    },
    {
      title: '收款方式A',
      dataIndex: 'payTypeA',
      key: 'payTypeA',
      width: 100,
    },
    {
      title: '收款金额A',
      dataIndex: 'payAmountA',
      key: 'payAmountA',
      width: 100,
    },
    {
      title: '收款方式B',
      dataIndex: 'payTypeB',
      key: 'payTypeB',
      width: 100,
    },
    {
      title: '收款金额B',
      dataIndex: 'payAmountB',
      key: 'payAmountB',
      width: 100,
    },
    {
      title: '收款方式C',
      dataIndex: 'payTypeC',
      key: 'payTypeC',
      width: 100,
    },
    {
      title: '收款金额C',
      dataIndex: 'payAmountC',
      key: 'payAmountC',
      width: 100,
    },
    {
      title: '发票编号',
      dataIndex: 'invoiceCode',
      key: 'invoiceCode',
      width: 100,
    },
    {
      title: '收据编号',
      dataIndex: 'payCode',
      key: 'payCode',
      width: 100,
    },
    {
      title: '收款人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 80,
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    }
  ] as ColumnProps<any>[];


  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="总金额">
                {getFieldDecorator('amount', {
                  initialValue: amount
                })(
                  <Input readOnly />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="送审日期">
                {getFieldDecorator('createDate', {
                  initialValue: moment(new Date()),
                  rules: [{ required: true, message: '请选择单据日期' }],
                })(
                  <DatePicker style={{ width: '100%' }} disabled={true} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="送审人">
                {getFieldDecorator('createUserName', {
                  initialValue: localStorage.getItem("name"),
                })(
                  <Input readOnly />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="收款金额" style={{ color: "green" }}>
                {receiveDetail}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="送审说明" >
                {getFieldDecorator('memo', {
                })(
                  <Input.TextArea rows={5} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Table
            size="middle"
            dataSource={chargeBillData}
            columns={columns}
            rowKey={record => record.billId}
            pagination={pagination}
            scroll={{ y: 500, x: 1500 }}
            loading={loading}
            onChange={(pagination: PaginationConfig, filters, sorter) =>
              changePage(pagination, filters, sorter)
            }
          />

        </Form>
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={doSubmit} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<SubmitProps>()(Submit);

