//计费明细表 
import { Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react'; 
import moment from 'moment'; 
import styles from './style.less';

interface ResultListProps {  
  depositData: any[]; 
  chargeData: any[]; 
}

function ResultList(props: ResultListProps) {
  const { depositData , chargeData} = props;
  const columns = [
    {
      title: '区间', 
      width: 100,
      render: (text, row, index) => {   
        return moment(row.startDate).format('YYYY-MM-DD') + " - " +  moment(row.endDate).format('YYYY-MM-DD');
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
      dataIndex: 'payDate',
      key: 'payDate',
      width: 60,
      render: val =>  moment(val).format('YYYY-MM-DD')
    },
    {
      title: '最终单价(元)', 
      width: 60,
      render: (text, row, index) => {   
        let unit='';
        if(row.priceUnit=="1")
          unit = '元/m²·月';
        else if(row.priceUnit=="2")
          unit = '元/m²·天';
        else if(row.priceUnit=="3")
          unit = '元/月';
        else  
          unit = '元/天'; 

        if(row.price)  
           return row.price+' '+unit;
        else
        return '';
      }
    },
    {
      title: '最终金额(元)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 60,
    }
  ] as ColumnProps<any>[];

  return (
    <div>
      <Card title="保证金" className={styles.card} >
        <Table
          style={{ border: 'none' }}
          bordered={false}
          size="middle"
          columns={columns}
          dataSource={depositData} />
      </Card> 
      <Card title="租金" className={styles.addcard} >
        <Table
          style={{ border: 'none' }}
          bordered={false}
          size="middle"
          columns={columns}
          dataSource={chargeData} 
          />
      </Card>
    </div>
  );
}

export default ResultList;
