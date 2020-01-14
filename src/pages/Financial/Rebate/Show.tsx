
import { Table, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson, GetListByID } from './Main.service';
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
  const title = '优惠单查看';
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
            pageIndex,
            pageSize,
            total,
            keyValue: entity.billId
          };
          setLoading(true);
          GetListByID(searchCondition).then(res => {
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
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billId';
    }
    setLoading(true);
    return GetListByID(searchCondition).then(res => {
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
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: '120px',
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
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY年MM月');
        }
      }
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: '120px',
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
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '120px',
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
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: '100px',
    },
    {
      title: '备注',
      width: '150px',
      dataIndex: 'memo',
      key: 'memo',
      editable: true
    },
  ] as ColumnProps<any>[];


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
        <Card className={styles.card}>
          <Row gutter={24}>
            <Col lg={6}>
              <Form.Item label="优惠单号">
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="单据日期">
                {infoDetail.billDate}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="经办人">
                {infoDetail.createUserName}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="优惠政策">
                {infoDetail.rebateName}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={6}>
              <Form.Item label="关联收款单">
                <a onClick={() => showCharge(infoDetail.receiveId)}> {infoDetail.receiveCode} </a>
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="起始日期">
                {String(infoDetail.beginDate).substr(0, 10)}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="结束日期">
                {String(infoDetail.endDate).substr(0, 10)}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="是否审核">
                {infoDetail.ifVerify ? '已审核' : '未审核'}
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
              rowKey={record => record.id}
              pagination={pagination}
              scroll={{ x: 850, y: 500 }}
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
      </div>
    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show);

