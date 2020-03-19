
import { Input, message, Table, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { Audit, GetFormJson, GetListByID } from './Offset.service';
const { TextArea } = Input;
import styles from './style.less'
import moment from 'moment';

interface VerifyProps {
  verifyVisible: boolean;
  ifVerify: boolean;
  closeVerify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const Verify = (props: VerifyProps) => {
  const { reload, verifyVisible, closeVerify, form, id, ifVerify } = props;
  // const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const title = ifVerify ? '冲抵单审核' : '冲抵单取消审核';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [listdata, setListData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());


  useEffect(() => {

    if (verifyVisible) {

      if (id) {
        setLoading(true);
        GetFormJson(id).then(res => {

          setInfoDetail(res);
          form.resetFields();

          // if (res.customerId) {
          //   GetCustomInfo(res.customerId).then(customInfo => {
          //     setInfoDetail({
          //       ...res,
          //       keyValue: res.billId,
          //       customerName: customInfo.name
          //     });
          //     setLoading(false);
          //   });
          // } else {
          //   setLoading(false);
          //   setInfoDetail(
          //     res
          //   )
          // }

          //分页查询
          const { current: pageIndex, pageSize, total } = pagination;
          const searchCondition: any = {
            pageIndex,
            pageSize,
            total,
            keyValue: res.billId
          };
          setLoading(true);
          GetListByID(searchCondition).then(res => {
            //明细
            setListData(res.data);
            setLoading(false);
          })

        })
      }
    }
    else {
      form.setFieldsValue({});
    }

  }, [verifyVisible]);

  const close = () => {
    closeVerify(false);
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


  // const onSave = () => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       let newData = {
  //         ...infoDetail,
  //         // verifyPerson:ifVerify?localStorage.getItem('userid'):'',
  //         ifVerify: ifVerify,
  //         // verifyDate:ifVerify?moment(new Date()).format('YYYY-MM-DD HH:mm:ss'):''
  //       };
  //       Audit(newData).then(() => {
  //         closeVerify(true);
  //       });
  //     }
  //   });
  // };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // const newvalue = { ...values, ifVerify: ifVerify };
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.keyValue = infoDetail.billId;
        newData.ifVerify = ifVerify;
        Audit(newData).then(res => {
          message.success('提交成功');
          closeVerify();
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
      title: '冲抵单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
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
      key: 'allName'
    },
  ] as ColumnProps<any>[];

  return (
    <Drawer
      // className="offsetVerify"
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={verifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form layout="vertical" hideRequiredMark>
        {/* <Spin tip="数据处理中..." spinning={loading}>
       </Spin> */}
 
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
              columns={columns}
              dataSource={listdata}
              rowKey="billId"
              pagination={pagination}
              scroll={{ y: 500, x: 1200 }}
              loading={loading}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePage(pagination, filters, sorter)
              }
            />
          </Row>
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
          <Button style={{ marginRight: 8 }}
            onClick={() => closeVerify()}
          >
            取消
            </Button>
          <Button type="primary"
            onClick={() => onSave()}
          >
            提交
            </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default Form.create<VerifyProps>()(Verify);

