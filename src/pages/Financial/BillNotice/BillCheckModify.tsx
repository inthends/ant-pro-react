
import { Card, Button, Col, Select, Form, Input, Row, Drawer, message, Spin, DatePicker, Checkbox } from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveBill, GetReceivablesFeeItemTreeJson, TestCalBill, GetTemplates, GetEntityShow } from './BillNotice.service';
import './style.less';
import AsynSelectTree from '../AsynSelectTree';
import LeftSelectTree from '../LeftSelectTree';
import moment from 'moment';
const { MonthPicker } = DatePicker;

interface BillCheckModifyProps {
  visible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  isEdit: boolean;
  id?: string;
  reload(): void
}
const BillCheckModify = (props: BillCheckModifyProps) => {
  const { visible, closeDrawer, form, isEdit, id, reload } = props;
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  const [tempListData, setTempListData] = useState<any[]>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const title = id ? "修改通知单" : "新增通知单";
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setSelectedFeeId([]);
      setUnitData([]);
      GetReceivablesFeeItemTreeJson().then((res) => {
        // const treeList = (res || []).map(item => {
        //   return {
        //     ...item,
        //     id: item.key,
        //     text: item.text,
        //     parentId: item.parentId,
        //   };
        // });
        setFeeTreeData(res || []); 
      }).then(() => {
        return GetTemplates();
      }).then(res => {
        setTempListData(res);
      }).then(() => {
        if (id != null && id != "") {
          GetEntityShow(id).then(res => {
            setInfoDetail(res);
          })
        } else {
          setSelectedFeeId([]);
          setUnitData([]);
        }
      });
    }
  }, [visible]);

  const [unitData, setUnitData] = useState<string[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState<string[]>([]);

  return (
    <Drawer
      className="offsetVerify"
      title={title}
      placement="right"
      width={1100}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Spin tip="数据加载中..." spinning={loading}>
        <Row gutter={24} style={{ height: 'calc(100vh - 55px)', overflow: 'hidden' }}>
          <Col span={6} style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
            <AsynSelectTree
              parentid='0'
              getCheckedKeys={(keys) => {
                setUnitData(keys);
              }}
              selectTree={(id, type, info?) => {
              }}
            />
          </Col>
          <Col span={6} style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
            <LeftSelectTree
              treeData={feeTreeData}
              selectTree={(id, item) => {
                //setSelectedFeeId(id);
              }}
              getCheckedKeys={(keys) => {
                //console.log(keys);
                setSelectedFeeId(keys);
              }}
            />
          </Col>
          <Col span={12} style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
            <Card>
              <Form layout="vertical" hideRequiredMark>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item required label="计费起始日期">
                      {getFieldDecorator('beginDate', {
                        initialValue: infoDetail.beginDate == null ? moment(new Date()).startOf('month') : moment(infoDetail.beginDate),
                        rules: [{ required: true, message: '请选择计费起始日期' }],
                      })(
                        <DatePicker style={{ width: '100%' }} disabled={!isEdit} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item required label="计费终止日期"  >
                      {getFieldDecorator('endDate', {
                        initialValue: infoDetail.endDate == null ? moment(new Date()).endOf('month') : moment(infoDetail.endDate),
                        rules: [{ required: true, message: '请选择计费终止日期' }],
                      })(
                        <DatePicker style={{ width: '100%' }} disabled={!isEdit} />
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item required label="生成方式">
                      {getFieldDecorator('calType', {
                        initialValue: infoDetail.calType ? infoDetail.calType : "按户生成",
                        rules: [{ required: true, message: '请选择生成方式' }]
                      })(
                        <Select placeholder="==请选择==" style={{ width: '100%', marginRight: '5px' }}>
                          <Select.Option value="按户生成">按户生成</Select.Option>
                          <Select.Option value="按房屋生成">按房屋生成</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item required label="账单归属年月"  >
                      {getFieldDecorator('belongDate', {
                        initialValue: infoDetail.belongDate == null ?
                          moment(new Date()) :
                          moment(infoDetail.belongDate),
                        rules: [{ required: true, message: '请选择账单归属年月' }],
                      })(
                        <MonthPicker style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item required label="最后缴费期限"  >
                      {getFieldDecorator('mustDate', {
                        initialValue: infoDetail.mustDate == null ? moment(new Date()) : moment(infoDetail.mustDate),
                        rules: [{ required: true, message: '请选择缴费日期' }],
                      })(
                        <DatePicker style={{ width: '100%' }} disabled={!isEdit} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item required label="账单模板"  >
                      {getFieldDecorator('templateId', {
                        initialValue: infoDetail.templateId,
                        rules: [{ required: true, message: '请选择账单模板' }]
                      })(
                        <Select placeholder="==请选择==" style={{ width: '100%' }} disabled={!isEdit} >
                          {
                            (tempListData || []).map(item => {
                              return <Select.Option value={item.value}>{item.title}</Select.Option>
                            })
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item required label="房屋状态" >
                      {getFieldDecorator('status', {
                        initialValue: infoDetail.status == null || infoDetail.status == '' ? '0,1,2,3,4,5,' : infoDetail.status
                      })(
                        <div>
                          <Checkbox.Group style={{ width: '100%' }} disabled={!isEdit}
                            options={[
                              { label: '未售', value: '0' },
                              { label: '待交房', value: '1' },
                              { label: '装修', value: '2' },
                              { label: '空置', value: '3' },
                              { label: '出租', value: '4' },
                              { label: '自用', value: '5' },
                            ]}
                            defaultValue={['0', '1', '2', '3', '4', '5']}
                            onChange={(checkedValues) => {
                              var info = Object.assign({}, infoDetail, { status: checkedValues });
                              setInfoDetail(info);
                            }}
                          />
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item required label="包含前期欠费">
                      {getFieldDecorator('includeBefore', {
                        initialValue: infoDetail.includeBefore == null ? false : true,
                      })(
                        <Checkbox disabled={!isEdit} ></Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="备注"  >
                      {getFieldDecorator('memo', {
                        initialValue: infoDetail.memo
                      })(
                        <Input.TextArea style={{ width: '100%' }} disabled={!isEdit} rows={3} placeholder="请输入备注" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="试算结果"  >
                      {getFieldDecorator('result', {
                        initialValue: infoDetail.result
                      })(
                        <Input.TextArea readOnly
                          style={{ width: '100%', color: 'red' }} disabled={!isEdit} rows={5} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Button onClick={() => {
                      if (unitData.length == 0) {
                        message.warning('请选择房屋');
                        return;
                      }
                      if (selectedFeeId.length == 0) {
                        message.warning('请选择费项');
                        return;
                      }
                      form.validateFields((errors, values) => {
                        if (!errors) {
                          setLoading(true);
                          // console.log(infoDetail);
                          let newData = {
                            BeginDate: moment(values.beginDate).format('YYYY-MM-DD'),
                            EndDate: moment(values.endDate).format('YYYY-MM-DD'),
                            BelongDate: moment(values.belongDate).format('YYYY-MM-DD'),
                            MustDate: moment(values.mustDate).format('YYYY-MM-DD'),
                            BillType: "通知单",
                            Status: values.status,
                            TemplateId: values.templateId,
                            IncludeBefore: values.includeBefore,
                            CalType: values.calType,
                            Memo: values.memo,
                            units: JSON.stringify(unitData),
                            items: JSON.stringify(selectedFeeId)
                          }
                          TestCalBill(newData).then((res) => {
                            var result = res.replace(/<br\/>/g, "\n")
                            var info = Object.assign({}, infoDetail, { result: result });
                            setInfoDetail(info);
                            setLoading(false);
                          });
                        }
                      });
                    }}>试算
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
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
          onClick={() => closeDrawer()}
        >
          取消
            </Button>
        <Button type="primary"
          onClick={() => {
            if (unitData.length == 0) {
              message.warning('请选择房间');
            } else {
              if (unitData.length == 0) {
                message.warning('请选择房屋');
                return;
              }
              if (selectedFeeId.length == 0) {
                message.warning('请选择费项');
                return;
              }
              form.validateFields((errors, values) => {
                if (!errors) {
                  console.log(infoDetail);
                  let newData = {
                    BeginDate: moment(values.beginDate).format('YYYY-MM-DD'),
                    EndDate: moment(values.endDate).format('YYYY-MM-DD'),
                    MustDate: moment(values.mustDate).format('YYYY-MM-DD'),
                    BelongDate: moment(values.belongDate).format('YYYY-MM-DD'),
                    BillType: "通知单",
                    Status: values.status,
                    TemplateId: values.templateId,
                    IncludeBefore: values.includeBefore,
                    CalType: values.calType,
                    Memo: values.memo,
                    units: JSON.stringify(unitData),
                    items: JSON.stringify(selectedFeeId)
                  }
                  SaveBill(newData).then((res) => {
                    console.log(res);
                    closeDrawer();
                    reload();
                  });
                }
              });
            }
          }}
        >
          提交
            </Button>
      </div>
    </Drawer >
  );
};
export default Form.create<BillCheckModifyProps>()(BillCheckModify);

