//查看冲抵单
import { Spin, Card, Button, Col, Drawer, Form, Row, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetFormJson, GetListByID } from './Lastschrift.service';
import styles from './style.less';
import moment from 'moment';

interface ShowProps {
  showVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  // organizeId?: string;
  // reload(): void;
}

const Show = (props: ShowProps) => {
  const { showVisible, closeDrawer, id, form } = props;
  // const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const title = '查看冲抵单';
  const [loading, setLoading] = useState<boolean>(false);
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [noticeData, setNoticeData] = useState<any>([]);
  const [listdata, setListData] = useState<any>(); //useState<any[]>([]); 
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());

  useEffect(() => {
    if (showVisible) {
      if (id != null && id != '') {
        // setLoading(true);
        GetFormJson(id).then(res => {
          setInfoDetail(res);
          form.resetFields();
          // loadNoticeData('', res.organizeId);
          // setLoading(false);

          //分页查询
          // const { current: pageIndex, pageSize, total } = pagination;
          // const searchCondition: any = {
          //   pageIndex,
          //   pageSize,
          //   total,
          //   keyValue: res.billId
          // };  
          // setLoading(true);
          // GetListByID(searchCondition).then(res => {
          //   //明细
          //   setListData(res.data);
          //   setLoading(false);
          // })

          initLoad(res.billId);

        });
      } else {
        setInfoDetail({});
      }
    }
    // else {
    //   form.setFieldsValue({});
    // }

  }, [showVisible]);


  const initLoad = (keyValue) => {
    // const queryJson = { keyValue: billId };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, keyValue }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetListByID(data).then(res => {
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
      keyValue: id,
      //queryJson: { ruleId: ruleId },
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

  // const loadData = (paginationConfig?: PaginationConfig, sorter?) => {
  //   const { current: pageIndex, pageSize, total } = paginationConfig || {
  //     current: 1,
  //     pageSize: pagination.pageSize,
  //     total: 0,
  //   };
  //   let searchCondition: any = {
  //     pageIndex,
  //     pageSize,
  //     total,
  //     keyValue: infoDetail.billId
  //   };

  //   if (sorter) {
  //     let { field, order } = sorter;
  //     searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
  //     searchCondition.sidx = field ? field : 'billId';
  //   }
  //   setLoading(true);
  //   return GetListByID(searchCondition).then(res => {
  //     //设置查询后的分页
  //     const { pageIndex: current, total, pageSize } = res;
  //     setPagination(pagesetting => {
  //       return {
  //         ...pagesetting,
  //         current,
  //         total,
  //         pageSize,
  //       };
  //     });
  //     //明细
  //     setListData(res.data);
  //     setLoading(false);
  //     return res;
  //   });
  // };

  // const close = () => {
  //   closeDrawer();
  // };

  // const guid=()=> {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //       var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
  //       return v.toString(16);
  //   });
  // }

  //明细表数据
  // const loadNoticeData = (search, organizeId, paginationConfig?: PaginationConfig, sorter?) => {
  //   const { current: pageIndex, pageSize, total } = paginationConfig || {
  //     current: 1,
  //     pageSize: pagination.pageSize,
  //     total: 0,
  //   };
  //   let searchCondition: any = {
  //     pageIndex,
  //     pageSize,
  //     total,
  //     queryJson: { keyword: '', billId: infoDetail.billId },
  //   };
  //   if (sorter) {
  //     let { field, order } = sorter;
  //     searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
  //     searchCondition.sidx = field ? field : 'billId';
  //   }
  //   return noticeload(searchCondition).then(res => {
  //     return res;
  //   });
  // };

  //明细表加载
  // const noticeload = data => {
  //   data.sidx = data.sidx || 'billId';
  //   data.sord = data.sord || 'asc';
  //   return GetOffsetPageDetailData(data).then(res => {
  //     const { pageIndex: current, total, pageSize } = res;
  //     setPagination(pagesetting => {
  //       return {
  //         ...pagesetting,
  //         current,
  //         total,
  //         pageSize,
  //       };
  //     });
  //     setNoticeData(res.data);
  //     return res;
  //   });
  // };

  // const onSave = () => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       let newData = {
  //         payBeginDate: values.payBeginDate.format('YYYY-MM-DD HH:mm:ss'),
  //         payEndDate: values.payEndDate.format('YYYY-MM-DD HH:mm:ss'),
  //         beginDate: values.beginDate.format('YYYY-MM-DD HH:mm:ss'),
  //         endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss'),
  //         //payfeeitemid: infoDetail.billId,
  //         //feeitemid: infoDetail.feeitemid
  //       };

  //       SaveForm(newData).then((res) => {
  //         if (res.data) {
  //           notification['warning']({
  //             message: '系统提示',
  //             description:
  //               '没有找到要冲抵的费用！'
  //           });
  //         } else {
  //           // close();
  //           message.success('保存成功');
  //           reload();
  //           closeDrawer();
  //         }
  //       });
  //     }
  //   });
  // };

  const columns = [
    // {
    //   title: '单号',
    //   dataIndex: 'billCode',
    //   key: 'billCode',
    //   width: 180,
    //   sorter: true
    // },  
    {
      title: '应付日期',
      dataIndex: 'period',
      key: 'period',
      sorter: true,
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '付款项目',
      dataIndex: 'payFeeName',
      key: 'payFeeName',
      width: 140,
      sorter: true,
    },
    {
      title: '应付金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 100,
      sorter: true,
    },
    {
      title: '收款项目',
      dataIndex: 'billFeeName',
      key: 'billFeeName',
      width: 140,
      sorter: true,
    },
    {
      title: '冲抵金额',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      sorter: true,
      width: 100
    },
    // {
    //   title: '应付余额',
    //   dataIndex: 'lastAmount',
    //   sorter: true,
    //   key: 'lastAmount',
    //   width: 100, 
    // },
    {
      title: '计费起始日期',
      dataIndex: 'billBeginDate',
      key: 'billBeginDate',
      sorter: true,
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '计费截止日期',
      dataIndex: 'billEndDate',
      key: 'billEndDate',
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
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      //  className="offsetModify"
      title={title}
      placement="right"
      width={780}
      onClose={closeDrawer}
      visible={showVisible}
      // style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -55px)' }}
    >
      <Spin tip="数据处理中..." spinning={loading}>
        <Form layout="vertical" hideRequiredMark>
          <Card className={styles.card}>
            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="冲抵单号">
                  {infoDetail.billCode}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="单据日期">
                  {infoDetail.billDate}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="冲抵人" >
                  {infoDetail.createUserName}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="是否审核">
                  {infoDetail.ifVerify ? '已审核' : '未审核'}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="审核日期"  >
                  {infoDetail.verifyDate}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="审核人">
                  {infoDetail.verifyPerson}
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
                // bordered={false}
                size="middle"
                columns={columns}
                dataSource={listdata}
                // rowKey="billId"
                rowKey={record => record.id}
                pagination={pagination}
                scroll={{ y: 500, x: 1200 }}
                loading={loading}
                onChange={(pagination: PaginationConfig, filters, sorter) =>
                  changePage(pagination, filters, sorter)
                }
              />
            </Row>
          </Card>
        </Form>
      </Spin>
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
        <Button style={{ marginRight: 8 }}
          onClick={closeDrawer}
        >
          关闭
        </Button>
        {/* <Button type="primary"
          onClick={() => onSave()}
        >
          提交
        </Button> */}
      </div>

    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show);

