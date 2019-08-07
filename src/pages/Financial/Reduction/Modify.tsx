
import {
  Table,
  Select,
  Button,
  Card,
  Col, Icon,
  DatePicker,
  InputNumber,
  Drawer,
  Form,
  Input,
  Row,
  notification
} from 'antd';

import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';

import AddReductionItem from './AddReductionItem';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson, GetFeeType, GetListByID, GetReductionItem, GetUseInfo, GetUnitBillDetail, SaveForm } from './Main.service';

import moment from 'moment';

const { Option } = Select;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  reload(): void;
}


/*详情可编辑单元格*/
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
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

const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form, id, organizeId } = props;
  const { getFieldDecorator } = form;
  const title = id === undefined ? '新增减免单' : '修改减免单';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [modalvisible, setModalVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [reductionItem, setReductionItem] = useState<any[]>([]);
  const [editItemColumn, setEditItemColumn] = useState<boolean>(false);

  const [listdata, setListData] = useState<any[]>([]);

  const getSelectReduction = () => {
    GetReductionItem().then(res => {
      setReductionItem(res);
      setLoading(false);
    });
  }

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
      setLoading(true);
      setModalVisible(false);
      getSelectReduction();
      if (id) {
        getInfo(id).then((tempInfo: any) => {
          setInfoDetail(tempInfo);
          form.resetFields();
          return GetListByID(tempInfo.billID);
        }).then(res => {
          setListData(res.data);
        });
      } else {
        //重置之前选择加载的费项类别
        GetUseInfo(localStorage.getItem('userid')).then(res => {
          setInfoDetail({
            keyValue: '',
            code: 0,
            billID: guid(),
            billCode: '',
            billDate: '',
            createUserName: res.name == null ? '' : res.name,
            createUserId: res.id == null ? '' : res.id,
            rebate: "",
            reductionFeeItemID: "",
            memo: "",
            reductionAmount: ""
          })
        })
        setListData([]);
        setReductionItem([]);
        //form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);


  const showModal = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setModalVisible(true);
      }
    });
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const close = () => {
    closeDrawer();
  };

  const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  //提交编辑
  const onSave = () => {
    form.validateFields((errors, values) => {

      if (!errors) {
        GetUseInfo(localStorage.getItem('userid')).then((res) => {
          var newListData = [];
          listdata.forEach(element => {
            element.period = moment(element.period).format('YYYY-MM-DD HH:mm:ss');
            element.beginDate = moment(element.beginDate).format('YYYY-MM-DD HH:mm:ss');
            element.endDate = moment(element.endDate).format('YYYY-MM-DD HH:mm:ss');
            element.mainID = infoDetail.billID;
            newListData.push(element);
          });


          let newData = {
            keyValue: infoDetail.billID,
            code: infoDetail.billID == "" ? 0 : 1,
            billID: infoDetail.billID,
            organizeId: organizeId.organizeId,
            billCode: infoDetail.billCode,
            billDate: moment(infoDetail.billDate).format('YYYY-MM-DD HH:mm:ss'),
            rebate: infoDetail.rebate,
            reductionAmount: infoDetail.reductionAmount,
            reductionFeeItemID: infoDetail.reductionFeeItemID,
            ifVerify: false,
            /* verifyPerson:'',
             verifyDate:null,
             verifyMemo:null,*/
            createUserName: res.name == null ? '' : res.name,
            createUserId: res.id == null ? '' : res.id,
            createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            modifyUserId: res.id == null ? '' : res.id,
            modifyUserName: res.name == null ? '' : res.name,
            modifyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            status: 0,
            memo: infoDetail.memo,
            details: JSON.stringify(newListData)
          };
          /*  let newData = infoDetail ? {
              ...infoDetail,
              ...values ,
              keyValue:infoDetail.billID,
              billDate:moment(infoDetail.billDate).format('YYYY-MM-DD HH:mm:ss'),
              code:infoDetail.billID==""?0:1,
              details: JSON.stringify(newListData)} : values;*/
          SaveForm(newData);
        }).then(() => {
          closeDrawer();
        });
      }
    });
  };
  const getInfo = id => {
    if (id) {
      return GetFormJson(id).then(res => {
        const { billID,
          billCode,
          billDate,
          createUserName,
          rebate,
          reductionFeeItemID,
          memo,
          reductionAmount
        } = res || ({} as any);
        let info = {
          keyValue: billID,
          code: 1,
          billID,
          billCode,
          billDate,
          createUserName,
          rebate,
          reductionFeeItemID,
          memo,
          reductionAmount
        };
        return info;
      });
    } else {
      return Promise.resolve({
        parentId: 0,
        type: 1,
      });
    }
  };

  const columns = [
    {
      title: '单元编号',
      dataIndex: 'unitID',
      key: 'unitID',
      width: '150px',
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: '150px',

      sorter: true
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: '150px',
      sorter: true,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY年MM月')} </span>
        }
      }
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: '150px',
      sorter: true,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '150px',
      sorter: true,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '原金额',
      dataIndex: 'amount',
      key: 'amount',
      width: '150px',
      sorter: true,
    }, {
      title: '累计减免',
      dataIndex: 'sumReductionAmount',
      width: '150px',
      key: 'sumReductionAmount',
      render: val => {
        if (val == null)
          return <span>0.0</span>
        else
          return <span>{val}</span>
      }
    }, {
      title: '本次减免',
      dataIndex: 'reductionAmount',
      width: '150px',
      key: 'reductionAmount',
      editable: true,
      //onChange={(id,item)=>,
      render: val => {
        if (val == null)
          return <span>0.0</span>
        else
          return <span>{val}</span>
      }
    },
    {
      title: '减免后金额',
      dataIndex: 'lastAmount',
      width: '150px',
      key: 'lastAmount',
      render: val => {
        if (val == null)
          return <span>0.0</span>
        else
          return <span>{val}</span>
      }
    }, {
      title: '备注',
      width: '150px',
      dataIndex: 'memo',
      key: 'memo',
      editable: true
    },
  ] as ColumnProps<any>;

  const getReducetionItem = (data?) => {
    console.log(data);
    GetUnitBillDetail(data).then(res => {
      if (res.length == 0) {
        notification['warning']({
          message: '系统提示',
          description:
            '没有找到任何房屋的费项记录！'
        });
      } else {
        //去除原队列已存在数据
        for (var i = res.length - 1; i < 0; i--) {
          for (var j = 0; j < listdata.length; j++) {
            if (res[i].unitID == listdata[j].unitID) {
              var index = res.indexOf(res[i]);
              if (index > -1) {
                res.splice(index, 1);
              }
              //res.removeAt(i);
            }
          }
        }

        setListData([
          ...listdata, ...res
        ]);
        closeModal();
      }
    })
  }

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  const datacolumns = columns.map(col => {
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
  //详细表单列编辑保存
  const handleSave = row => {
    row.lastAmount = row.amount - row.reductionAmount > 0 ? row.amount - row.reductionAmount : 0;
    const newData = [...listdata];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setListData(newData);
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
        <Card bordered={false}>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="单据编号">
                {getFieldDecorator('billCode', {
                  initialValue: infoDetail.billCode,
                  rules: [{ message: '自动获取编号' }],
                })(
                  <Input disabled={true} placeholder="自动获取编号" ></Input>
                )}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="单据日期">
                {getFieldDecorator('billDate', {
                  initialValue: infoDetail.billDate == null ? '' : infoDetail.billDate
                    ? moment(new Date(infoDetail.billDate))
                    : moment(new Date()),
                  rules: [{ required: true }],
                })(
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="经办人">
                {getFieldDecorator('createUserName', {
                  initialValue: infoDetail.createUserName,
                  rules: [{ required: true, message: '请输入经办人' }],
                })(
                  <Input style={{ width: '100%' }} disabled={true}></Input>
                )}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="批量折扣">
                {getFieldDecorator('rebate', {
                  initialValue: infoDetail.rebate,
                  rules: [{ required: true, message: '请输入批量折扣' }],
                })(
                  <InputNumber step={0.1} style={{ width: '100%' }}></InputNumber>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={12}>
              <Form.Item label="减免金额">
                {getFieldDecorator('reductionAmount', {
                  initialValue: infoDetail.reductionAmount,
                  rules: [{ required: true, message: '请输入减免金额' }],
                })(
                  <InputNumber step={0.1} style={{ width: '100%' }}></InputNumber>
                )}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item label="减免费项">
                {getFieldDecorator('reductionFeeItemID', {
                  initialValue: infoDetail.reductionFeeItemID,
                  rules: [{ required: true, message: '请选择减免项目' }],
                })(
                  <Select placeholder="==请选择减免项目==">
                    {/* {buildOption(reductionItem)} */}

                    {reductionItem.map(item => (
                      <Option key={item.key} value={item.value}>
                        {item.title}
                      </Option>
                    ))}

                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue: infoDetail.memo,
                  rules: [{ required: false }],
                })(
                  <Input.TextArea rows={4} ></Input.TextArea>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} style={{ marginTop: '5px' }}>
          <Row>
            <Col>
              <Button style={{ float: 'right', marginLeft: 8 }}>
                <Icon type="delete" />
                删除
              </Button>
              <Button type="primary" style={{ float: 'right' }}
                onClick={() => showModal()}
              >
                <Icon type="plus" />
                添加
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Table
              components={components}
              bordered={false}
              size="middle"
              dataSource={listdata}
              columns={datacolumns}
              rowKey={record => record.id}
              pagination={pagination}
              scroll={{ x: 1500, y: 500 }}
              loading={loading}
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
      <AddReductionItem
        visible={modalvisible}
        getReducetionItem={getReducetionItem}
        closeModal={closeModal}
      />
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);

