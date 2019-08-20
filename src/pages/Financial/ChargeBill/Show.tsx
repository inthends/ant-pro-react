//查看收款单
import {
  Checkbox,
  Tabs,
  Select,
  Button,Table,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,InputNumber,
  Row,
} from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {GetEntityShow ,ChargeFeeDetail,ChargeFeeDetail } from './Main.service';
import styles from './style.less';
import  moment from 'moment';

interface ShowProps {
  showVisible: boolean;
  closeShow(): void;
  form: WrappedFormUtils;
  id?:string;
}
const Show = (props:  ShowProps) => {
  const { showVisible, closeShow, id,form} = props;
  const { getFieldDecorator } = form;
  const title="查看收费单";
  const [loading, setLoading] = useState<boolean>(false);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [chargeBillData,setChargeBillData]=useState<any[]>([]);
  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (showVisible) {
      if(id){
        GetEntityShow(id).then(res=>{
          if(res!=null)
          {  setInfoDetail(res.entity);
          return res.entity.billID;
          }
          return '';
        }).then(res=>{
          if(res!='')
            initLoadFeeDetail(res);
        })
        /*setPagination(pagesetting => {
          return {
            ...pagesetting,
            current,
            total,
            pageSize,
          };
        });*/
      }else{
        setInfoDetail({  });
      }
    } else {

    }
  }, [showVisible]);


  const columns = [
    {
      title: '单元编号',
      dataIndex: 'code',
      key: 'code',
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
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 150,
      sorter: true,
      render: val => val!=null?<span> {moment(val).format('YYYY年MM月')} </span>:<span></span>
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      sorter: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      sorter: true,
    },
    {
      title: '应收金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
    }, {
      title: '本次实收金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 150,
    }, {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 150,
      render: val => val!=null?<span> {moment(val).format('YYYY-MM-DD')} </span>:<span></span>
    }, {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 150,
      render: val => val!=null?<span> {moment(val).format('YYYY-MM-DD')} </span>:<span></span>
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 200
    }
  ] as ColumnProps<any>[];

  const initLoadFeeDetail=(billid)=>{
    const queryJson = {billid:billid};
    const sidx = 'begindate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'BillID';
    data.sord = data.sord || 'asc';
    return ChargeFeeDetail(data).then(res => {
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
  const close = () => {
    closeShow();
  };
  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={showVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form hideRequiredMark>
            <Row gutter={4}>
              <Col span={8}>
                <Form.Item label="收款单号"  labelCol={{span:8}} wrapperCol={{span:16}} >
                  {getFieldDecorator('billCode', {
                    initialValue: infoDetail.billCode,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="收款日期"  labelCol={{span:8}} wrapperCol={{span:16}}>
                  {getFieldDecorator('billDate', {
                    initialValue: infoDetail.billDate==null?moment(new Date):moment(infoDetail.billDate),
                  })(
                    <DatePicker disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="发票编号" labelCol={{span:8}} wrapperCol={{span:16}}>
                  {getFieldDecorator('invoiceCdde', {
                    initialValue: infoDetail.invoiceCdde,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={4}>
              <Col span={8}>
                <Form.Item label="收款编号"  labelCol={{span:8}} wrapperCol={{span:16}} >
                  {getFieldDecorator('payCode', {
                    initialValue: infoDetail.payCode,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="冲红单号" labelCol={{span:8}} wrapperCol={{span:16}}>
                  {getFieldDecorator('linkId', {
                    initialValue: infoDetail.linkId,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="收款人" labelCol={{span:8}} wrapperCol={{span:16}}>
                  {getFieldDecorator('createUserName', {
                    initialValue: infoDetail.createUserName,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={4}>
              <Col span={8}>
              <Form.Item label="审核人"  labelCol={{span:8}} wrapperCol={{span:16}} >
                  {getFieldDecorator('verifyPerson', {
                    initialValue: infoDetail.verifyPerson,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核情况" labelCol={{span:8}} wrapperCol={{span:16}} >
                  {getFieldDecorator('verifyMemo', {
                    initialValue: infoDetail.verifyMemo,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="创建日期" labelCol={{span:8}} wrapperCol={{span:16}} >
                  {getFieldDecorator('createDate', {
                    initialValue:infoDetail.createDate==null?moment(new Date): moment(infoDetail.createDate),
                  })(
                    <DatePicker disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={4}>
              <Col span={24}>
              <Form.Item label="收款金额" labelCol={{span:2}} wrapperCol={{span:22}}>
                  {getFieldDecorator('amountDetail', {
                    initialValue:`收款金额：${infoDetail.payAmountA +infoDetail.payAmountB +infoDetail.payAmountC }元,其中${infoDetail.payTypeA} ${infoDetail.payAmountA }元，${infoDetail.payTypeB} ${infoDetail.payAmountB}元， ${infoDetail.payTypeC} ${infoDetail.payAmountC }元`,
                  })(
                    <Input disabled={true} style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={24}>
              <Table
                bordered={true}
                size="middle"
                dataSource={chargeBillData}
                columns={columns}
                rowKey={record => record.billID}
                pagination={pagination}
                scroll={{ y: 500, x: 1550 }}
              />
            </Col>
          </Row>
    </Drawer>
  );
};
export default Form.create< ShowProps>()(Show);

