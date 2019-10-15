//应付列表
import Page from '@/components/Common/Page';
import { Divider, InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RemoveForm, Pay } from './Payment.service';
import styles from './style.less';
const { Option } = Select;

interface NotPaymentTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string, isEdit: boolean): void;
  reload(): void;
  form: WrappedFormUtils;
  rowSelect(rowSelectedKeys): void;
  organize?: any;
}

function NotPaymentTable(props: NotPaymentTableProps) {
  const { form, onchange, loading, pagination, data, modify, reload, rowSelect, organize } = props;
  const { getFieldDecorator } = form;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.feeName}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        //console.log(record);
        RemoveForm(record.billId).then(() => {
          message.success('删除成功');
          reload();
        });
      },
    });
  };

  // const editAndDelete = (key: string, currentItem: any) => {
  //   if (key === 'edit') {
  //     //this.showEditModal(currentItem);
  //   }
  //   else if (key === 'delete') {
  //     Modal.confirm({
  //       title: '删除任务',
  //       content: '确定删除该任务吗？',
  //       okText: '确认',
  //       cancelText: '取消',
  //       //onOk: () => this.deleteItem(currentItem.id),
  //     });
  //   }
  // };

  // const MoreBtn: React.FC<{
  //   item: any;
  // }> = ({ item }) => (
  //   <Dropdown
  //     overlay={
  //       <Menu onClick={({ key }) => editAndDelete(key, item)}>
  //         <Menu.Item key="view">查看</Menu.Item>
  //         <Menu.Item key="split">拆费</Menu.Item>
  //         <Menu.Item key="change">转费</Menu.Item>
  //       </Menu>}>
  //     <a>
  //       更多 <Icon type="down" />
  //     </a>
  //   </Dropdown>
  // );

  const columns = [
    {
      title: '应付费项',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 120,
      sorter: true,
    },
    {
      title: '应付金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: true,
    },
    {
      title: '冲抵金额',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      width: 100,
      sorter: true,
    },
    {
      title: '未付金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 100,
      sorter: true,
    },
    {
      title: '应付日期',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    }, {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    }, {
      title: '费用来源',
      dataIndex: 'billSource',
      key: 'billSource',
      width: 85
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => modify(record.billId, true)} key="modify">修改</a>
            <Divider type="vertical" />
            <a onClick={() => doDelete(record)} key="delete">删除</a>
            {/* <Divider type="vertical" />
            <MoreBtn key="more" item={record} />*/}
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];
  var [payAmount, setPayAmount] = useState<number>(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sumEntity, setSumEntity] = useState<number>(0);//金额累加
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    //console.log(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
    rowSelect(selectedRows);
    //应付金额
    let sumlastAmount = 0;
    selectedRows.map(item => {
      sumlastAmount = selectedRows.reduce((sum, row) => { return sum + row.lastAmount; }, 0);
    });

    setPayAmount(sumlastAmount);
    setSumEntity(sumlastAmount);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const hasSelected = selectedRowKeys.length > 0;
  //收款
  const charge = () => {
    if (selectedRowKeys.length == 0) {
      message.warning('请选择应付项目!');
      return;
    }

    form.validateFields((errors, values) => {
      if (!errors) {
        Modal.confirm({
          title: '请确认',
          content: `确定要执行付款操作吗？`,
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            let info = Object.assign({}, {}, {
              BillCode: '',
              roomid: organize.code,
              billids: JSON.stringify(selectedRowKeys),
              //OrganizeId:organize.organizeId,
              BillDate: values.billDate.format('YYYY-MM-DD'),
              PayAmount: values.payAmount,
              PayType: values.payType,
              Memo: values.memo,
            });
            if (Number(sumEntity) != Number(info.PayAmount)) {
              message.warning('本次付款金额小于本次选中未付金额合计，不允许付款，请拆费或者重新选择付款项');
              return;
            }

            Pay(info).then(res => {
              message.success('付款成功');
              reload();
            });
          }
        });
      }
    });
  };

  return (
    <Page>
      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card} bordered={false}  >
          <Row gutter={24} style={{ marginBottom: '8px' }}>
            <Col lg={24}>
              <span style={{ color: "red" }}>
                {organize.type == 5 ? `已选择：${organize.allname} ，本次选中未付金额合计：${sumEntity}` : `已选择： 本次选中未付金额合计：`}
              </span>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={4}>
              <Form.Item label='付款单编号'>
                {getFieldDecorator('billCode', {
                  initialValue: ''
                })(
                  <Input readOnly placeholder="自动获取编号" />
                )}

              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item required label='付款日期'>
                {getFieldDecorator('billDate', {
                  initialValue: moment(new Date()),
                  rules: [{ required: true, message: '请选择付款日期' }],
                })(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item required label='本次付款'>
                {getFieldDecorator('payAmount', {
                  initialValue: payAmount,
                  rules: [{ required: true, message: '请输入金额' }],
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    max={sumEntity}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={4} >
              <Form.Item required label='付款方式'>
                {getFieldDecorator('payType', {
                  initialValue: '现金'
                })(
                  <Select>
                    <Option value="现金">现金</Option>
                    <Option value="支付宝扫码" >支付宝扫码</Option>
                    <Option value="支付宝">支付宝</Option>
                    <Option value="微信" >微信</Option>
                    <Option value="微信扫码">微信扫码</Option>
                    <Option value="刷卡">刷卡</Option>
                    <Option value="转账">转账</Option>
                    <Option value="抵扣卷">抵扣卷</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item required label='备注'>
                {getFieldDecorator('memo', {
                  initialValue: '',
                  rules: [{ required: false }],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Button type="primary" onClick={charge}>付款确认</Button>
          </Row>
        </Card>
      </Form>
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.billId}
        pagination={pagination}
        scroll={{ y: 500, x: 1200 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
        rowSelection={rowSelection}
      />
    </Page>
  );
}

export default Form.create<NotPaymentTableProps>()(NotPaymentTable);
