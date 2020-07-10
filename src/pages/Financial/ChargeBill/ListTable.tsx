//未收列表
import Page from '@/components/Common/Page';
import {
  Spin, Checkbox, Menu, Dropdown, Icon, Divider, InputNumber, Input, Select,
  Col, Row, Form, DatePicker, Card, Button, message, Table, Modal
} from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CheckRebateFee, CheckFeeBillDate, InvalidBillDetailForm, Charge, GetQrCode, GetPayState, CalFee } from './Main.service';
import { GetCommonItems } from '@/services/commonItem';
// import QRCode from 'qrcode.react';
// import styles from './style.less';
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
  showDetail(billId: string): void;//打开查看页面
  showReduction(id: string): void;
  showRebate(id: string): void;//优惠
};

function ListTable(props: ListTableProps) {
  const { form, onchange, loading, pagination, data, modify,
    reload, rowSelect, organizeId, customerName, showSplit,
    showTrans, showDetail, showReduction, showRebate
  } = props;
  const { getFieldDecorator } = form;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  const [hasSelected, setHasSelected] = useState<boolean>();
  //是否抹零
  const [isML, setIsML] = useState<boolean>(false);
  //抹零类型
  const [mlType, setMlType] = useState<any>('抹去角');
  //小数位处理
  const [mlScale, setMlScale] = useState<any>('四舍五入');
  //二维码地址
  // const [qrUrl, setQrUrl] = useState<any>('1');
  //是否生成收款码
  const [isQrcode, setIsQrcode] = useState<boolean>(false);
  const [banks, setBanks] = useState<any[]>([]); //入账银行

  const [payTypeA, setPayTypeA] = useState<any[]>([]); //收款方式A
  const [defaultPayTypeA, setDefaultPayTypeA] = useState<any>(''); //默认收款方式A
  const [payTypeB, setPayTypeB] = useState<any[]>([]); //收款方式B
  const [defaultPayTypeB, setDefaultPayTypeB] = useState<any>(''); //默认收款方式A
  const [payTypeC, setPayTypeC] = useState<any[]>([]); //收款方式C
  const [defaultPayTypeC, setDefaultPayTypeC] = useState<any>(''); //默认收款方式A

  useEffect(() => {
    setSelectedRowKeys([]);
    setHasSelected(false);
    form.setFieldsValue({ payAmountA: 0 });
    form.setFieldsValue({ payAmountB: 0 });
    form.setFieldsValue({ payAmountC: 0 });
    //获取开户银行
    GetCommonItems('AccountBank').then(res => {
      setBanks(res || []);
    });

    GetCommonItems('PayTypeA').then(res => {
      setPayTypeA(res || []);
      var val = res.find((item) => item.isDefault);
      setDefaultPayTypeA(val ? val.value : '转账');
    });

    GetCommonItems('PayTypeB').then(res => {
      setPayTypeB(res || []);
      var val = res.find((item) => item.isDefault);
      setDefaultPayTypeB(val ? val.value : '现金');
    });

    GetCommonItems('PayTypeC').then(res => {
      setPayTypeC(res || []);
      var val = res.find((item) => item.isDefault);
      setDefaultPayTypeC(val ? val.value : '刷卡');
    });

  }, [data])

  const doInvalid = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要作废${record.feeName}？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        //console.log(record);
        InvalidBillDetailForm(record.id).then(() => {
          message.success('作废成功');
          reload();
        });
      },
    });
  };

  const editAndDelete = (key: string, currentItem: any) => {
    //console.log(currentItem);
    //if (key === 'view') {
    //this.showEditModal(currentItem);
    //}
    //else
    if (key === "reduction") {
      //减免
      showReduction(currentItem.id);
    }
    else if (key === "offset") {
      //优惠
      showRebate(currentItem.id);
    }
    else if (key === 'split') {
      //如果设置了优惠政策，则不允许拆费
      if (currentItem.rmid != null) {
        message.warning('设置了优惠政策，不允许拆费');
      } else {
        showSplit(currentItem.id);
      }
    } else if (key === 'trans') {
      showTrans(currentItem.id);
    }
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sumEntity, setSumEntity] = useState<any>();
  // const [unitId, setUnitId] = useState();
  // const [customerName, setCustomerName] = useState();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [rebateAmount, setRebateAmount] = useState<number>(0);//优惠金额
  const [mlAmount, setMlAmount] = useState<number>(0);//抹零金额
  const [lastAmount, setLastAmount] = useState<number>(0);//剩余金额

  const [groupTotal, setGroupTotal] = useState<any>('');//按照费项统计金额

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys.length > 0) {
      const checkdata = {
        feeId: selectedRowKeys[0],
        unitId: selectedRows[0].unitId,
        selectFeeIds: JSON.stringify(selectedRowKeys)
      };

      //判断之前账单日是否已经勾选，不允许跨账单缴费
      var flag = true;
      CheckFeeBillDate(checkdata).then((res) => {
        if (res) {
          message.warning('不能跨账单日收费，请勾选之前的费用');
          flag = false;
          setIsDisabled(true);
        } else {
          flag = true;
          setIsDisabled(false);
        }
      })

      if (flag) {
        //如果该笔费用存在优惠，则需要选中与此费项有关的全部费用，一起缴款，否则给出提示 
        const data = {
          mainId: selectedRows[0].rmid,
          feeId: selectedRowKeys[0],
          unitId: selectedRows[0].unitId,
          selectFeeIds: JSON.stringify(selectedRowKeys)
        };

        CheckRebateFee(data).then((res) => {
          if (res.flag) {
            //message.error('当前选中的费用还有' + res.count + '笔也是属于优惠的，请一起勾选缴费！'); 
            // Modal.warning({
            //   title: '提示信息',
            //   content: '当前选中的费用包含优惠费用，还有' + res.count + '笔优惠，请一起勾选缴费！',
            //   okText: '确定'
            // });

            setIsDisabled(true);
            return;
            //收款确认不可用 
          } else {
            setIsDisabled(false);
          }
        });
      }

    } else {
      setIsDisabled(true);
    }

    //勾选
    setHasSelected(selectedRowKeys.length > 0);
    // console.log(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
    rowSelect(selectedRows);//选中行
    //应收金额
    var _sumEntity = {};
    var sumAmount = 0, sumreductionAmount = 0, sumoffsetAmount = 0, sumlastAmount = 0;
    selectedRows.map(item => {
      sumAmount = selectedRows.reduce((sum, row) => { return sum + row.amount; }, 0);
      sumreductionAmount = selectedRows.reduce((sum, row) => { return sum + row.reductionAmount; }, 0);
      sumoffsetAmount = selectedRows.reduce((sum, row) => { return sum + row.offsetAmount; }, 0);
      sumlastAmount = selectedRows.reduce((sum, row) => { return sum + row.lastAmount; }, 0);
    });
    _sumEntity['sumAmount'] = sumAmount.toFixed(2);//应收金额
    _sumEntity['sumreductionAmount'] = sumreductionAmount.toFixed(2);//减免金额
    _sumEntity['sumoffsetAmount'] = sumoffsetAmount.toFixed(2);//冲抵金额
    _sumEntity['sumlastAmount'] = sumlastAmount.toFixed(2);//原始剩余应收金额
    setSumEntity(_sumEntity);
    //抹零 
    // if (isML) {
    const data = {
      isML: isML,
      mlType: mlType,
      mlScale: mlScale,
      sumAmount: sumlastAmount,
      ids: JSON.stringify(selectedRowKeys)
    };

    CalFee(data).then((res) => {
      //CalML(sumlastAmount, mlType, mlScale).then((res) => {
      //按照费项统计金额
      setGroupTotal(res.groupTotal);
      setMlAmount(res.mlAmount);
      setRebateAmount(res.rebateAmount);
      setLastAmount(res.lastAmount);
      form.setFieldsValue({ payAmountA: res.lastAmount });
      form.setFieldsValue({ payAmountB: 0 });
      form.setFieldsValue({ payAmountC: 0 });
    });

    // } 
    // else { 
    //   setLastAmount(sumlastAmount - tRebate);
    //   form.setFieldsValue({ payAmountA: sumlastAmount - tRebate });
    //   form.setFieldsValue({ payAmountB: 0 });
    //   form.setFieldsValue({ payAmountC: 0 });
    // }

  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [myLoading, setMyLoading] = useState<boolean>(false);

  //收款
  const charge = () => {
    if (selectedRowKeys.length == 0) {
      message.destroy();//防止重复出现提示
      message.warning('请选择收款项目！');
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
            setMyLoading(true);
            let info = Object.assign({}, values, {
              // roomId: organizeId,
              ids: JSON.stringify(selectedRowKeys),
              UnitId: organizeId,
              CustomerName: customerName,
              billDate: values.billDate.format('YYYY-MM-DD HH:mm:ss'),
              //organize.title.split(' ')[1]
              isML: isML,
              mlAmount: mlAmount,
              // mlType: mlType,
              // mlScale: mlScale
            });

            if (lastAmount != Number(info.payAmountA) + Number(info.payAmountB) + Number(info.payAmountC)) {
              message.warning('本次收款金额小于本次选中未收金额合计，不允许收款，请拆费或者重新选择收款项');
              setMyLoading(false);
              return;
            }

            //弹出收款码
            if (isQrcode) {
              // GetQrCode(info).then(res => {
              //   // setQrUrl(res);  
              //   Modal.confirm({
              //     title: "请扫码",
              //     // okText: "确认",
              //     // cancelText: "取消", 
              //     // content: (<QRCode
              //     //   value={res} //value参数为生成二维码的链接
              //     //   size={200} //二维码的宽高尺寸
              //     //   fgColor="#000000"  //二维码的颜色 
              //     // />) 
              //     content: (<img src={res}></img>),
              //     onOk() {
              //       //收款
              //       // QrCodeCharge(info).then(billId => {
              //       //   message.success('收款成功');
              //       //   reload();
              //       //   //弹出查看页面
              //       //   showDetail(billId);
              //       // });
              //     },
              //     onCancel() {
              //     } 
              //   }); 
              // });

              //金额为0，不能走移动支付
              if (lastAmount == 0) {
                message.warning('本次收款金额为0，不能使用收款码支付');
                setMyLoading(false);
                return;
              }

              GetQrCode(info).then(res => {
                pay(res.code_img_url);
                //预订单id
                form.setFieldsValue({ tradenoId: res.tradenoId });
              })

            } else {
              //直接收款 
              Charge(info).then(billId => {
                message.success('收款成功');
                //重置收款页面信息
                setSelectedRowKeys([]);//重置之前选择的数据
                form.setFieldsValue({ payAmountA: 0 });
                form.setFieldsValue({ payAmountB: 0 });
                form.setFieldsValue({ payAmountC: 0 });
                form.setFieldsValue({ payTypeA: '支付宝' });
                form.setFieldsValue({ payTypeB: '微信' });
                form.setFieldsValue({ payTypeC: '现金' });
                form.setFieldsValue({ payCode: '' });
                form.setFieldsValue({ invoiceCode: '' });
                form.setFieldsValue({ accountBank: null });
                form.setFieldsValue({ memo: '' });
                setMyLoading(false);
                reload();
                //弹出查看页面
                showDetail(billId);
              });
            }
          }
        });
      }
    });
  };

  let temp;
  //弹出收款码
  const pay = (url) => {
    // let temp = Modal.confirm({ 
    temp = Modal.info({
      title: '请扫码',
      content: (<img src={url}></img>),
      okText: '取消',
      // onCancel() {
      onOk() {
        // if (timer) {
        //   timer = null;//关闭弹窗后不轮询
        // } 
        if (interval != null) {
          //判断计时器是否为空
          clearInterval(interval);
          interval = null;
        }
      }
    })

    // retry().then(() => {
    //   //轮询结束
    //   alert('ok');
    //   temp.destroy();
    // });
    start();
  };

  let interval;//计时器 
  const start = () => {//启动计时器函数
    if (interval != null) {//判断计时器是否为空
      clearInterval(interval);
      interval = null;
    }
    interval = setInterval(retry, 3000);//启动计时器，调用函数
  }

  const retry = () => {
    const tradenoId = form.getFieldValue('tradenoId');
    if (tradenoId) {
      GetPayState(tradenoId).then(res => {
        if (res != "") {
          clearInterval(interval);
          interval = null;
          temp.destroy();//关闭收款码窗体
          reload();
          message.success('收款成功');
          showDetail(res);
        }
      })
    }
  }

  //轮询支付回调数据
  // let timer;
  // const retry = () => {
  //   return new Promise((resolve, reject) => {
  //     timer = setTimeout(() => {
  //       const tradenoId = form.getFieldValue('tradenoId');
  //       if (tradenoId) {
  //         GetPayState(tradenoId).then(res => {
  //           if (res != "") {
  //             //结束轮询 
  //             //console.log('结束轮询');
  //             resolve();//轮询结束，不销毁二维码窗体，有bug,需要研究
  //             //刷新列表
  //             reload();
  //             message.success('收款成功');
  //             //弹出收款查看页面 
  //             showDetail(res);
  //           }
  //           else {
  //             if (timer) {
  //               //继续异步轮询
  //               // console.log('继续异步轮询');
  //               retry();
  //             }
  //           }
  //         })
  //       }
  //     }, 3000); //调用栈会越来越大，5秒一次，防止内存泄露
  //   })
  // };


  //抹零计算
  const mlCal = (isml, type, scale) => {
    if (selectedRowKeys.length == 0) {
      //message.warning('请选择收款项目！');
      return;
    }
    const data = {
      isML: isml,
      mlType: type,
      mlScale: scale,
      sumAmount: sumEntity.sumlastAmount, //lastAmount,
      ids: JSON.stringify(selectedRowKeys)
    };
    CalFee(data).then((res) => {
      //CalFee(sumEntity.sumlastAmount, type, scale).then((res) => {
      setMlAmount(res.mlAmount);
      setRebateAmount(res.rebateAmount);
      setLastAmount(res.lastAmount);
      form.setFieldsValue({ payAmountA: res.lastAmount });
      form.setFieldsValue({ payAmountB: 0 });
      form.setFieldsValue({ payAmountC: 0 });
    });

    // }
    // else {
    //   //还原
    //   setLastAmount(sumEntity.sumlastAmount);//还原未抹零之前的剩余应收金额
    //   setMlAmount(0);
    //   form.setFieldsValue({ payAmountA: sumEntity.sumlastAmount });
    //   form.setFieldsValue({ payAmountB: 0 });
    //   form.setFieldsValue({ payAmountC: 0 });
    // }
  };

  // const payTypeList = payType.map
  //   (item =>
  //     <Option key={item.key} value={item.value}>{item.title}
  //     </Option>
  //   );

  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          {/* <Menu.Item key="view">查看</Menu.Item> */}
          <Menu.Item key="reduction">减免</Menu.Item>
          {item.rmid ? null : <Menu.Item key="offset">优惠</Menu.Item>}
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
      render: (text, record) => {
        if (record.rmid != null)
          return <span>{text + ' '}<span style={{ color: 'red', fontSize: '4px', verticalAlign: 'super' }}>惠</span></span>;
        else
          return text;
      }
    },
    // {
    //   title: '是否优惠',
    //   dataIndex: 'rmid',
    //   key: 'rmid',
    //   align: 'center',
    //   width: 80,
    //   render: val => val ? <Tag color="red">是</Tag> : '否'
    // },
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
      title: '起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      align: 'center',
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    }, {
      title: '截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'center',
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '账单日',
      dataIndex: 'billDate',
      key: 'billDate',
      align: 'center',
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '单元全称',
      dataIndex: 'allname',
      key: 'allname',
      width: 280
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 200
    },
    {
      title: '优惠政策',
      dataIndex: 'rebateName',
      key: 'rebateName',
      align: 'center',
      width: 160
    },
    {
      title: '优惠有效期',
      dataIndex: 'rBegin',
      key: 'rBegin',
      align: 'center',
      width: 180,
      render: (text, record) => {
        if (record.rmid) {
          return moment(record.rBegin).format('YYYY-MM-DD') + '至' + moment(record.rEnd).format('YYYY-MM-DD');
        } else {
          return '';
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 155,
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
          <span key='span'>
            <a onClick={() => modify(record.id)} key="modify">修改</a>
            <Divider type="vertical" />
            <a onClick={() => doInvalid(record)} key="invalid">作废</a>
            <Divider type="vertical" />
            <MoreBtn key="more" item={record} />
          </span>

        ];
      },
    },
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Spin tip="数据处理中..." spinning={myLoading}>
        <Form layout="vertical" hideRequiredMark>
          <Card bordered={false} hoverable >
            <Row gutter={12}>
              <Col lg={4}>
                <Form.Item >
                  {getFieldDecorator('payTypeA', {
                    initialValue: defaultPayTypeA
                  })(
                    <Select >
                      {/* 
                       <Option value="转账">转账</Option>
                    <Option value="现金">现金</Option> 
                    <Option value="刷卡">刷卡</Option>  
                    <Option value="抵扣券">抵扣券</Option>
                    <Option value="其它">其它</Option> */}
                      {payTypeA.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item required>
                  {getFieldDecorator('payAmountA', {
                    //initialValue: hasSelected ? lastAmount : 0,
                    rules: [{ required: true, message: '请输入金额' }],
                  })(<InputNumber onChange={(value) => {
                    if (sumEntity != undefined && Number(value) < lastAmount) {
                      var amountB = lastAmount - Number(value);
                      form.setFieldsValue({ payAmountB: amountB.toFixed(2) });
                      form.setFieldsValue({ payAmountC: 0 });
                    }
                  }}
                    precision={2}
                    min={0}
                    max={hasSelected ? lastAmount : 0}
                    style={{ width: '100%' }}
                  />)}
                  {getFieldDecorator('tradenoId', {
                  })(
                    <input type='hidden' />
                  )}
                  {getFieldDecorator('rebateAmount', {
                  })(
                    <input type='hidden' />
                  )}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item >
                  {getFieldDecorator('payTypeB', {
                    initialValue: defaultPayTypeB//'现金'
                  })(
                    <Select>
                      {payTypeB.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
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
                      max={hasSelected ? lastAmount - Number(form.getFieldValue('payAmountA')) : 0}
                      style={{ width: '100%' }}
                      onChange={(value) => {
                        var sumAmountA = form.getFieldValue('payAmountA');
                        if (sumEntity != undefined && sumAmountA + Number(value) < lastAmount) {
                          var amountC = lastAmount - Number(value) - sumAmountA;
                          form.setFieldsValue({ payAmountC: amountC.toFixed(2) });
                        }
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item >
                  {getFieldDecorator('payTypeC', {
                    initialValue: defaultPayTypeC// '刷卡'
                  })(
                    <Select>
                      {payTypeC.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
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
                      max={hasSelected ? lastAmount - Number(form.getFieldValue('payAmountA')) - Number(form.getFieldValue('payAmountB')) : 0}
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
              <Col lg={4}>
                <Form.Item >
                  {getFieldDecorator('payCode', {
                  })(<Input placeholder="请输入收据编号" />)}
                </Form.Item>

              </Col>
              <Col lg={4}>
                <Form.Item >
                  {getFieldDecorator('invoiceCode', {
                  })(<Input placeholder="请输入发票编号" />)}
                </Form.Item>
              </Col>

              <Col lg={4}>
                <Form.Item >
                  {getFieldDecorator('accountBank', {
                  })(<Select placeholder="请选择入账银行">
                    {banks.map(item => (
                      <Option value={item.value} key={item.key}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>)}
                </Form.Item>
              </Col>

              <Col lg={8}>
                <Form.Item >
                  {getFieldDecorator('memo', {
                  })(<Input placeholder="请输入备注" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Button type="primary" disabled={isDisabled} onClick={charge}>收款确认</Button>
              <Checkbox
                style={{ marginLeft: '10px' }}
                onChange={(e) => { setIsQrcode(e.target.checked); }}
              >生成收款码</Checkbox>
              <Checkbox
                style={{ marginLeft: '10px' }}
                // disabled={isQrcode}
                onChange={(e) => {
                  setIsML(e.target.checked);
                  //算抹零金额
                  mlCal(e.target.checked, mlType, mlScale);
                }}
              >自动抹零</Checkbox>
              <Select
                style={{
                  marginLeft: '10px',
                  width: '85px',
                  display: isML ? 'inline-block' : 'none'
                }}
                defaultValue='抹去角'
                // disabled={isQrcode}
                onChange={(value) => { setMlType(value); mlCal(isML, value, mlScale); }} >
                {/* <Option value='1'>抹去角和分</Option> */}
                <Option value='抹去角'>抹去角</Option>
                <Option value='抹去分'>抹去分</Option>
              </Select>
              <Select style={{
                marginLeft: '10px', width: '96px',
                display: isML ? 'inline-block' : 'none'
              }}
                defaultValue='四舍五入'
                // disabled={isQrcode}
                onChange={(value) => { setMlScale(value); mlCal(isML, mlType, value); }} >
                <Option value='四舍五入'>四舍五入</Option>
                <Option value='直接舍去'>直接舍去</Option>
                <Option value='有数进一'>有数进一</Option>
              </Select>
            </Row>




            <Row style={{ marginTop: '5px' }}>
              <span style={{ marginLeft: 8, color: "red" }}>
                {hasSelected ? `应收金额：${sumEntity.sumAmount} ，
            减免金额：${sumEntity.sumreductionAmount}，
            冲抵金额：${sumEntity.sumoffsetAmount}，
            优惠金额：${rebateAmount.toFixed(2)}， 
            抹零金额：${mlAmount.toFixed(2)}，
            未收金额：${lastAmount.toFixed(2)}` : ''}
              </span>
            </Row>

            <Row style={{ marginTop: '5px' }}>
              <span style={{ marginLeft: 8, color: "red" }}>
                {groupTotal}
              </span>
            </Row>

            <Table
              bordered={false}
              size="middle"
              dataSource={data}
              columns={columns}
              rowKey={record => record.id}
              pagination={pagination}
              scroll={{ y: 500, x: 1850 }}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePage(pagination, filters, sorter)
              }
              loading={loading}
              rowSelection={rowSelection}
            />
          </Card>
        </Form>
      </Spin>
    </Page >
  );
};
//export default ListTable;
export default Form.create<ListTableProps>()(ListTable);