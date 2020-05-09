//查看
import { Tag, Divider, PageHeader, Table, Card, Button, Col, Drawer, Form, Row, Input, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetPageDetailListJson, GetBilling } from './Main.service';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import styles from './style.less';
import moment from 'moment';
const Search = Input.Search;

interface ShowProps {
  visible: boolean;
  close(result?): void;
  form: WrappedFormUtils;
  id?: string;
}

// interface SearchParam {
//   // condition: 'EnCode' | 'FullName';
//   keyword: string;
// };

const Show = (props: ShowProps) => {
  const { visible, close, form, id } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [unitFeeData, setUnitFeeData] = useState<any>();
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());
  // const [search, setSearch] = useState<SearchParam>({
  //   // condition: 'EnCode',
  //   keyword: '',
  // });
  const [search, setSearch] = useState<any>('');

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (id != null && id != '') {
        setLoading(true);
        GetBilling(id).then(res => {
          setInfoDetail(res);
          //initUnitFeeLoadData('');
          initLoadData();
          setLoading(false);
        })
      } else {
        setInfoDetail({});
        setUnitFeeData([]);
        setLoading(false);
      }
    }
  }, [visible]);

  const doclose = () => {
    close(false);
  };

  // const initUnitFeeLoadData = (searchText) => {
  //   const queryJson = {
  //     billId: id == null || id == '' ? '' : id,
  //     keyword: searchText,
  //   };
  //   const sidx = 'id';
  //   const sord = 'asc';
  //   const { current: pageIndex, pageSize, total } = pagination;
  //   return load({ pageIndex, pageSize, sidx, sord, total, queryJson });
  // };

  // const unitFeeload = data => {
  //   data.sidx = data.sidx || 'id';
  //   data.sord = data.sord || 'asc';
  //   return GetPageDetailListJson(data).then(res => {
  //     const { pageIndex: current, total, pageSize } = res;
  //     setPagination(pagesetting => {
  //       return {
  //         ...pagesetting,
  //         current,
  //         total,
  //         pageSize,
  //       };
  //     });
  //     setUnitFeeData(res.data);
  //     return res;
  //   });
  // };

  //初始化
  // const initLoadData = (searchParam: SearchParam) => {
  const initLoadData = () => {
    // setSearch(searchParam);
    // const queryJson = searchParam;
    const queryJson = {
      billId: id
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'id';
    formData.sord = formData.sord || 'asc';
    return GetPageDetailListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setUnitFeeData(res.data);
      setLoading(false);
      return res;
    });
  };


  //刷新
  const loadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };

    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      // queryJson: searchParam,
      queryJson: {
        billId: id,
        keyword: search
      }
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  // const changePage = (pagination: PaginationConfig, filters, sorter) => {
  //   loadData(pagination, sorter);
  // };

  //转换状态
  const GetStatus = (ifVerify) => {
    if (ifVerify)
      return <Tag color="#61c33a">已审核</Tag>;
    else
      return <Tag color="#d82d2d">待审核</Tag>;
  }

  const columns = [
    // {
    //   title: '计费单号',
    //   dataIndex: 'billCode',
    //   key: 'billCode',
    //   width: 150,
    //   sorter: true
    // },
    {
      title: '房产编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 140,
      sorter: true
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 150,
      sorter: true,
    },
    // {
    //   title: '应收期间',
    //   dataIndex: 'period',
    //   key: 'period',
    //   width: 100,
    //   sorter: true,
    //   render: val => val ? moment(val).format('YYYY年MM月') : '' 
    // },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      sorter: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      width: 80
    },

    {
      title: '金额',
      key: 'amount',
      dataIndex: 'amount',
      sorter: true,
      width: 100
    },

    {
      title: '计费起始日期',
      key: 'beginDate',
      dataIndex: 'beginDate',
      sorter: true,
      width: 120,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '计费截止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      sorter: true,
      width: 120,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '周期',
      key: 'cycleValue',
      dataIndex: 'cycleValue',
      sorter: true,
      width: 80
    },
    {
      title: '周期单位',
      key: 'cycleType',
      dataIndex: 'cycleType',
      sorter: true,
      width: 100
    },
    {
      title: '单元全称',
      key: 'allName',
      dataIndex: 'allName',
      width: 320
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      // className="offsetVerify"
      title='查看计费单'
      placement="right"
      width={850}
      onClose={close}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.billCode}</label>
          </div>
        }
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}  >
        <Form layout='vertical'>
          <Row gutter={6}>
            <Col lg={6}>
              <Form.Item label="单据时间" >
                {infoDetail.billDate}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="计费人" >
                {infoDetail.createUserName}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="审核状态" >
                {GetStatus(infoDetail.ifVerify)}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="审核人" >
                {infoDetail.verifyPerson ? infoDetail.verifyPerson : ''}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item label="审核时间" >
                {infoDetail.verifyDate  }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="备注">
                {infoDetail.memo}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider dashed />
        {infoDetail.verifyMemo}
      </PageHeader>
      <Divider dashed />
      <Card className={styles.card} >
        <Spin tip="数据处理中..." spinning={loading}>
          <Row>
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单元编号"
                style={{ width: 200 }}
                //onSearch={(value) => {
                // var params = Object.assign({}, meterSearchParams, { search: value })
                // setMeterSearchParams(params);
                //initUnitFeeLoadData(value);
                //}} 
                // onSearch={keyword => loadData({ ...search, keyword })}
                onSearch={value => loadData(value)}
              />
            </div>
            <Table
              bordered={false}
              size="middle"
              columns={columns}
              dataSource={unitFeeData}
              rowKey="unitmeterid"
              pagination={pagination}
              scroll={{ y: 500, x: 1800 }}
              loading={loading}
              // onChange={onchange} 
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                loadData(search, pagination, sorter)
              }
            />
          </Row>
        </Spin>
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
          onClick={() => doclose()}
        >
          关闭
        </Button>
        {/* <Button type="primary"
          onClick={onSave}
        >
          提交
        </Button> */}
      </div>
    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show);

