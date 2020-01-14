import { Table, Card, Button, Col, Drawer, Form, Row, Input, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetPageDetailListJson, Audit, GetBilling } from './Main.service';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps } from 'antd/lib/table';
import styles from './style.less';
import moment from 'moment';
const { TextArea } = Input;
const Search = Input.Search;
interface VerifyProps {
  vertifyVisible: boolean;
  ifVerify: boolean;
  closeVerify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const Verify = (props: VerifyProps) => {
  const { vertifyVisible, closeVerify, form, id, ifVerify, reload } = props;
  const title = ifVerify ? '计费单审核' : '计费单取消审核';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [unitFeeData, setUnitFeeData] = useState<any>();
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  useEffect(() => {
    if (vertifyVisible) {
      form.resetFields();
      if (id != null && id != '') {
        setLoading(true);
        GetBilling(id).then(res => {
          setInfoDetail(res);
          initUnitFeeLoadData('');
          setLoading(false);
        })
      } else {
        setInfoDetail({});
        setUnitFeeData([]);
        setLoading(false);
      }
    }
  }, [vertifyVisible]);

  const close = () => {
    closeVerify(false);
  };

  const initUnitFeeLoadData = (searchText) => {
    const queryJson = {
      billId: id == null || id == '' ? '' : id,
      keyword: searchText,
    };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return unitMeterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const unitMeterload = data => {
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetPageDetailListJson(data).then(res => {
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
      return res;
    });
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //console.log(infoDetail);
        // let newData = {
        //   keyValue: infoDetail.billId,
        //   billCode: values.billCode,
        //   billDate: moment(values.billDate).format('YYYY-MM-DD'),
        //   createUserName: values.createUserName,
        //   IfVerify: !infoDetail.ifVerify,
        //   billSource: infoDetail.billSource,
        //   VerifyDate: ifVerify ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : moment(values.verifyDate).format('YYYY-MM-DD HH:mm:ss'),
        //   VerifyMemo: values.verifyMemo
        // };
        let modifyData = { ...infoDetail, ...values, keyValue: infoDetail.billId };
        modifyData.ifVerify = ifVerify;
        Audit(modifyData).then(() => {
          closeVerify(true);
          reload();
        });
      }
    });
  };

  const columns = [
    // {
    //   title: '计费单号',
    //   dataIndex: 'billCode',
    //   key: 'billCode',
    //   width: 150,
    //   sorter: true
    // },
    {
      title: '单元编号',
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
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      sorter: true,
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
      width: 100,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '计费截止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      sorter: true,
      width: 100,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
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
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      className="offsetVerify"
      title={title}
      placement="right"
      width={1000}
      onClose={close}
      visible={vertifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card} >
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据处理中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="计费单号">
                  {infoDetail.billCode}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="单据日期"  >
                  {String(infoDetail.billDate).substr(0, 10)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计费人"  >
                  {infoDetail.createUserName}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="状态"   >
                  {infoDetail.ifVerify == null || !infoDetail.ifVerify ? '未审核' : '已审核'}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核人"  >
                  {infoDetail.verifyPerson ? infoDetail.verifyPerson : ''}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核日期"   >
                  {infoDetail.verifyDate == null ? '' : String(infoDetail.verifyDate).substr(0, 10)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="审核情况"  >
                  {getFieldDecorator('verifyMemo', {
                    initialValue: infoDetail.verifyMemo
                  })(
                    <TextArea rows={4} placeholder="请输入审核情况" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                <Search
                  className="search-input"
                  placeholder="请输入要查询的单元编号"
                  style={{ width: 280 }}
                  onSearch={(value) => {
                    // var params = Object.assign({}, meterSearchParams, { search: value })
                    // setMeterSearchParams(params);
                    initUnitFeeLoadData(value);
                  }}
                />
              </div>

              <Table
                bordered={false}
                size="middle"
                columns={columns}
                dataSource={unitFeeData}
                rowKey="unitmeterid"
                pagination={pagination}
                scroll={{ y: 500, x: 1200 }}
                loading={loading}
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
          onClick={() => closeVerify()}
        >
          取消
        </Button>
        <Button type="primary"
          onClick={onSave}
        >
          提交
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<VerifyProps>()(Verify);

