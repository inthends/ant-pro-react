//添加编辑费项
import { Card, Divider, Button, Col, Select, Modal, Drawer, Form, Row, Icon, Spin, Input, InputNumber, TreeSelect, message, Table, Checkbox } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetDataItemTreeJson, GetOrgTree, GetInfoFormJson, GetPageListWithMeterID, RemoveUnitForm, RemoveFormAll, SaveForm } from './Meter.service';
import './style.less';
import ChargeFeeItem from './ChargeFeeItem';
import AddFormula from './AddFormula';
import SelectHouse from './SelectHouse';
import EditHouseFeeItem from './EditHouseFeeItem';
const Search = Input.Search;
const Option = Select.Option;
const { TextArea } = Input;

interface MeterModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  reload(): void;
}

const MeterModify = (props: MeterModifyProps) => {
  const { modifyVisible, closeDrawer, form, id, reload } = props; 
  const title = id == null ? '新增费表资料' : '修改费表资料';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});

  const [meterKinds, setMeterKinds] = useState<any>([]);
  const [meterTypes, setMeterTypes] = useState<any>([]);
  const [orgTreeData, setOrgTreeData] = useState<any>({});
  const [chargeFeeItemVisible, setChargeFeeItemVisible] = useState<boolean>(false);
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [editHouseFeeItemVisible, setEditHouseFeeItemVisible] = useState<boolean>(false);


  const [meterSearchParams, setMeterSearchParams] = useState<any>({});
  const [meterLoading, setMeterLoading] = useState<boolean>(false);
  const [meterData, setMeterData] = useState<any>();
  // const [meterSearch, setMeterSearch] = useState<string>('');
  const [meterPagination, setMeterPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  useEffect(() => {
    if (modifyVisible) {
      form.resetFields();
      //获取费表类型
      GetDataItemTreeJson('EnergyMeterKind').then(res => {
        setMeterKinds(res);
      })
      //获取费表种类
      GetDataItemTreeJson('EnergyMeterType').then(res => {
        setMeterTypes(res);
      });
      GetOrgTree().then(res => {
        setOrgTreeData(res);
      });
      if (id) {
        setIsAdd(false);
        setLoading(true);
        GetInfoFormJson(id).then(res => {
          setInfoDetail(res);
          setLoading(false);
          initMeterLoadData();

        });
      } else {
        form.resetFields();
        setInfoDetail({});
        setMeterData([]);
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
  const initMeterLoadData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: meterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: meterSearchParams.search == null ? '' : meterSearchParams.search, MeterId: id }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'metercode';
    }

    return meterload(searchCondition).then(res => {
      return res;
    });
  }

  const meterload = data => {
    setMeterLoading(true);
    data.sidx = data.sidx || 'metercode';
    data.sord = data.sord || 'asc';
    return GetPageListWithMeterID(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setMeterData(res.data);
      setMeterLoading(false);
      return res;
    });
  };
  const [feeDetail, setFeeDetail] = useState<any>({});
  const checkEntity = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let guid = getGuid();
        var meterEntity = {
          keyValue: id == null || id == '' ? guid : id,
          MeterId: id == null || id == '' ? guid : id,
          OrganizeId: infoDetail.organizeId,
          MeterType: values.meterType,
          MeterKind: values.meterKind,
          MeterName: values.meterName,
          MeterCode: values.meterCode,
          MeterZoom: values.meterZoom,
          MeterRange: values.meterRange,
          MeterPrice: values.meterPrice,
          Formula: values.formula,
          Calculation: values.calculation,
          MeterAddress: values.meterAddress,
          Memo: values.memo,
          FeeItemId: infoDetail.feeItemId,
          FeeItemName: infoDetail.feeItemName,
          IsStop: values.isStop==null?false:true
        }
        setFeeDetail(
          meterEntity
        );
        //console.log(meterEntity);
        setSelectHouseVisible(true);
      }
    });
  };

  const columns = [
    {
      title: '表编号',
      dataIndex: 'meterCode',
      key: 'meterCode',
      width: 180,
      sorter: true
    },
    {
      title: '单价',
      dataIndex: 'meterPrice',
      key: 'meterPrice',
      width: 80,
      sorter: true
    },
    {
      title: '倍率',
      dataIndex: 'meterZoom',
      key: 'meterZoom',
      width: 80,
      sorter: true,
    },
    {
      title: '量程',
      dataIndex: 'meterRange',
      key: 'meterRange',
      width: 80,
      sorter: true,
    },
    {
      title: '房屋全称',
      dataIndex: 'allName',
      key: 'allName',
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 95,
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => {
          //     setHouseFeeItemId(record.unitmeterid);
          //     setEditHouseFeeItemVisible(true);
          //   }}
          // >
          //   编辑
          // </Button>,
          // <Button
          //   type="danger"
          //   key="delete"
          //   onClick={() => {
          //     Modal.confirm({
          //       title: '请确认',
          //       content: `您是否确定删除？`,
          //       onOk: () => {
          //         RemoveUnitForm(record.unitmeterid).then(res => {
          //           initMeterLoadData();
          //         })
          //       },
          //     });
          //   }}  >
          //   删除
          // </Button>

          <span>
            <a onClick={() => { setHouseFeeItemId(record.unitMeterId); setEditHouseFeeItemVisible(true); }} key="modify">编辑</a>
            <Divider type="vertical" />
            <a onClick={() => {
              RemoveUnitForm(record.unitMeterId).then(res => {
                initMeterLoadData();
              })
            }} key="delete">删除</a>
          </span> 
        ];
      },
    }
  ] as ColumnProps<any>[];

  const [houseFeeItemId, setHouseFeeItemId] = useState<string>('');

  const closeChargeFeeItem = () => {
    setChargeFeeItemVisible(false);
  }
  const closeAddFormula = () => {
    setAddFormulaVisible(false);
  }
  const closeSelectHouse = () => {
    setSelectHouseVisible(false);
  }
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   getCheckboxProps: record => ({
  //     //disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //     //name: record.name,
  //   }),
  // };
  const [isFormula, setIsFormula] = useState<boolean>(false);
  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={modifyVisible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card  >
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据加载中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="费表名称">
                  {getFieldDecorator('meterName', {
                    initialValue: infoDetail.meterName,
                    rules: [{ required: true, message: '请输入费表名称' }],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="费表类型"  >
                  {getFieldDecorator('meterKind', {
                    initialValue: infoDetail.meterKind,
                    rules: [{ required: true, message: '请选择费表类型' }],
                  })(
                    <Select placeholder="=请选择=" style={{ width: '100%', marginRight: '5px' }}>
                      {
                        meterKinds.map(item => {
                          return <Option value={item.title}>{item.title}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="费表种类"  >
                  {getFieldDecorator('meterType', {
                    initialValue: infoDetail.meterType,
                    rules: [{ required: true, message: '请选择费表种类' }],
                  })(
                    <Select placeholder="=请选择=" style={{ width: '100%', marginRight: '5px' }}>
                      {
                        meterTypes.map(item => {
                          return <Option value={item.title}>{item.title}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="费表编号"   >
                  {getFieldDecorator('meterCode', {
                    initialValue: infoDetail.meterCode,
                    rules: [{ required: true, message: '请输入费表编号' }],
                  })(
                    <Input></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="所属机构"  >
                  {getFieldDecorator('organieId', {
                    initialValue: infoDetail.organizeId,
                    rules: [{ required: true, message: '请选择所属机构' }],
                  })(
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 380, overflow: 'auto' }}
                      treeData={orgTreeData}
                      placeholder="=请选择="
                      treeDefaultExpandAll
                      onChange={(value => {
                        var info = Object.assign({}, infoDetail, { organizeId: value });
                        console.log(value);
                        setInfoDetail(info);
                      })}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="关联收费项目"   >
                  {getFieldDecorator('feeItemId', {
                    initialValue: infoDetail.feeItemName,
                    rules: [{ required: true, message: '请选择关联收费项目' }],
                  })(
                    <Input addonAfter={<Icon type="setting" onClick={() => {
                      setChargeFeeItemVisible(true);
                    }} />} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="单价"  >
                  {getFieldDecorator('meterPrice', {
                    initialValue: infoDetail.meterPrice,
                    rules: [{ required: true, message: '请输入单价' }],
                  })(
                    <InputNumber style={{ width: '100%' }} ></InputNumber>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="倍率"  >
                  {getFieldDecorator('meterZoom', {
                    initialValue: infoDetail.meterZoom == null ? 1 : infoDetail.meterZoom,
                    rules: [{ required: true, message: '请输入倍率' }],
                  })(
                    <InputNumber style={{ width: '100%' }} ></InputNumber>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="量程" >
                  {getFieldDecorator('meterRange', {
                    initialValue: infoDetail.meterRange == null ? 9999 : infoDetail.meterRange,
                    rules: [{ required: true, message: '请输入量程' }],
                  })(
                    <InputNumber style={{ width: '100%' }} ></InputNumber>
                  )}
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <Form.Item required label="表位置">
                  {getFieldDecorator('meterAddress', {
                    initialValue: infoDetail.meterAddress,
                  })(
                    <Input></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item required label="是否停用"   >
                  {getFieldDecorator('isStop', {
                    initialValue: infoDetail.isStop==null?false:true
                  })(
                    <Checkbox />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item required label="分摊系数"   >
                  {getFieldDecorator('formula', {
                    initialValue: infoDetail.formula == null ? '<建筑面积>/<单据总建筑面积>' : infoDetail.formula,
                    rules: [{ required: true, message: '请输入分摊系数' }],
                  })(
                    <Input addonAfter={<Icon type="setting" onClick={() => {
                      setAddFormulaVisible(true);
                      setIsFormula(true);
                    }} />} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item required label="计算公式">
                  {getFieldDecorator('calculation', {
                    initialValue: infoDetail.calculation == null ? 1 : infoDetail.calculation,
                  })(
                    <Input addonAfter={<Icon type="setting" onClick={() => {
                      setAddFormulaVisible(true);
                      setIsFormula(false);
                    }} />} />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item label="附加说明"  >
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo
                  })(
                    <TextArea rows={3} placeholder="请输入附加说明" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
                <Search
                  className="search-input"
                  placeholder="请输入要查询的费表编号"
                  style={{ width: 280 }}
                  onSearch={(value) => {
                    var params = Object.assign({}, meterSearchParams, { search: value })
                    setMeterSearchParams(params);
                    initMeterLoadData();
                  }}
                />
                <Button type="link"  style={{ float: 'right'  }}
                  onClick={() => {
                    Modal.confirm({
                      title: '请确认',
                      content: `您是否确定删除？`,
                      onOk: () => {
                        if (id != null || id != "") {
                          RemoveFormAll(id).then(res => {
                            message.success('删除成功！');
                            initMeterLoadData();
                          });
                        }
                      },
                    });
                  }}
                > <Icon type="delete" />全部删除</Button>
                <Button type="link"   style={{ float: 'right', marginLeft: '1px' }}
                  onClick={() => {
                    checkEntity();
                  }}
                >
                  <Icon type="plus" />
                  添加房屋
              </Button>
              </div>
              <Table<any>
                onChange={(paginationConfig, filters, sorter) => {
                     initMeterLoadData(paginationConfig, sorter)
                   }
                }
                bordered={false}
                size="middle"
                columns={columns}
                dataSource={meterData}
                rowKey="unitmeterid"
                pagination={meterPagination}
                scroll={{ y: 500, x: 800 }}
                loading={loading}
              /*rowSelection={rowSelection}*/
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
                var meterEntity = {
                  keyValue: id == null || id == '' ? '' : id,
                  MeterId: id == null || id == '' ? guid : id,
                  OrganizeId: infoDetail.organizeId,
                  MeterType: values.meterType,
                  MeterKind: values.meterKind,
                  MeterName: values.meterName,
                  MeterCode: values.meterCode,
                  MeterZoom: values.meterZoom,
                  MeterRange: values.meterRange,
                  MeterPrice: values.meterPrice,
                  Formula: values.formula,
                  Calculation: values.calculation,
                  MeterAddress: values.meterAddress,
                  Memo: values.memo,
                  FeeItemId: infoDetail.feeItemId,
                  FeeItemName: infoDetail.feeItemName,
                  IsStop: values.isStop==null?false:true,
                  type: isAdd ? 1 : 0
                }
                SaveForm(meterEntity).then(() => {
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
      <ChargeFeeItem
        visible={chargeFeeItemVisible}
        closeModal={closeChargeFeeItem}
        getSelectTree={(item) => {
          var info = Object.assign({}, infoDetail, { feeItemName: item.name, feeItemID: item.id });
          setInfoDetail(info);
        }}
      />
      <AddFormula
        visible={addFormulaVisible}
        closeModal={closeAddFormula}
        getFormulaStr={(str, isFormula) => {
          if (isFormula) {
            var info = Object.assign({}, infoDetail, { formula: str });
            setInfoDetail(info);
          } else {
            var info = Object.assign({}, infoDetail, { calculation: str });
            setInfoDetail(info);
          }
        }}
        isFormula={isFormula}
      />
      <SelectHouse
        visible={selectHouseVisible}
        closeModal={closeSelectHouse}
        feeDetail={feeDetail}
      />
      <EditHouseFeeItem
        modifyVisible={editHouseFeeItemVisible}
        closeModal={() => {
          setEditHouseFeeItemVisible(false);
        }}
        id={houseFeeItemId}
        meterinfo={infoDetail}
        reload={() => {
          initMeterLoadData();
          setIsAdd(false);
        }}
      />
    </Drawer>
  );
};

export default Form.create<MeterModifyProps>()(MeterModify);

