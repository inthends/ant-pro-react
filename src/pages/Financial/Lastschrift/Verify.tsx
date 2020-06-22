
import {Tag, Input, message, Table, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { Audit, GetFormJson, GetListById } from './Lastschrift.service';
const { TextArea } = Input;
import styles from './style.less' 

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
  const title = ifVerify ? '划账单审核' : '划账单取消审核';
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
          //       keyvalue: res.billId,
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
            sord: "asc",
            sidx: 'id',
            pageIndex,
            pageSize,
            total,
            keyvalue: res.billId
          };
          setLoading(true);
          GetListById(searchCondition).then(res => {
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
      keyvalue: infoDetail.billId
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
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
        newData.keyvalue = infoDetail.billId;
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
      title: '划账费项',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100,
    },
    {
      title: '划账金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
    },
    {
      title: '扣款金额',
      dataIndex: 'deductionAmount',
      key: 'deductionAmount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">未扣</Tag>;
          case 1:
            return <Tag color="#19d54e">已扣</Tag>;
          case -1:
            return <Tag color="#e4aa5b">作废</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '户名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '房号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '开户银行',
      dataIndex: 'accountBank',
      key: 'accountBank',
      width: 120,
    },
    {
      title: '账号',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 120,
    },

    {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
    }
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
              <Form.Item label="划账单号">
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="单据日期">
                {infoDetail.billDate}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="划账人" >
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
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="备注"  >
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
              columns={columns}
              dataSource={listdata}
              rowKey="id"
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

