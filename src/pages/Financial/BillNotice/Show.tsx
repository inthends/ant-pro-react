//查看通知单

import { Card, Button, Col, Drawer, Form, Row, Spin, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetEntityShow, ChargeFeeDetail } from './Main.service';
import './style.less';
import moment from 'moment';

interface ShowProps {
  visible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
}

const Show = (props: ShowProps) => {
  const { visible, closeDrawer, form, id } = props;
  const title = '查看通知单';
  const [loading, setLoading] = useState<boolean>(false);
  // const { getFieldDecorator } = form;
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [billCheckLoading, setBillCheckLoading] = useState<boolean>(false);
  const [billCheckData, setBillCheckData] = useState<any>();
  const [billCheckPagination, setBillCheckPagination] = useState<DefaultPagination>(new DefaultPagination());

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (id != null && id != '') {
        setLoading(true);
        GetEntityShow(id).then(res => {
          var info = Object.assign({}, res.entity, { customer: res.name, templateName: res.templateName });
          setInfoDetail(info);
          setLoading(false);
          initBillCheckLoadData();
        }).catch(() => {
          setLoading(false);
        });
      } else {
        form.resetFields();
        setInfoDetail({});
        setBillCheckData([]);
        setLoading(false);
      }
    }
  }, [visible]);

  // const close = () => {
  //   closeDrawer();
  // };

  const initBillCheckLoadData = (paginationConfig?: PaginationConfig, sorter?) => {
    const queryJson = {
      billId: id
    };
    const sidx = sorter == null ? 'BillDate' : sorter.field;
    const sord = sorter == null || sorter.order === 'ascend' ? 'asc' : 'desc';
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: billCheckPagination.pageSize,
      total: 0,
    };
    return billCheckload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const billCheckload = data => {
    setBillCheckLoading(true);
    data.sidx = data.sidx || 'BillDate';
    data.sord = data.sord || 'asc';
    return ChargeFeeDetail(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setBillCheckPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setBillCheckData(res.data);
      setBillCheckLoading(false);
      return res;
    });
  };

  const columns = [
    {
      title: '账单日',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '业户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 140,
      sorter: true
    },
    {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
      width: 240,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100,
      sorter: true,
    },
    {
      title: '计费金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: true,
    },
    // {
    //   title: '已收金额',
    //   dataIndex: 'receivedAmount',
    //   key: 'receivedAmount',
    //   sorter: true,
    //   width: 100
    // },
    {
      title: '冲抵金额',
      key: 'offsetAmount',
      dataIndex: 'offsetAmount',
      width: 100
    },
    {
      title: '减免金额',
      key: 'reductionAmount',
      dataIndex: 'reductionAmount',
      width: 100
    },
    {
      title: '计费起始日期',
      key: 'beginDate',
      dataIndex: 'beginDate',
      sorter: true,
      width: 120,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '计费截止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      sorter: true,
      width: 120,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      title={title}
      placement="right"
      width={780}
      onClose={closeDrawer}
      visible={visible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card>
        <Form layout="vertical" hideRequiredMark>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item required label="通知单号">
                <a>{infoDetail.billCode}</a>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="通知单日期"  >
                {String(infoDetail.beginDate).substr(0, 10)}
              </Form.Item>
            </Col>
            {/* <Col span={6}>
              <Form.Item required label="缴费日期"  >
                {String(infoDetail.mustDate).substr(0, 10)}
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item required label="类型"   >
                {infoDetail.billType}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item required label="业户名称"  >
                {infoDetail.customer}
              </Form.Item>
            </Col>
            {/* <Col span={6}>
              <Form.Item required label="打印模板" >
                {infoDetail.templateName}
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item label="审核人"  >
                {infoDetail.verifyPerson}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="审核情况"  >
                {infoDetail.verifyMemo}
              </Form.Item>
            </Col>
          </Row> 
        </Form>
      </Card>

      <Spin tip="数据处理中..." spinning={loading}>
        <Table<any>
          onChange={(paginationConfig, filters, sorter) => {
            initBillCheckLoadData(paginationConfig, sorter)
          }
          }
          bordered={false}
          size="middle"
          columns={columns}
          dataSource={billCheckData}
          rowKey="billId"
          pagination={billCheckPagination}
          scroll={{ y: 500, x: 1400 }}
          loading={billCheckLoading}
        />
      </Spin>

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
          onClick={() => closeDrawer()}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={() => {

          }}
        >
          打印
        </Button>
      </div>
    </Drawer >
  );
};

export default Form.create<ShowProps>()(Show);

