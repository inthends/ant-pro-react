//拆分房屋
import { Spin, message, Button, Col, Drawer, Form, Input, InputNumber, Row, Card } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SplitUnit } from './House.service';
import styles from './style.less';
interface SplitProps {
  splitVisible: boolean;
  closeSplit(): void;
  form: WrappedFormUtils;
  data?: any;
  reload(): void;
}
const Split = (props: SplitProps) => {
  const { splitVisible, closeSplit, data, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = "拆分房屋";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // 打开抽屉时初始化
  useEffect(() => {
    if (splitVisible) {
      form.resetFields();
      if (data != null && data != "") {
        setInfoDetail(data);
      }
      else {
        setInfoDetail({});
      }
    } else {
    }
  }, [splitVisible]);

  const close = () => {
    closeSplit();
  };

  const [loading, setLoading] = useState<boolean>(false);
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        var data = {
          FirstName: values.firstName,
          FirstNo: values.firstNo,
          FirstArea: values.firstArea,
          SecondName: values.secondName,
          SecondNo: values.secondNo,
          SecondArea: values.secondArea,
          Memo: values.memo
        }
        var splitData = {
          Data: JSON.stringify(data),
        };
        SplitUnit(splitData).then(res => {
          message.success('提交成功');
          close();
          reload();
          setLoading(false);
        });
      }
    });
  };


  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={splitVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >
      <Spin tip="数据处理中..." spinning={loading}>
        <Card className={styles.card}  hoverable>
          <Form layout="vertical" hideRequiredMark>
            <Row>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>拆分前</p>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="名称">
                  {infoDetail.name}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="编号"  >
                  {infoDetail.code}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="建筑面积(㎡)" >
                  {infoDetail.area}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>拆分为</p>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="第一间名称" required>
                  {getFieldDecorator('firstName', {
                    rules: [{ required: true, message: '请输入第一间名称' },
                      // {
                      //   validator: (rules, value, callback) => {
                      //     if (value == undefined) {
                      //       callback();
                      //     }
                      //     else {
                      //       if (value > infoDetail.amount) {
                      //         callback('金额不能大于拆分前总金额');
                      //       }
                      //     }
                      //   }
                      // }
                    ]
                  })(
                    <Input placeholder='请输入第一间名称' />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="编号" required >
                  {getFieldDecorator('firstNo', {
                    initialValue: infoDetail.code + '-01',
                    rules: [{ required: true, message: '请输入编号' }],
                  })(
                    <Input disabled placeholder='请输入编号' />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="建筑面积(㎡)" required>
                  {getFieldDecorator('firstArea', {
                    initialValue: infoDetail.area,
                    rules: [{ required: true, message: '请输入建筑面积' },
                      //   {
                      //   validator: (rules, value, callback) => {
                      //     if (value.isBefore(moment(infoDetail.beginDate).format('YYYY-MM-DD')) || value.isAfter(moment(infoDetail.endDate).format('YYYY-MM-DD'))) {
                      //       callback('拆分日期必须早于拆分前截止日期');
                      //     }
                      //   }
                      // }
                    ]
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder='请输入建筑面积'
                      onChange={(value) => {
                        var secondArea = infoDetail.area - Number(value);
                        form.setFieldsValue({ secondArea: secondArea.toFixed(2) });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="第二间名称" required >
                  {getFieldDecorator('secondName', {
                    rules: [{ required: true, message: '请输入第二间名称' }],
                  })(
                    <Input placeholder='请输入第二间名称' />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="编号" required >
                  {getFieldDecorator('secondNo', {
                    initialValue: infoDetail.code + '-02',
                  })(
                    <Input disabled placeholder='请输入编号' />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="建筑面积(㎡)" required >
                  {getFieldDecorator('secondArea', {
                    rules: [{ required: true, message: '请输入建筑面积' }],
                  })(
                    <InputNumber disabled={true} style={{ width: '100%' }} placeholder='请输入建筑面积' />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="备注" >
                  {getFieldDecorator('memo', {
                    initialValue: ''
                  })(
                    <Input.TextArea rows={4} style={{ width: '100%' }} placeholder='请输入备注' />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
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
        <Button onClick={close} style={{ marginRight: 8 }} disabled={loading}>
          取消
        </Button>
        <Button onClick={save} type="primary" disabled={loading}  >
          提交
        </Button>
      </div>

    </Drawer>
  );
};
export default Form.create<SplitProps>()(Split);

