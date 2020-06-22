//转费
import {
  Spin,
  message,
  Card,
  Select,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetShowDetail, TransferBilling, GetTransferRoomUsers } from './Main.service';
import styles from './style.less';
const { Option } = Select;

interface TransfromProps {
  transVisible: boolean;
  closeTrans(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;

}
const Transfrom = (props: TransfromProps) => {
  const { transVisible, closeTrans, id, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = "转费";
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [relationIds, setRelationIds] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // 打开抽屉时初始化
  useEffect(() => {
    if (transVisible) {
      if (id) {
        setLoading(true);
        GetShowDetail(id).then(res => {
          // var infoTemp = Object.assign({}, res.entity,  { feeName: res.feeName, customerName: res.customerName, unitName: res.unitName });
          setInfoDetail(res);
          GetTransferRoomUsers(res.unitId, res.relationId).then(res => {
            setRelationIds(res || []);
            setLoading(false);
          });
        })
      } else {
        setInfoDetail({});
      }
    } else {

    }
  }, [transVisible]);

  const close = () => {
    closeTrans();
  };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        var data = {
          RelationId: values.relationId,
          Memo: values.memo
        };

        var splitData = {
          Data: JSON.stringify(data),
          keyvalue: id
        };

        TransferBilling(splitData).then(res => {
          message.success('提交成功');
          reload();
          close();
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
      visible={transVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Spin tip="数据处理中..." spinning={loading}>
        <Card className={styles.card} >
          <Form layout="vertical" hideRequiredMark>
            <Row>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>转费前</p>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <Form.Item label="收费房屋"  >
                  {infoDetail.unitName}
                </Form.Item>
              </Col>

              <Col span={9}>
                <Form.Item label="收费项目"  >
                  {infoDetail.feeName}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="收费对象"  >
                  {infoDetail.customerName}
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>转给</p>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="新收费对象"   >
                  {getFieldDecorator('relationId', {
                    // initialValue: infoDetail.relationId,
                  })(
                    <Select placeholder="=请选择=">
                      {relationIds.map(item => (
                        <Option value={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="备注" >
                  {getFieldDecorator('memo', {
                    // initialValue: infoDetail.memo,
                  })(
                    <Input.TextArea rows={4} style={{ width: '100%' }} />
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
        <Button onClick={save} type="primary" disabled={loading}>
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<TransfromProps>()(Transfrom);

