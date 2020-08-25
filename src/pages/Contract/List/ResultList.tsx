//计费明细表 
import { Popconfirm, DatePicker, Form, Table, InputNumber } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import styles from './style.less';

interface ResultListProps {
  chargeData: any[];//费用明细
  className: any;
  form: WrappedFormUtils;
  index: any;
}

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
      handleSave({ ...record, ...values }, record.totalPrice);
    });
  };

  //保存日期
  saveDate = (dateString, dataIndex) => {

    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[dataIndex]) {
        return;
      }
      this.toggleEdit();
      record[dataIndex] = dateString;
      handleSave({ ...record }, record.totalPrice);
    });
  };

  renderCell = form => {
    var _this = this;
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (

      title == '金额' ?
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `${title}不能为空.`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <InputNumber min={0}
              style={{ width: '100%' }}
              ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
          )}
        </Form.Item> :

        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `${title}不能为空`,
              },
            ],
            initialValue: moment(record[dataIndex]),
          })(
            <DatePicker
              ref={node => (this.input = node)}
              style={{ width: '100%' }}
              onChange={(date, datestring) => this.saveDate(datestring, dataIndex)}
            />
          )}
        </Form.Item>


    ) : (
        <div
          className={styles.editablecellvaluewrap}
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

function ResultList(props: ResultListProps) {

  const { index, form, chargeData } = props;

  //初始化
  // useEffect(() => { 
  //   if (chargeData)
  //     //数据刷新
  //     setMyChargeData(chargeData);
  // }, [chargeData]);

  useEffect(() => {
    setMyChargeData(chargeData);
  }, [chargeData]);

  const { getFieldDecorator } = form;
  const [mychargeData, setMyChargeData] = useState<any[]>([]);//租金 

  const columns = [
    // {
    //   title: '区间',
    //   width: 100,
    //   render: (text, row, index) => {
    //     // return moment(row.beginDate).format('YYYY-MM-DD') + " - " + moment(row.endDate).format('YYYY-MM-DD'); 
    //     if (row.isReduction)
    //       return <span>{moment(row.beginDate).format('YYYY-MM-DD') + "~" + moment(row.endDate).format('YYYY-MM-DD') + ' '}<span style={{ color: 'red', fontSize: '4px', verticalAlign: 'super' }}>免</span></span>;
    //     else
    //       return moment(row.beginDate).format('YYYY-MM-DD') + "~" + moment(row.endDate).format('YYYY-MM-DD');
    //   },
    // }, 

    {
      title: '起始日期',
      width: 105,
      dataIndex: 'beginDate',
      align: 'center',
      render: (text, row, index) => {
        return moment(row.beginDate).format('YYYY-MM-DD')
      },
      editable: true,
    },

    {
      title: '截至日期',
      width: 105,
      dataIndex: 'endDate',
      align: 'center',
      render: (text, row, index) => {
        return moment(row.endDate).format('YYYY-MM-DD')
      },
      editable: true,
    },

    {
      title: '费用类型',
      dataIndex: 'feeItemName',
      key: 'feeItemName',
      width: 90,
      render: (text, record) => {
        if (record.isReduction)
          return <span>{text + ' '}<span style={{ color: 'red', fontSize: '4px', verticalAlign: 'super' }}>免</span></span>;
        else
          return text;
      }
    },
    {
      title: '付款日',
      dataIndex: 'deadline',
      align: 'center',
      key: 'deadline',
      width: 105,
      editable: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '最终单价',
      width: 90,
      render: (text, row, index) => {
        return row.price + row.priceUnit;
        // let unit = '';
        // if (row.priceUnit == "1")
        //   unit = '元/m²·月';
        // else if (row.priceUnit == "2")
        //   unit = '元/m²·天';
        // else if (row.priceUnit == "3")
        //   unit = '元/月';
        // else
        //   unit = '元/天';

        // if (row.price)
        //   return row.price + unit;
        // else
        //   return '';
      }
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'center',
      width: 80,
      editable: true,
    },
    {
      title: '未收金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 60,
    },
    {
      title: '操作',
      dataIndex: '操作',
      width: 40,
      render: (text, record) =>
        mychargeData.length >= 1 ? (
          <Popconfirm title="确定删除?"
            onConfirm={() => handleDelete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },


  ] as ColumnProps<any>[];


  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };


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

  const handleDelete = id => {
    const newData = [...mychargeData];
    var data = newData.filter(item => item.id !== id);
    setMyChargeData(data);
    //更新费用
    form.setFieldsValue({ ['chargeData[' + index + ']']: data });
  };

  //金额编辑
  const handleSave = (row, oldvalue) => {
    form.validateFields((errors, values) => {
      if (!errors) {
        row.lastAmount = row.lastAmount - (oldvalue - row.totalPrice);
        const newData = [...mychargeData];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setMyChargeData(newData);
        //更新费用
        form.setFieldsValue({ ['chargeData[' + index + ']']: newData });
      }
    });
  };

  getFieldDecorator('ChargeData', { initialValue: mychargeData });


  //获取金额合计 
  const getTotal = () => {
    if (mychargeData) {

      var totalAmount = 0;
      var lastAmount = 0;
      mychargeData.map(item => {
        
        totalAmount = mychargeData.reduce((sum, row) => { return sum + row.totalPrice; }, 0);

        if (!item.isReduction) {
          lastAmount = mychargeData.reduce((sum, row) => { return sum + row.totalPrice; }, 0);
        }

      });


      return <a>{'金额合计：' + totalAmount.toFixed(2) + '，未收金额合计：' + lastAmount.toFixed(2)}</a>;
    }
    else {
      return '';
    }
  }

  return (
    // <div> 
    //   <Card title="费用" className={className} hoverable>
    <Table

      title={getTotal}
      components={components}
      rowClassName={styles.editablerow}
      // rowClassName={() => 'editable-row'}
      style={{ border: 'none' }}
      bordered={false}
      size="middle"
      rowKey="id"
      // columns={columns}
      columns={eidtColumns}
      dataSource={mychargeData}

    // summary={() => (
    //   <Table.Summary.Row>
    //     <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
    //     <Table.Summary.Cell index={1}>This is a summary content</Table.Summary.Cell>
    //   </Table.Summary.Row>
    // )}


    />
    //   </Card>
    // </div >
  );
}


export default ResultList;
