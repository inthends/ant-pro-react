//未收列表
import Page from '@/components/Common/Page';
import { Menu, Dropdown, Icon, Divider, InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RemoveForm, Charge } from './Main.service';
import styles from './style.less';
const { Option } = Select;

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
  form: WrappedFormUtils;
  rowSelect(rowSelectedKeys): void;
  organizeId: string;
  customerName: string;
  showSplit(id: string): void;
  showTrans(id: string): void;
}

function ListTable(props: ListTableProps) {
  const { form, onchange, loading, pagination, data, modify, reload, rowSelect, organizeId, customerName, showSplit, showTrans } = props;
  const { getFieldDecorator } = form;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
const [hasSelected,setHasSelected]=useState<boolean>();
  useEffect(()=>{
    setSelectedRowKeys([]);
    setHasSelected(false);
    form.setFieldsValue({ payAmountA: 0});
    form.setFieldsValue({ payAmountB: 0 });
    form.setFieldsValue({ payAmountC: 0 });
  },[data])

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

  const editAndDelete = (key: string, currentItem: any) => {
    console.log(currentItem);
    if (key === 'view') {
      //this.showEditModal(currentItem);
    }
    else if (key === 'split') {
      showSplit(currentItem.id);
    } else if (key === 'trans') {
      showTrans(currentItem.id);
    }
  };

  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="view">查看</Menu.Item>
          <Menu.Item key="split">拆费</Menu.Item>
          <Menu.Item key="trans">转费</Menu.Item>
        </Menu>}>
      <a>
        更多 <Icon type="down" />
      </a>
    </Dropdown>
  );

  const columns = [
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 140,
    },
    {
      title: '应收金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 80,
    },
    {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 80,
    },
    {
      title: '冲抵金额',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      width: 80,
    },
    {
      title: '未收金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 80,
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 85,
      render: val => moment(val).format('YYYY-MM-DD')
    }, {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 85,
      render: val => moment(val).format('YYYY-MM-DD')
    }, {
      title: '账单日',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 85,
      render: val => moment(val).format('YYYY-MM-DD')
    }, {
      title: '房屋全称',
      dataIndex: 'allname',
      key: 'allname',
      width: 200
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 100
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => modify(record.id)}
          // >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,

          <span>
            <a onClick={() => modify(record.id)} key="modify">修改</a>
            <Divider type="vertical" />
            <a onClick={() => doDelete(record)} key="delete">删除</a>
            <Divider type="vertical" />
            <MoreBtn key="more" item={record} />
          </span>

        ];
      },
    },
  ] as ColumnProps<any>[];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sumEntity, setSumEntity] = useState();
  // const [unitId, setUnitId] = useState();
  // const [customerName, setCustomerName] = useState();

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setHasSelected(selectedRowKeys.length > 0);
    console.log(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
    rowSelect(selectedRows);
    //应收金额
    var sumEntity = {};
    var sumAmount = 0, sumreductionAmount = 0, sumoffsetAmount = 0, sumlastAmount = 0;
    selectedRows.map(item => {
      sumAmount = selectedRows.reduce((sum, row) => { return sum + row.amount; }, 0);
      sumreductionAmount = selectedRows.reduce((sum, row) => { return sum + row.reductionAmount; }, 0);
      sumoffsetAmount = selectedRows.reduce((sum, row) => { return sum + row.offsetAmount; }, 0);
      sumlastAmount = selectedRows.reduce((sum, row) => { return sum + row.lastAmount; }, 0);
    });

    sumEntity['sumAmount'] = sumAmount.toFixed(2);
    sumEntity['sumreductionAmount'] = sumreductionAmount.toFixed(2);
    sumEntity['sumoffsetAmount'] = sumoffsetAmount.toFixed(2);
    sumEntity['sumlastAmount'] = sumlastAmount.toFixed(2);
    setSumEntity(sumEntity);
    form.setFieldsValue({ payAmountA: sumEntity['sumAmount'] });
    form.setFieldsValue({ payAmountB: 0 });
    form.setFieldsValue({ payAmountC: 0 });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //收款
  const charge = () => {
    if (selectedRowKeys.length == 0) {
      message.warning('请选择收款项目!');
      return;
    }

    form.validateFields((errors, values) => {
      if (!errors) {
        Modal.confirm({
          title: '请确认',
          content: `确定要执行收款操作吗？`,
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            let info = Object.assign({}, values, {
              // roomId: organizeId,
              ids: JSON.stringify(selectedRowKeys),
              UnitId: organizeId,
              CustomerName: customerName,
              billDate: values.billDate.format('YYYY-MM-DD HH:mm:ss'),
              //organize.title.split(' ')[1]
            });


            if (Number(sumEntity.sumlastAmount) != Number(info.payAmountA + info.payAmountB + info.payAmountC)) {
              message.warning('本次收款金额小于本次选中未收金额合计，不允许收款，请拆费或者重新选择收款项');
              return;
            }
            Charge(info).then(res => {
              message.success('收款成功！');
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
          <Row gutter={27}>
            <Col lg={4}>
              <Form.Item >
                {getFieldDecorator('payTypeA', {
                  initialValue: '支付宝扫码'
                })(
                  <Select >
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
            <Col lg={4}>
              <Form.Item required>
                {getFieldDecorator('payAmountA', {
                  initialValue: hasSelected ? sumEntity.sumAmount : 0,
                  rules: [{ required: true, message: '请输入金额' }],
                })(<InputNumber onChange={(value) => {
                  if (sumEntity != undefined && Number(value) < sumEntity.sumAmount) {
                    var amountB = sumEntity.sumAmount - Number(value);
                    // form.setFieldsValue({payAmountB:amountB.toFixed(2)});
                    form.setFieldsValue({ payAmountB: amountB });
                    form.setFieldsValue({ payAmountC: 0.00 });
                  }
                }}
                  precision={2}
                  min={0}
                  max={hasSelected ? sumEntity.sumAmount : 0}
                  style={{ width: '100%' }}
                />)}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item >
                {getFieldDecorator('payTypeB', {
                  initialValue: '微信'
                })(
                  <Select  >
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
            <Col lg={4}>
              <Form.Item required>

                {getFieldDecorator('payAmountB', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请输入金额' }],
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    max={hasSelected ? sumEntity.sumAmount - Number(form.getFieldValue('payAmountA')) : 0}
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      var sumAmountA = form.getFieldValue('payAmountA');
                      if (sumEntity != undefined && sumAmountA + Number(value) < sumEntity.sumAmount) {
                        var amountC = sumEntity.sumAmount - Number(value) - sumAmountA;
                        form.setFieldsValue({ payAmountC: amountC });
                      }
                    }}
                  />
                )}

              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item >
                {getFieldDecorator('payTypeC', {
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
            <Col lg={4}>
              <Form.Item required>
                {getFieldDecorator('payAmountC', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请输入金额' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    min={0}
                    max={hasSelected ? sumEntity.sumAmount -
                      Number(form.getFieldValue('payAmountA')) -
                      Number(form.getFieldValue('payAmountB')) : 0}
                  />
                )}

              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item required>
                {getFieldDecorator('billDate', {
                  initialValue: moment(new Date()),
                  rules: [{ required: true, message: '请选择收款日期' }],
                })(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item >
                {getFieldDecorator('payCode', {
                })(<Input placeholder="请输入收据编号" />)}
              </Form.Item>

            </Col>
            <Col lg={6}>
              <Form.Item >
                {getFieldDecorator('invoiceCode', {
                })(<Input placeholder="请输入发票编号" />)}
              </Form.Item>
            </Col>

            <Col lg={8}>
              <Form.Item >
                {getFieldDecorator('memo', {
                })(<Input placeholder="请输入备注" />)}

              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" onClick={charge}>收款确认</Button>
          <span style={{ marginLeft: 8, color: "red" }}>
            {hasSelected ? `应收金额：${sumEntity.sumAmount} ，减免金额：${sumEntity.sumreductionAmount}，冲抵金额：${sumEntity.sumoffsetAmount}，未收金额：${sumEntity.sumlastAmount}` : ''}
          </span>

        </Card>
      </Form>
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500, x: 1500 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
        rowSelection={rowSelection}
      />
    </Page>
  );
}

//export default ListTable;

export default Form.create<ListTableProps>()(ListTable);
