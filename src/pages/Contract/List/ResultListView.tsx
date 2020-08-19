//计费明细表，查看 
import {  Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';

interface ResultListViewProps {
  chargeData: any[];//费用明细
  className: any;
}

function ResultListView(props: ResultListViewProps) {
  const { chargeData } = props;
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
      // render: (text, record) => {
      //   if (record.isReduction)
      //     return <span>{text + ' '}<span style={{ color: 'red', fontSize: '4px', verticalAlign: 'super' }}>免</span></span>;
      //   else
      //     return text;
      // }
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
    },
    {
      title: '未收金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 60,
    }
  ] as ColumnProps<any>[];

   //获取金额合计 
   const getTotal = () => {
    if (chargeData) { 
      var lastAmount = 0;
      chargeData.map(item => {
        lastAmount = chargeData.reduce((sum, row) => { return sum + row.lastAmount; }, 0);
      });  
      return <a>{'未收金额合计：' + lastAmount.toFixed(2)}</a>;
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
      style={{ border: 'none' }}
      bordered={false}
      size="middle"
      rowKey="id"
      columns={columns}
      dataSource={chargeData}
    />
    //   </Card>
    // </div >
  );
}


export default ResultListView;
