import { Button, Col, DatePicker, Drawer, Form, Row, Spin, Input, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { SaveForm, GetFormJson, GetOffsetPageDetailData } from './Offset.service';
import './style.less';
import moment from 'moment';

interface ModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  reload(): void;
}

const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form, id } = props;
  const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [noticeData, setNoticeData] = useState<any>([]);
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  useEffect(() => {
    if (id) {
      setLoading(true);
      GetFormJson(id).then(res => {
        setInfoDetail(res);
        loadNoticeData('', res.organizeId);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };

  // const guid=()=> {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //       var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
  //       return v.toString(16);
  //   });
  // }

  //明细表数据
  const loadNoticeData = (search, organizeId, paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: '', billid: infoDetail.billId },
    };
    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billid';
    }
    return noticeload(searchCondition).then(res => {
      return res;
    });
  };

  //明细表加载
  const noticeload = data => {
    data.sidx = data.sidx || 'billid';
    data.sord = data.sord || 'asc';
    return GetOffsetPageDetailData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setNoticeData(res.data);
      return res;
    });
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData = {
          payBeginDate: values.payBeginDate.format('YYYY-MM-DD HH:mm:ss'),
          payEndDate: values.payEndDate.format('YYYY-MM-DD HH:mm:ss'),
          beginDate: values.beginDate.format('YYYY-MM-DD HH:mm:ss'),
          endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss'),
          //payfeeitemid: infoDetail.billId,
          //feeitemid: infoDetail.feeitemid
        };

        SaveForm(newData).then((res) => {
          close();
        });
      }
    });
  };

  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
    },
    {
      title: '房屋名称',
      dataIndex: 'allName',
      key: 'allName',
      width: 180,
      sorter: true
    },
    {
      title: '付款项目',
      dataIndex: 'payFeeName',
      key: 'payFeeName',
      width: 180,
      sorter: true,
    },
    {
      title: '应付金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 180,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'billFeeName',
      key: 'billFeeName',
      width: 180,
      sorter: true,
    },
    {
      title: '冲抵金额',
      dataIndex: 'billAmount',
      key: 'billAmount',
      sorter: true,
      width: 180
    },
    {
      title: '应付余额',
      dataIndex: 'lastAmount',
      sorter: true,
      key: 'lastAmount',
      width: 180,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {val} </span>
        }
      }
    },
    {
      title: '计费起始日期',
      dataIndex: 'billBeginDate',
      key: 'billBeginDate',
      sorter: true,
      width: 180,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }, {
      title: '计费终止日期',
      dataIndex: 'billEndDate',
      key: 'billEndDate',
      sorter: true,
      width: 180,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }
  ] as ColumnProps<any>[];


  return (
    <Drawer className="offsetModify"
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={modifyVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Form hideRequiredMark>
        <Spin tip="数据加载中..." spinning={loading}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item className="vertifyItem" label="单号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                {getFieldDecorator('billCode', {
                  initialValue: infoDetail.billCode,
                  rules: [{ required: true, message: '请输入单号' }],
                })(
                  <Input disabled={true}></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="单据日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                {getFieldDecorator('billDate', {
                  initialValue: infoDetail.billDate != null
                    ? moment(new Date(infoDetail.billDate))
                    : moment(new Date()),
                  rules: [{ required: true, message: '请选择单据日期' }],
                })(
                  <DatePicker></DatePicker>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="冲抵人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                {getFieldDecorator('createUserName', {
                  initialValue: infoDetail.createUserName,
                  rules: [{ required: true, message: '请输入冲抵人' }],
                })(
                  <Input disabled={true}></Input>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="状态" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                {getFieldDecorator('createUserName', {
                  initialValue: infoDetail.createUserName,
                  rules: [{ required: true, message: '请输入冲抵人' }],
                })(
                  <Input disabled={true}></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="审核日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                {getFieldDecorator('verifyDate', {
                  initialValue: infoDetail.verifyDate != null
                    ? moment(new Date(infoDetail.verifyDate))
                    : moment(new Date()),
                  rules: [{ required: true, message: '请选择审核日期' }],
                })(
                  <DatePicker disabled={true}></DatePicker>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="审核日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                {getFieldDecorator('verifyDate', {
                  initialValue: infoDetail.verifyDate != null
                    ? moment(new Date(infoDetail.verifyDate))
                    : moment(new Date()),
                  rules: [{ required: true, message: '请选择审核日期' }],
                })(
                  <DatePicker disabled={true}></DatePicker>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Table<any>
              bordered={false}
              size="middle"
              columns={columns}
              dataSource={noticeData}
              rowKey="billd"
              pagination={pagination}
              scroll={{ y: 500, x: 1620 }}
              loading={loading}
            />
          </Row>
        </Spin>
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
            onClick={() => closeDrawer()}
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

export default Form.create<ModifyProps>()(Modify);

