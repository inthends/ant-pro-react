//计费明细表 
import { Form, Card, Table, InputNumber } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect,useState } from 'react';
import moment from 'moment';
import styles from './style.less';

interface ResultListProps {
  chargeData: any[];//费用明细
  className: any;
  form: WrappedFormUtils; 
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
              message: `${title}不能为空.`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <InputNumber min={0}
            style={{ width: '100%' }}
            ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
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

  const {  form, chargeData, className } = props;

  //初始化
  useEffect(() => {
    if (chargeData) {
      //数据刷新
      setMyChargeData(chargeData);
    }
  }, [chargeData]);

  const { getFieldDecorator  } = form; 
  const [mychargeData, setMyChargeData] = useState<any[]>([]);//租金 

  const columns = [
    {
      title: '区间',
      width: 100,
      render: (text, row, index) => {
        // return moment(row.beginDate).format('YYYY-MM-DD') + " - " + moment(row.endDate).format('YYYY-MM-DD'); 
        if (row.isReduction)
          return <span>{moment(row.beginDate).format('YYYY-MM-DD') + "~" + moment(row.endDate).format('YYYY-MM-DD') + ' '}<span style={{ color: 'red', fontSize: '4px', verticalAlign: 'super' }}>免</span></span>;
        else
          return moment(row.beginDate).format('YYYY-MM-DD') + "~" + moment(row.endDate).format('YYYY-MM-DD');
      }
    },
    {
      title: '费用类型',
      dataIndex: 'feeItemName',
      key: 'feeItemName',
      width: 120,
    },
    {
      title: '付款日',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 60,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '最终单价',
      width: 60,
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
      width: 60,
      editable: true,
    },
    {
      title: '未收金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 60,
    }
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
      }
    });
  };

  getFieldDecorator('ChargeData', { initialValue: mychargeData });

  return (
    <div>

      <Card title="费用" className={className} hoverable>
        <Table
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
        />
      </Card>
    </div >
  );
}


export default ResultList;
