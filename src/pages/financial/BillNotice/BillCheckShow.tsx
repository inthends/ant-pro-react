//查看通知单
//添加编辑费项
import { Card, Divider, Button, DatePicker,Col, Select, Modal, Drawer, Form, Row, Icon, Spin, Input, InputNumber, TreeSelect, message, Table, Checkbox } from 'antd';

import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {GetEntityShow,ChargeFeePageData} from './BillNotice.service';
import './style.less';
import  moment from 'moment';
import SelectHouse from './SelectHouse';
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;


interface BillCheckShowProps {
  visible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id: string;
}

const BillCheckShow = (props: BillCheckShowProps) => {
  const { visible, closeDrawer, form, id} = props;
  const title ='查看通知单' ;
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});

  const [billCheckLoading, setBillCheckLoading] = useState<boolean>(false);
  const [billCheckData, setBillCheckData] = useState<any>();
  const [billCheckPagination, setBillCheckPagination] = useState<DefaultPagination>(new DefaultPagination());

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (id!=null&&id!='') {
        setLoading(true);
        GetEntityShow(id).then(res => {
          var info=Object.assign({},res.entity,{customer:res.name,templateName:res.templateName});
          setInfoDetail(info);
          setLoading(false);
          initBillCheckLoadData();
        }).catch(()=>{
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

  const close = () => {
    closeDrawer();
  };

  const initBillCheckLoadData = (paginationConfig?: PaginationConfig, sorter?) => {
    const queryJson = {
      billid:id
    };
    const sidx = sorter==null?'BillDate':sorter.field;
    const sord =  sorter==null||sorter.order=== 'ascend' ? 'asc' : 'desc';
    const { current: pageIndex, pageSize, total } =paginationConfig || {
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
    return ChargeFeePageData(data).then(res => {
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
      width: 150,
      sorter: true,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '业务名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 150,
      sorter: true
    },
    {
      title: '房屋名称',
      dataIndex: 'allName',
      key: 'allName',
      width: 150,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 150,
      sorter: true,
    },
    {
      title: '计费金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      sorter: true,
    },
    {
      title: '已收金额',
      dataIndex: 'receivedAmount',
      key: 'receivedAmount',
      sorter: true,
      width: 150
    },
    {
      title: '冲抵金额',
      key: 'offsetAmount',
      dataIndex: 'offsetAmount',
      width: 150
    },
    {
      title: '减免金额',
      key: 'reductionAmount',
      dataIndex: 'reductionAmount',
      width: 150
    },
    {
      title: '计费起始日期',
      key: 'beginDate',
      dataIndex: 'beginDate',
      sorter: true,
      width: 200,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '计费终止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      sorter: true,
      width: 200,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={closeDrawer}
      visible={visible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card  >
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据加载中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item required label="通知单号">
                  {getFieldDecorator('billCode', {
                    initialValue: infoDetail.billCode,
                  })(
                    <Input disabled={true} placeholder="自动获取编号"/>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="通知单日期"  >
                  {getFieldDecorator('beginDate', {
                    initialValue: infoDetail.beginDate==null?moment(new Date()):moment(infoDetail.beginDate),
                    rules: [{ required: true, message: '请选择单据日期' }],
                  })(
                    <DatePicker disabled={true} />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="缴费日期"  >
                  {getFieldDecorator('mustDate', {
                    initialValue: infoDetail.mustDate==null?moment(new Date()):moment(infoDetail.beginDate),
                  })(
                    <DatePicker  disabled={true}  />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="类型"   >
                  {getFieldDecorator('billType', {
                    initialValue:infoDetail.billType,
                  })(
                    <Input  disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
              </Row>
              <Row gutter={24}>
              <Col span={6}>
                <Form.Item required label="业户名称"  >
                  {getFieldDecorator('customer', {
                    initialValue: infoDetail.customer,
                  })(
                    <Input  disabled={true}  />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item required label="打印模板"   >
                  {getFieldDecorator('templateName', {
                      initialValue: infoDetail.templateName,
                  })(
                    <Input disabled={true} />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="审核人"  >
                  {getFieldDecorator('verifyPerson', {
                    initialValue: infoDetail.verifyPerson
                  })(
                    <Input disabled={true} />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="审核情况"  >
                  {getFieldDecorator('verifyMemo', {
                    initialValue: infoDetail.verifyMemo
                  })(
                    <Input disabled={true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Table<any>
                onChange={(paginationConfig, filters, sorter) => {
                    initBillCheckLoadData(paginationConfig, sorter)
                  }
                }
                bordered={false}
                size="middle"
                columns={columns}
                dataSource={billCheckData}
                rowKey="billid"
                pagination={billCheckPagination}
                scroll={{ y: 500, x: 2100 }}
                loading={loading}
              />
            </Row>
          </Spin>
        </Form>
      </Card>
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
    </Drawer>
  );
};

export default Form.create<BillCheckShowProps>()(BillCheckShow);

