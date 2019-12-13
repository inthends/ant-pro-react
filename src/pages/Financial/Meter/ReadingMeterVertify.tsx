//抄表单审核
import { Spin, Tabs, Card, Table, Button, Col, Drawer, Form, Row, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { DefaultPagination } from '@/utils/defaultSetting';
import React, { useEffect, useState } from 'react';
import { Audit, GetMeterRead, GetVirtualReadPageList, GetPublicReadPageList, GetUnitReadPageList } from './Meter.service';
import styles from './style.less';
import moment from 'moment';
const { TabPane } = Tabs;
const { TextArea } = Input;
const Search = Input.Search;

interface ReadingMeterVertifyProps {
  vertifyVisible: boolean;
  ifVertify: boolean;
  closeVertify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const ReadingMeterVertify = (props: ReadingMeterVertifyProps) => {
  const { vertifyVisible, closeVertify, form, id, ifVertify, reload } = props;
  const title = ifVertify ? '抄表单取消审核' : '抄表单审核';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});

  const [houseSearch, setHouseSearch] = useState<string>('');//查询关键字
  const [houseLoading, setHouseLoading] = useState<boolean>(false);
  const [houseData, setHouseData] = useState<any>();
  const [housePagination, setHousePagination] = useState<DefaultPagination>(new DefaultPagination());

  const [publicSearch, setPublicSearch] = useState<string>('');
  const [publicLoading, setPublicLoading] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<any>();
  const [publicPagination, setPublicPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [virtualSearch, setVirtualSearch] = useState<string>('');
  const [virtualLoading, setVirtualLoading] = useState<boolean>(false);
  const [virtualData, setVirtualData] = useState<any>();
  const [virtualPagination, setVirtualPagination] = useState<DefaultPagination>(new DefaultPagination());


  useEffect(() => {
    if (vertifyVisible) {
      form.resetFields();
      if (id != null && id != '') {
        setLoading(true);
        GetMeterRead(id).then(res => {
          setInfoDetail(res);
          //明细数据初始化
          initHouseLoadData(houseSearch);
          initPublicLoadData(publicSearch);
          initVirtualLoadData(virtualSearch);
          setLoading(false);
        })
      } else {
        setInfoDetail({});
        setLoading(false);
      }
    }
  }, [vertifyVisible]);

  const close = () => {
    closeVertify(false);
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        let newData = {
          keyValue: infoDetail.billId,
          BillId: infoDetail.billId,
          OrganizeId: infoDetail.organizeId,
          BillCode: infoDetail.billCode,
          BatchCode: infoDetail.batchCode,
          MeterCode: infoDetail.meterCode,
          ReadDate: infoDetail.readDate,
          EndReadDate: infoDetail.endReadDate,
          Memo: infoDetail.memo,
          MeterReader: infoDetail.meterReader,
          IfVerify: !infoDetail.ifVertify,
          VerifyDate: ifVertify ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : moment(values.verifyDate).format('YYYY-MM-DD HH:mm:ss'),
          VerifyMemo: values.verifymemo
        };
        Audit(newData).then(() => {
          setLoading(false);
          closeVertify(true);
          reload();
        });
      }
    });
  };

  const publicFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterkind',
      key: 'meterkind',
      width: 60,
      sorter: false
    },
    {
      title: '表名称',
      dataIndex: 'metername',
      key: 'metername',
      width: 120,
      sorter: false
    },
    {
      title: '表编号',
      dataIndex: 'metercode',
      key: 'metercode',
      width: 150,
      sorter: false,
    },
    {
      title: '上次读数',
      dataIndex: 'lastreading',
      key: 'lastreading',
      width: 100,
      sorter: false,
    },
    {
      title: '本次读数',
      dataIndex: 'nowreading',
      key: 'nowreading',
      sorter: false,
      width: 100
    },
    {
      title: '倍率',
      dataIndex: 'meterzoom',
      key: 'meterzoom',
      sorter: false,
      width: 60
    },
    {
      title: '用量',
      dataIndex: 'baseusage',
      key: 'baseusage',
      sorter: false,
      width: 100
    },
    {
      title: '单价',
      dataIndex: 'meterprice',
      key: 'meterprice',
      sorter: false,
      width: 100
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      width: 100
    },
    {
      title: '录入人',
      dataIndex: 'createusername',
      key: 'createusername',
      sorter: false,
      width: 80
    },
    {
      title: '录入时间',
      dataIndex: 'createdate',
      key: 'createdate',
      sorter: false,
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      sorter: false,
      width: 100
    }
  ] as ColumnProps<any>[];


  const houseFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterType',
      key: 'meterType',
      width: 60,
      sorter: false
    },
    {
      title: '表名称',
      dataIndex: 'meterName',
      key: 'meterName',
      width: 80,
      sorter: false
    },
    {
      title: '表编号',
      dataIndex: 'meterCode',
      key: 'meterCode',
      width: 140,
      sorter: false,
    },
    {
      title: '上次读数',
      dataIndex: 'lastReading',
      key: 'lastReading',
      width: 80,
      sorter: false,
    },
    {
      title: '本次读数',
      dataIndex: 'nowReading',
      key: 'nowReading',
      sorter: false,
      width: 100,
    },
    {
      title: '倍率',
      dataIndex: 'meterZoom',
      key: 'meterZoom',
      sorter: false,
      width: 60
    },
    {
      title: '用量',
      dataIndex: 'baseUsage',
      key: 'baseUsage',
      sorter: false,
      width: 80
    },
    {
      title: '单价',
      dataIndex: 'meterPrice',
      key: 'meterPrice',
      sorter: false,
      width: 80
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      width: 80
    },
    {
      title: '录入人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      sorter: false,
      width: 60
    },
    {
      title: '录入时间',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: false,
      width: 130
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      sorter: false,
      width: 100,
    }
  ] as ColumnProps<any>[];

  const virtualFeeColumns = [
    {
      title: '种类',
      dataIndex: 'meterkind',
      key: 'meterkind',
      width: 200,
      sorter: true
    },
    {
      title: '表名称',
      dataIndex: 'metertype',
      key: 'metertype',
      width: 200,
      sorter: true
    },
    {
      title: '表编号',
      dataIndex: 'metercode',
      key: 'metercode',
      width: 200,
      sorter: true,
    },
    {
      title: '计算公式',
      dataIndex: 'formula',
      key: 'formula',
      sorter: true,
      width: 200
    },
    {
      title: '录入人',
      dataIndex: 'createusername',
      key: 'createusername',
      sorter: true,
      width: 200
    },
    {
      title: '录入时间',
      dataIndex: 'createdate',
      key: 'createdate',
      sorter: true,
      width: 200
    }
  ] as ColumnProps<any>[];


  //房屋费表初始化
  const initHouseLoadData = (search) => {
    const queryJson = {
      keyword: search,
      keyValue: id
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = housePagination;
    return houseload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadHouseData = (searchText, paginationConfig?: PaginationConfig, sorter?) => {
    setHouseSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: housePagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        keyValue: id
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return houseload(searchCondition).then(res => {
      return res;
    });
  };

  //加载数据
  const houseload = data => {
    setHouseLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetUnitReadPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setHousePagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setHouseData(res.data);
      setHouseLoading(false);
      return res;
    });
  };


     //公共
  const initPublicLoadData = (search) => {
    const queryJson = {
      keyword: search,
      keyValue: id
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = publicPagination;
    return publicload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadPublicData = (searchText, paginationConfig?: PaginationConfig, sorter?) => {
    setPublicSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: publicPagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        keyValue: id
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return publicload(searchCondition).then(res => {
      return res;
    });
  };

  const publicload = data => {
    setPublicLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetPublicReadPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPublicPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setPublicData(res.data);
      setPublicLoading(false);
      return res;
    });
  };

  //虚拟表
  const initVirtualLoadData = (search) => {
    const queryJson = {
      keyword: search,
      keyValue: id
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = virtualPagination;
    return virtualload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadVirtualData = (searchText, paginationConfig?: PaginationConfig, sorter?) => {
    setVirtualSearch(searchText);//查询的时候，必须赋值，否则查询条件会不起作用 
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: virtualPagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        keyValue: id
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return virtualload(searchCondition).then(res => {
      return res;
    });
  };

  const virtualload = data => {
    setVirtualLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetVirtualReadPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setVirtualPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setVirtualData(res.data);
      setVirtualLoading(false);
      return res;
    });
  };



  return (
    <Drawer
      className="offsetVertify"
      title={title}
      placement="right"
      width={880}
      onClose={close}
      visible={vertifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs >
            <TabPane tab="基础信息" key="1">
              <Card className={styles.Card} >
                <Row gutter={12}>
                  <Col span={8}>
                    <Form.Item required={true} label="抄表单号"  >
                      {infoDetail.billCode}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item required={true} label="单据日期">
                      {String(infoDetail.readDate).substr(0, 10)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item required={true} label="抄表月份" >
                      {String(infoDetail.meterCode).substr(0, 7)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={8}>
                    <Form.Item required={true} label="抄表人">
                      {infoDetail.meterReader}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item required={true} label="结束抄表日期"  >
                      {String(infoDetail.endReadDate).substr(0, 10)}

                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item required={true} label="结束标识"  >
                      {infoDetail.batchCode}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item required={true} label="抄表说明">
                      {infoDetail.memo}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>
            <TabPane tab="房屋费表" key="2">
              <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                <Search
                  className="search-input"
                  placeholder="请输入要查询的费表编号"
                  style={{ width: 200 }}
                  onSearch={value => loadHouseData(value)}
                />
              </div>
              <Table
                onChange={(paginationConfig, filters, sorter) => {
                  loadHouseData(houseSearch, paginationConfig, sorter)
                }}
                bordered={false}
                size="middle"
                columns={houseFeeColumns}
                dataSource={houseData}
                rowKey="id"
                pagination={housePagination}
                scroll={{ y: 500, x: 1300 }}
                loading={houseLoading}
              />
            </TabPane>
            <TabPane tab="公用费表" key="3">
              <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                <Search
                  className="search-input"
                  placeholder="请输入要查询的费表编号"
                  style={{ width: 200 }}
                  onSearch={value => loadPublicData(value)}
                />
              </div>

              <Table
                onChange={(paginationConfig, filters, sorter) => {
                  loadPublicData(publicSearch, paginationConfig, sorter)
                }}
                bordered={false}
                size="middle"
                columns={publicFeeColumns}
                dataSource={publicData}
                rowKey="id"
                pagination={publicPagination}
                scroll={{ y: 500, x: 1620 }}
                loading={publicLoading}
              />
            </TabPane>

            <TabPane tab="虚拟费表" key="4">
              <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                <Search
                  className="search-input"
                  placeholder="请输入要查询的费表编号"
                  style={{ width: 200 }}
                  onSearch={value => loadVirtualData(value)}
                />
              </div>
              <Table<any>
                onChange={(paginationConfig, filters, sorter) => {
                  loadVirtualData(virtualSearch, paginationConfig, sorter)
                }}
                bordered={false}
                size="middle"
                columns={virtualFeeColumns}
                dataSource={virtualData}
                rowKey="id"
                pagination={virtualPagination}
                scroll={{ y: 500, x: 1620 }}
                loading={virtualLoading}
              />
            </TabPane>
          </Tabs>
          <Row>
            <Col >
              <Form.Item label="审核情况" >
                {getFieldDecorator('verifymemo', {
                  initialValue: infoDetail.verifymemo
                })(
                  < TextArea rows={4}
                    placeholder='请输入审核情况'
                  > </ TextArea >
                )}
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </Form>
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
        <Button style={{ marginRight: 8 }}
          onClick={() => closeVertify()}
        >
          取消
            </Button>
        <Button type="primary"
          onClick={() => onSave()}
        >
          提交
            </Button>
      </div>
    </Drawer >
  );
};

export default Form.create<ReadingMeterVertifyProps>()(ReadingMeterVertify);

