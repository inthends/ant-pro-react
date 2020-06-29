
import { Input, message, Table, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson, GetListById, Audit } from './Main.service';
import moment from 'moment';
const { TextArea } = Input;
import styles from './style.less'

interface VerifyProps {
  modalVisible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  id?: string;
  ifVerify: boolean;//审核/取消审核
  reload(): void;
};

const Verify= (props: VerifyProps) => {
  const { modalVisible, closeModal, form, id, reload, ifVerify } = props;
  const { getFieldDecorator } = form;
  // const title = id === undefined ? '减免单审核' : '减免单审核';
  const title = ifVerify ? '减免单审核' : '减免单取消审核'; 
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [listdata, setListData] = useState<any[]>([]);

  // const buildOption=(item:any)=>{
  //   const children = [];
  //   for ( let i = 0; i < item.length; i++) {
  //       children.push(<Option key={item[i].id}>{item[i].title}</Option>);
  //   }
  //   return children;
  // }

  // 打开抽屉时初始化
  useEffect(() => {
    if (modalVisible) {  
      if (id) {
        GetFormJson(id).then(res => {
          var entity = { ...res.entity, receiveId: res.receiveId, receiveCode: res.receiveCode }; 
          setInfoDetail(entity);
          form.resetFields();
          //分页查询
          const { current: pageIndex, pageSize, total } = pagination;
          const searchCondition: any = {
            sord: "asc",
            sidx: 'billId',
            pageIndex,
            pageSize,
            total,
            keyvalue: entity.billId
          };
          setLoading(true);
          GetListById(searchCondition).then(res => {
            //明细
            setListData(res.data);
            setLoading(false);
          })
        });
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modalVisible]);

  //提交审核
  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // const newvalue = { ...values, ifVerify: ifVerify };
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.keyvalue = infoDetail.billId;
        newData.ifVerify = ifVerify;
        Audit(newData).then(res => {
          message.success('提交成功');
          closeModal();
          reload();
        }); 
        // }).then(() => {
        //   closeDrawer();
        // });
      }
    });
  };

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
  };

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
      keyvalue: infoDetail.billId
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'billId';
    }
    setLoading(true);
    return GetListById(searchCondition).then(res => {
      //设置查询后的分页
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      //明细
      setListData(res.data);
      setLoading(false);
      return res;
    });
  };

  const columns = [
    {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
      width: '250px'
    },
    // {
    //   title: '房产编号',
    //   dataIndex: 'unitId',
    //   key: 'unitId',
    //   width: '120px',
    //   sorter: true,
    // },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: '120px',
      sorter: true
    },
    // {
    //   title: '应收期间',
    //   dataIndex: 'period',
    //   key: 'period',
    //   width: '120px',
    //   sorter: true,
    //   render: val => val ? moment(val).format('YYYY年MM月') : '' 
    // },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: '120px',
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '120px',
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '原金额',
      dataIndex: 'amount',
      key: 'amount',
      width: '100px',
      sorter: true,
    }, {
      title: '累计减免',
      dataIndex: 'sumReductionAmount',
      width: '100px',
      key: 'sumReductionAmount'
    }, {
      title: '本次减免',
      dataIndex: 'reductionAmount',
      width: '100px',
      key: 'reductionAmount'
    },
    {
      title: '减免后金额',
      dataIndex: 'lastAmount',
      width: '100px',
      key: 'lastAmount'
    }, {
      title: '备注',
      width: '150px',
      dataIndex: 'memo',
      key: 'memo'
    },
  ]; //as ColumnProps<any>[];


  return (
    <Drawer
      title={title}
      placement="right"
      width={780}
      onClose={closeModal}
      visible={modalVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >

      <Form layout="vertical" hideRequiredMark>
        <Card  className={styles.card} hoverable>
          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="减免单号">
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="单据日期">
                {infoDetail.billDate}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="经办人">
                {infoDetail.createUserName}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            {/* <Col lg={8}>
              <Form.Item label="减免费项">
                {infoDetail.reductionFeeItemName}
              </Form.Item>
            </Col> */}
            <Col lg={8}>
              <Form.Item label="折扣">
                {infoDetail.rebate}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="减免金额">
                {infoDetail.reductionAmount}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="备注">
                {infoDetail.memo}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Item label="审核意见" required>
                {getFieldDecorator('verifyMemo', {
                  initialValue: infoDetail.verifyMemo,
                  rules: [{ required: true, message: '请输入审核意见' }],
                })(<TextArea rows={4} placeholder="请输入审核意见" />)}
              </Form.Item>
            </Col>
          </Row> 
          <Row style={{ marginTop: '15px' }}>
            <Table
              bordered={false}
              size="middle"
              dataSource={listdata}
              columns={columns}
              rowKey={record => record.id}
              pagination={pagination}
              scroll={{ x: 1400, y: 500 }}
              loading={loading}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePage(pagination, filters, sorter)
              }
            />
          </Row>
        </Card>
      </Form>
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
        <Button style={{ marginRight: 8 }} onClick={() => closeModal()}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={() => onSave()}
        >
          提交
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<VerifyProps>()(Verify);

