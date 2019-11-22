
import { Select, Modal, message, Table, Button, Card, Col, Icon, DatePicker, Drawer, Form, Input, Row, notification } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { PaginationConfig } from 'antd/lib/table';
import AddItem from './AddItem';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { RemoveFormUnitAll, GetFormJson, GetListByID, GetUnitBillDetail, SaveForm } from './Main.service';
import moment from 'moment';
import styles from './style.less';
const { Option } = Select;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  // organizeId?: string;
  reload(): void;
  treeData: any[];
};

const Modify = (props: ModifyProps) => {
  const { treeData, modifyVisible, closeDrawer, form, id, reload } = props;
  const { getFieldDecorator } = form;
  const title = id === undefined ? '新增优惠单' : '修改优惠单';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [modalvisible, setModalVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  // const [reductionItem, setReductionItem] = useState<any[]>([]);
  // const [editItemColumn, setEditItemColumn] = useState<boolean>(false);
  const [listdata, setListData] = useState<any[]>([]);
  const [code, setCode] = useState<number>(0);//新增还是修改

  // const getSelectReduction = () => {
  //   GetReductionItem().then(res => {
  //     setReductionItem(res);
  //   });
  // };

  // const buildOption=(item:any)=>{
  //   const children = [];
  //   for ( let i = 0; i < item.length; i++) {
  //       children.push(<Option key={item[i].id}>{item[i].title}</Option>);
  //   }
  //   return children;
  // }

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      setModalVisible(false);
      // getSelectReduction();
      if (id) {
        // getInfo(id).then((tempInfo: any) => {
        //    setInfoDetail(tempInfo);
        //    form.resetFields();
        //    return GetListByID(tempInfo.billId);
        // }).then(res => {
        //   setListData(res.data);
        // });

        GetFormJson(id).then(res => {
          setCode(1);

          var entity = { ...res.entity, receiveId: res.receiveId, receiveCode: res.receiveCode }; 
          setInfoDetail(entity); 
          form.resetFields();
          //分页查询
          const { current: pageIndex, pageSize, total } = pagination;
          setLoading(true);
          const searchCondition: any = {
            pageIndex,
            pageSize,
            total,
            keyValue: entity.billId
          };

          GetListByID(searchCondition).then(res => {
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
          });

        });

      } else {
        form.resetFields();
        setCode(0);
        //重置之前选择加载的费项类别
        // GetUseInfo(localStorage.getItem('userid')).then(res => {
        setInfoDetail({
          keyValue: '',
          //code: 0,
          billId: guid(),
          // billCode: '',
          // billDate: '',
          createUserName: localStorage.getItem('name')//res.name == null ? '' : res.name,
          //createUserId: res.userid == null ? '' : res.userid,
          // rebate: "",
          // reductionFeeItemId: "",
          // memo: "",
          // reductionAmount: ""
        })
        // })
        setListData([]);
        // setReductionItem([]);
        // form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);

  const showModal = () => {

    // form.validateFields((errors, values) => {
    //   if (!errors) {
    //     setModalVisible(true);
    //   }
    // });

    setModalVisible(true);

  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const close = () => {
    closeDrawer();
  };

  const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  //提交编辑
  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // GetUseInfo(localStorage.getItem('userid')).then((res) => {  
        // let newListData: any[] = [];
        // listdata.forEach(element => {
        //   element.period = moment(element.period).format('YYYY-MM-DD HH:mm:ss');
        //   element.beginDate = moment(element.beginDate).format('YYYY-MM-DD HH:mm:ss');
        //   element.endDate = moment(element.endDate).format('YYYY-MM-DD HH:mm:ss');
        //   element.mainId = infoDetail.billId;
        //   newListData.push(element);
        // });

        // let newData = {
        //   keyValue: infoDetail.billId,
        //   code: code,//infoDetail.code,
        //   // code: infoDetail.billId == "" ? 0 : 1,
        //   billId: infoDetail.billId,
        //   organizeId: infoDetail.organizeId,
        //   billCode: infoDetail.billCode,
        //   billDate: moment(values.billDate).format('YYYY-MM-DD HH:mm:ss'),
        //   rebate: values.rebate,
        //   reductionAmount: values.reductionAmount,
        //   reductionFeeItemId: values.reductionFeeItemId,
        //   // ifVerify: false,
        //   //  verifyPerson:'',
        //   //  verifyDate:null,
        //   //  verifyMemo:null,
        //   // createUserName: res.name == null ? '' : res.name,
        //   // createUserId: res.id == null ? '' : res.id,
        //   // createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        //   // modifyUserId: res.id == null ? '' : res.id,
        //   // modifyUserName: res.name == null ? '' : res.name,
        //   // modifyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        //   // status: 0,
        //   memo: values.memo,
        //   details: JSON.stringify(listdata)
        // };

        /*  let newData = infoDetail ? {
            ...infoDetail,
            ...values ,
            keyValue:infoDetail.billId,
            billDate:moment(infoDetail.billDate).format('YYYY-MM-DD HH:mm:ss'),
            code:infoDetail.billId==""?0:1,
            details: JSON.stringify(newListData)} : values;*/

        let newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.details = JSON.stringify(listdata);
        newData.code = code;
        newData.billDate = moment(newData.billDate).format('YYYY-MM-DD HH:mm:ss');
        newData.beginDate = newData.beginDate.format('YYYY-MM-DD');
        newData.endDate = newData.endDate.format('YYYY-MM-DD');
        newData.keyValue = newData.billId;
        SaveForm(newData).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
        });

        // }).then(() => {
        //   closeDrawer();
        // });
      }
    });
  };

  // const getInfo = id => {
  //   if (id) {
  //     return GetFormJson(id).then(res => {
  //       const { billId,
  //         billCode,
  //         billDate,
  //         createUserName,
  //         rebate,
  //         reductionFeeItemId,
  //         memo,
  //         reductionAmount
  //       } = res || ({} as any);
  //       let info = {
  //         keyValue: billId,
  //         code: 1,
  //         billId,
  //         billCode,
  //         billDate,
  //         createUserName,
  //         rebate,
  //         reductionFeeItemId,
  //         memo,
  //         reductionAmount
  //       };
  //       return info;
  //     });
  //   } else {
  //     return Promise.resolve({
  //       parentId: 0,
  //       type: 1,
  //     });
  //   }
  // };


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
      title: '计费终止日期',
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
      dataIndex: 'memo',
      key: 'memo'
    },
  ]; //as ColumnProps<any>[];

  //输入减免条件后，返回匹配的计费
  const getReducetionItem = (data?) => {
    // console.log(data); 
    //分页查询
    const { current: pageIndex, pageSize, total } = pagination;
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      ...data,
      Rebate: form.getFieldValue('rebate') / 10,//折扣转换
      ReductionAmount: form.getFieldValue('reductionAmount')
    };
    GetUnitBillDetail(searchCondition).then(res => {
      if (res.data.length == 0) {
        notification['warning']({
          message: '系统提示',
          description:
            '没有找到要优惠的费用！'
        });
      } else {

        //去除原队列已存在数据
        // for (var i = res.length - 1; i < 0; i--) {
        //   for (var j = 0; j < listdata.length; j++) {
        //     if (res[i].unitId == listdata[j].unitId) {
        //       var index = res.indexOf(res[i]);
        //       if (index > -1) {
        //         res.splice(index, 1);
        //       }
        //       //res.removeAt(i);
        //     }
        //   }
        // }
        // setListData([
        //   ...listdata, ...res
        // ]);
        //明细
        setListData(res.data);
        closeModal();
      }
    })
  };


  //选择减免费项
  // const onFeeItemSelect = (value, option) => {
  //   //减免项目名称
  //   form.setFieldsValue({ reductionFeeItemName: option.props.children });
  // };

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

  //选择优惠政策
  const change = (value, option) => {
    form.setFieldsValue({ rebateName: option.props.children });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={780}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card} >
          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="单据编号">
                {getFieldDecorator('billCode', {
                  initialValue: infoDetail.billCode,
                  rules: [{ message: '自动获取编号' }],
                })(
                  <Input readOnly placeholder="自动获取编号" ></Input>
                )}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="单据日期">
                {getFieldDecorator('billDate', {
                  initialValue: infoDetail.billDate == null ? moment(new Date()) :
                    moment(new Date(infoDetail.billDate)),
                  rules: [{ required: true }],
                })(
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                )}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="经办人">
                {getFieldDecorator('createUserName', {
                  initialValue: infoDetail.createUserName,
                  rules: [{ required: true, message: '请输入经办人' }],
                })(
                  <Input style={{ width: '100%' }} readOnly></Input>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={8}>
              <Form.Item label="优惠政策" required>
                {getFieldDecorator('rebateCode', {
                  initialValue: infoDetail.rebateCode,
                  rules: [{ required: true, message: '请选择优惠政策' }]
                })(
                  <Select placeholder="==请选择优惠政策=="
                    onChange={change}
                  >
                    <Option value='1'>预缴一年赠送一个月</Option>
                    <Option value='2'>预缴一年减免一个月</Option>
                  </Select>
                )}
                {getFieldDecorator('rebateName', {
                  initialValue: infoDetail.rebateName,
                })(
                  <input type='hidden' />
                )}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="起始日期" required>
                {getFieldDecorator('beginDate', {
                  initialValue: infoDetail.beginDate == null ? moment(new Date()) :
                    moment(new Date(infoDetail.beginDate)),
                  rules: [{ required: true, message: '请选择起始日期' }]
                })(
                  <DatePicker placeholder="请选择起始日期" style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col lg={8}>
              <Form.Item label="结束日期" required >
                {getFieldDecorator('endDate', {
                  initialValue: infoDetail.endDate == null ? moment(new Date()) :
                    moment(new Date(infoDetail.endDate)),
                  rules: [{ required: true, message: '请选择结束日期' }]
                })(
                  <DatePicker placeholder="请选择结束日期" style={{ width: '100%' }} />
                )}
              </Form.Item></Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue: infoDetail.memo,
                  rules: [{ required: false }],
                })(
                  <Input.TextArea rows={3} ></Input.TextArea>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type='link' style={{ float: 'right', marginLeft: '1px' }}
                onClick={() => {
                  Modal.confirm({
                    title: '请确认',
                    content: `您是否确定删除？`,
                    onOk: () => {
                      if (id != null || id != "") {
                        RemoveFormUnitAll(id).then(res => {
                          message.success('删除成功！');
                        });
                      }
                    },
                  });
                }}
              >
                <Icon type="delete" />
                全部删除
              </Button>
              <Button type='link' style={{ float: 'right' }}
                onClick={() => showModal()}
              >
                <Icon type="plus" />
                添加
              </Button>
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
          <Button style={{ marginRight: 8 }} onClick={() => closeDrawer()}
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
      <AddItem
        treeData={treeData}
        visible={modalvisible}
        getReducetionItem={getReducetionItem}
        closeModal={closeModal}
      />
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);

