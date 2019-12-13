//添加编辑费项
import { Card, Button, DatePicker, Col, Modal, Drawer, Form, Row, Icon, Spin, Input, message, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
  SaveForm, GetPageDetailListJson, GetBilling,
  RemoveUnitForm, RemoveUnitFormAll, SaveMain
} from './BillingMain.service';
import styles from './style.less';
import moment from 'moment';
import SelectHouse from './SelectHouse';
const Search = Input.Search;
const { TextArea } = Input;

/*详情可编辑单元格*/
const EditableContext = React.createContext('');
const EditableRow = ({ form, index, ...props }: any) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    var _this = this;
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={_this.toggleEdit}
        >
          {children}
        </div>
      );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

interface ModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  isEdit: boolean;
  reload(): void;
  treeData: any[];
};

const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form, id, reload, isEdit, treeData } = props;
  const title = id == undefined ? '新增计费单' : '修改计费单';
  const [newId, setNewId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [feeKinds, setFeeKinds] = useState<any>([]);
  // const [feeTypes, setFeeTypes] = useState<any>([]);
  // const [orgTreeData, setOrgTreeData] = useState<any>({});
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [unitFeeSearchParams, setUnitFeeSearchParams] = useState<any>({});
  // const [unitFeeLoading, setUnitFeeLoading] = useState<boolean>(false);
  const [unitFeeData, setUnitFeeData] = useState<any>();
  const [unitFeePagination, setUnitFeePagination] = useState<DefaultPagination>(new DefaultPagination());

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  // const [isAdd, setIsAdd] = useState<boolean>(true);
  useEffect(() => {
    if (modifyVisible) {
      form.resetFields();
      if (id != null && id != '') {
        // setIsAdd(false);
        setLoading(true);
        GetBilling(id).then(res => {
          setInfoDetail(res);
          initUnitFeeLoadData('');
          setLoading(false);
        });
      } else {
        form.resetFields();
        setInfoDetail({});
        setUnitFeeData([]);
        setLoading(false);
      }
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };

  const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const initUnitFeeLoadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setUnitFeeSearchParams(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: unitFeePagination.pageSize,
      total: 0,
    };

    // const queryJson = {
    //   billId: id == null || id == '' ? newId : id,//新增时候处理
    //   keyword: searchText,
    // };
    // const sidx = 'id';
    // const sord = 'asc';

    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        billId: id == null || id == '' ? newId : id,//新增时候处理
        keyword: search
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return unitFeeload(searchCondition);
    //return unitFeeload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const unitFeeload = data => {
    setLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetPageDetailListJson(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setUnitFeePagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      //console.log(res);
      setUnitFeeData(res.data);
      setLoading(false);
      return res;
    });
  };
  const [feeDetail, setFeeDetail] = useState<any>({});
  //添加费项房屋
  const checkEntity = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let guid = getGuid();
        var feeEntity = {
          keyValue: (id == null || id == '') ? guid : id,
          // BillId: id == null || id == '' ? guid : id,
          BillSource: '计算周期费',
          BillDate: moment(values.billDate).format('YYYY-MM-DD'),
          LinkId: '',
          IfVerify: values.ifVerify == "未审核" ? false : true,
          Status: 0,
          Memo: values.memo
        };

        //设置新id
        setNewId(feeEntity.keyValue);
        setFeeDetail(
          feeEntity
        );

        //console.log(feeEntity);
        setSelectHouseVisible(true);
      }
    });
  };
  const columns = [
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 140,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100,
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY年MM月');
        }
      }
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 80
    },
    {
      title: '周期',
      key: 'cycleValue',
      dataIndex: 'cycleValue',
      width: 80
    },
    {
      title: '周期单位',
      key: 'cycleType',
      dataIndex: 'cycleType',
      width: 100
    },
    {
      title: '金额',
      key: 'amount',
      dataIndex: 'amount',
      width: 100,
      editable: true
    },
    {
      title: '起始日期',
      key: 'beginDate',
      dataIndex: 'beginDate',
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
      title: '终止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      width: 120,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 100,
      editable: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 70,
      render: (text, record) => {
        return [
          isEdit ?
            <span>
              <a onClick={() => {
                RemoveUnitForm(record.id).then(res => {
                  initUnitFeeLoadData(unitFeeSearchParams);
                })
              }} key="delete">删除</a>
            </span> : <span></span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  const eidtColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });


  const handleSave = row => {
    form.validateFields((errors, values) => {
      if (!errors) {
        var newData = {
          id: row.id,
          amount: row.amount,
          memo: row.memo
        };
        SaveForm(newData).then((res) => {
          const newData = [...unitFeeData];
          const index = newData.findIndex(item => row.id === item.id);
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setUnitFeeData(newData);
        });
      }
    });
  };

  // const [houseFeeItemId, setHouseFeeItemId] = useState<string>('');
  const closeSelectHouse = () => {
    setSelectHouseVisible(false);
  };

  // const [isFormula, setIsFormula] = useState<boolean>(false);
  return (
    <Drawer
      title={title}
      placement="right"
      width={750}
      onClose={close}
      visible={modifyVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card className={styles.card} >
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据处理中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="计费单号">
                  {getFieldDecorator('billCode', {
                    initialValue: infoDetail.billCode,
                  })(
                    <Input readOnly placeholder="自动获取编号" />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="单据日期"  >
                  {getFieldDecorator('billDate', {
                    initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                    rules: [{ required: true, message: '请选择单据日期' }],
                  })(
                    <DatePicker disabled={!isEdit} />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="计费人"  >
                  {getFieldDecorator('createUserName', {
                    initialValue: infoDetail.createUserName ? infoDetail.createUserName : localStorage.getItem("name"),
                  })(
                    <Input readOnly />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="状态"   >
                  {getFieldDecorator('ifVerify', {
                    initialValue: infoDetail.ifVerify == null || !infoDetail.ifVerify ? '未审核' : '已审核',
                  })(
                    <Input readOnly></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核人"  >
                  {getFieldDecorator('verifyPerson', {
                    initialValue: infoDetail.verifyPerson,
                  })(
                    <Input readOnly placeholder="自动获取" />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核日期"   >
                  {getFieldDecorator('verifyDate', {
                    initialValue: infoDetail.verifyDate == null ? '' : infoDetail.verifyDate,
                  })(
                    <Input readOnly placeholder="自动获取" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo
                  })(
                    <TextArea disabled={!isEdit} rows={3} placeholder="请输入备注" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                <Search
                  className="search-input"
                  placeholder="请输入要查询的单元编号"
                  style={{ width: 200 }}
                  onSearch={(value) => {
                    var params = Object.assign({}, unitFeeSearchParams, { search: value })
                    setUnitFeeSearchParams(params);
                    initUnitFeeLoadData('');
                  }}
                />
                <Button type="link" style={{ float: 'right' }} disabled={!isEdit}
                  onClick={() => {
                    Modal.confirm({
                      title: '请确认',
                      content: `您是否确定删除？`,
                      onOk: () => {
                        const billId = id == null || id == '' ? newId : id;//新增时候处理
                        //if (id != null || id != "") {
                        RemoveUnitFormAll(billId).then(res => {
                          message.success('删除成功');
                          initUnitFeeLoadData('');
                        });

                        //}
                        /*else if(newId != null || newId != ""){
                          RemoveUnitFormAll(newId).then(res => {
                            message.success('删除成功！');
                            initUnitFeeLoadData();
                          });
                        }*/
                      },
                    });
                  }}
                >
                  <Icon type="delete" />
                  全部删除
              </Button>
                <Button type="link" style={{ float: 'right' }} disabled={!isEdit}
                  onClick={() => {
                    checkEntity();
                  }}
                >
                  <Icon type="plus" />
                  添加
              </Button>
              </div>
              <div style={{ color: 'rgb(255,0,0)' }}>点击金额列和备注列可以编辑，编辑完按回车保存。</div>
              <Table<any>
                components={components}
                onChange={(paginationConfig, filters, sorter) => {
                  initUnitFeeLoadData('', paginationConfig, sorter)
                }
                }
                bordered={false}
                size="middle"
                columns={eidtColumns}
                dataSource={unitFeeData}
                rowKey="id"
                pagination={unitFeePagination}
                scroll={{ y: 500, x: 1200 }}
              // loading={loading}
              />
            </Row>
          </Spin>
        </Form>
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 999,
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
          onClick={() => {
            form.validateFields((errors, values) => {
              if (!errors) {
                let guid = getGuid();
                var keyValue = "";
                var type = 1;
                if (id == null || id == '') {
                  if (newId == null && newId == '') {
                    keyValue = guid;
                  } else {
                    keyValue = newId;
                    type = 0;
                  }
                } else {
                  if (newId == null && newId == '') {
                    keyValue = guid;
                  } else {
                    keyValue = id;
                    type = 0;
                  }
                }

                // var feeEntity = {
                //   keyValue: keyValue,//id == null || id == '' ? guid : id,
                //   //BillId:'',// id == null || id == '' ? guid : id,
                //   BillSource: '计算周期费',
                //   BillDate: moment(values.billDate).format('YYYY-MM-DD'),
                //   LinkId: '',
                //   IfVerify: values.ifVerify == "未审核" ? false : true,
                //   Status: 0,
                //   BillCode: values.billCode,
                //   type: type,
                //   Memo: values.memo
                // }

                //赋值
                const newData = infoDetail ? { ...infoDetail, ...values } : values;
                newData.keyValue = keyValue;
                newData.billDate = moment(newData.billDate).format('YYYY-MM-DD');
                newData.ifVerify = newData.ifVerify == "未审核" ? false : true;
                newData.type = type;
                SaveMain(newData).then(() => {
                  closeDrawer();
                  reload();
                });
              }
            })
          }}
        >
          确定
        </Button>
      </div>
      <SelectHouse
        visible={selectHouseVisible}
        closeModal={closeSelectHouse}
        feeDetail={feeDetail}
        treeData={treeData}
        getBillID={(billid) => {
          setLoading(true);
          setNewId(billid);
          GetBilling(billid).then(res => {
            if (res != null) {
              message.success('添加成功！');
              setInfoDetail(res);
              initUnitFeeLoadData('');
              setLoading(false);
            } else {
              message.warning('添加失败！');
              setNewId('');
            }
          });
        }}
      />
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);

