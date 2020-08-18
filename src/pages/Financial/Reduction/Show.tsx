
import {notification, Table, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson, GetListById } from './Main.service';
import { PrintByOrganizeId } from '../../System/Template/Main.service';
import moment from 'moment';
// const { TextArea } = Input;
import styles from './style.less';

interface ShowProps {
  modalVisible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  id?: string;
  showCharge(id): void;
};

const Show = (props: ShowProps) => {
  const { modalVisible, closeModal, form, id, showCharge } = props;
  // const { getFieldDecorator } = form;
  // const title = id === undefined ? '减免单审核' : '减免单审核';
  const title = '减免单查看';
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


     //打印
     const print = () => {
      setLoading(true);
      PrintByOrganizeId(id, '减免单', infoDetail.organizeId).then(res => {
        //window.location.href = res;
        window.open(res);
        //setLoading(false);
      }).catch(e => {
        //message.warn(e);
        notification.warning({
          message: '系统提示',
          description: e
        });
  
      }).finally(() => {
        setLoading(false);
      });
    }

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
      width: 280,
      fixed: 'left',
    },

    // {
    //   title: '房产编号',
    //   dataIndex: 'unitId',
    //   key: 'unitId',
    //   width: '140px',
    //   sorter: true,
    // },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: '160px',
      sorter: true
    },
    // {
    //   title: '应收期间',
    //   dataIndex: 'period',
    //   key: 'period',
    //   width: '100px',
    //   sorter: true,
    //   render: val => {
    //     return moment(val).format('YYYY年MM月')
    //   }
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
      key: 'lastAmount',
      width: '100px'
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    },
  ] as ColumnProps<any>[];


  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={closeModal}
      visible={modalVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >

      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card} hoverable>
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
            <Col lg={8}>
              <Form.Item label="关联收款单">
                <a onClick={() => showCharge(infoDetail.receiveId)}> {infoDetail.receiveCode} </a>
              </Form.Item>
            </Col>
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
              <Form.Item label="审核意见">
                {infoDetail.verifyMemo}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Table
              bordered={false}
              size="middle"
              dataSource={listdata}
              columns={columns}
              // rowKey={record => record.id}
              rowKey="billId"
              pagination={pagination}
              scroll={{ y: 500, x: 1400 }}
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
          关闭
        </Button>
         {/* 直接获取模板，不弹出选择，减少操作 */}
         <Button onClick={print} type="primary">
          打印
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show);

