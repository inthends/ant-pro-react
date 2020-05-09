
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

const Verify = (props: VerifyProps) => {
  const { modalVisible, closeModal, form, id, reload, ifVerify } = props;
  const { getFieldDecorator } = form;
  const title = ifVerify ? '优惠单审核' : '优惠单取消审核';
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
          var entity = { ...res.entity, receiveId: res.receiveId, receiveCode: res.receiveCode };//收款单id 
          setInfoDetail(entity);
          form.resetFields();
          initLoadData(id);
          //分页查询
          // const { current: pageIndex, pageSize, total } = pagination;
          // const searchCondition: any = {
          //   pageIndex,
          //   pageSize,
          //   total,
          //   keyValue: entity.billId
          // };
          // setLoading(true);
          // GetListById(searchCondition).then(res => {
          //   //明细
          //   setListData(res.data);
          //   setLoading(false);
          // })
        });
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modalVisible]);

  const initLoadData = (id) => {
    const sidx = 'billId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, keyValue: id }).then(res => {
      return res;
    });
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billId';
    data.sord = data.sord || 'asc';
    return GetListById(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setListData(res.data);
      setLoading(false);
      return res;
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
      keyValue: infoDetail.billId
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

  //提交审核
  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // const newvalue = { ...values, ifVerify: ifVerify };
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.keyValue = infoDetail.billId;
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

  const columns = [
    {
      title: '房产编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: '180px',
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: '120px',
      sorter: true
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: '120px',
      sorter: true,
      render: val => val ? moment(val).format('YYYY年MM月') : ''  
    },
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
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: '100px',
    },
    {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
      width: '240px',
    },
    {
      title: '备注',
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
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>

      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card}>
          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="优惠单号">
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
            <Col lg={8}>
              <Form.Item label="优惠政策">
                {infoDetail.rebateName}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="起始日期">
                {String(infoDetail.beginDate).substr(0, 10)}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="结束日期">
                {String(infoDetail.endDate).substr(0, 10)}
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
                  rules: [{ required: ifVerify, message: '请输入审核意见' }],
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
              scroll={{ x: 1200, y: 500 }}
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

