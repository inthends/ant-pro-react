//添加编辑费项公式
import { Button, Col, Form, Input, Row, Modal, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import './style.less';

const { TabPane } = Tabs;
interface AddFormulaProps {
  visible: boolean;
  closeModal(): void;
  getFormulaStr(id, type): void;
  form: WrappedFormUtils;
  isFormula: boolean;
  formulaOne: string;
}

const AddFormula = (props: AddFormulaProps) => {
  const { visible, closeModal, form, getFormulaStr, isFormula, formulaOne } = props;
  // let myFormulaOne = formulaOne ? formulaOne : '';
  const { getFieldDecorator } = form;
  const [myFormulaOne, setMyFormulaOne] = useState<any>(1);

  useEffect(() => {
    if (visible) {
      setMyFormulaOne(formulaOne);
    };
  }, [visible]);

  const pushSelectKey = () => {
    getFormulaStr(myFormulaOne, isFormula);
    closeModal();
  }

  // let inputRef;
  // let memoRef;

  // const InsterText = (value) => {
  //   const { textAreaRef } = inputRef;  
  //   if (document.selection) {
  //     textAreaRef.focus();
  //     var sel = document.selection.createRange();
  //     sel.text = textAreaRef;
  //     sel.select();
  //   } 
  //   else if (textAreaRef.selectionStart || textAreaRef.selectionStart == '0') {
  //     var startPos = textAreaRef.selectionStart;
  //     var endPos = textAreaRef.selectionEnd;
  //     var beforeValue = textAreaRef.value.substring(0, startPos);
  //     var afterValue = textAreaRef.value.substring(endPos, textAreaRef.value.length);
  //     textAreaRef.value = beforeValue + value + afterValue;
  //     textAreaRef.selectionStart = startPos + value.length;
  //     textAreaRef.selectionEnd = startPos + value.length;
  //     textAreaRef.focus();
  //   } else {
  //     textAreaRef.value += value;
  //     textAreaRef.focus();
  //   }
  // }

  const InsterText = (value) => {
    let inputValue = myFormulaOne;
    inputValue += value;
    form.setFieldsValue({ feeFormulaOne: inputValue });
    setMyFormulaOne(inputValue);
  }

  const InsterMemo = (value) => {
    form.setFieldsValue({ feeFormulaMemo: value });
  }

  return (
    <Modal
      title="设置公式"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => pushSelectKey()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', height: '448px' }}
      width='600px'
    >
      <Row gutter={8} >
        <Col span={12}>
          <Tabs type="card">
            <TabPane tab="房屋项目" key="1">
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<建筑面积>');
                  InsterMemo('当前房屋的建筑面积');
                }}>建筑面积</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<产权面积>');
                  InsterMemo('当前房屋的产权面积');
                }}>产权面积</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<计费面积>');
                  InsterMemo('当前房屋的计费面积');
                }}>计费面积</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<总建筑面积>');
                  InsterMemo('当前房屋的单据总建筑面积');
                }}>总建筑面积</Button>
              </Row>
            </TabPane>
            <TabPane tab="费表" key="2">
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }}>=========单元表=========</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<电表金额>');
                  InsterMemo('返回当前单据里电表金额');
                }}>电表金额</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<水表金额>');
                  InsterMemo('返回当前单据里水表金额');
                }}>水表金额</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<煤气表金额>');
                  InsterMemo('返回当前单据里煤气表金额');
                }}>煤气表金额</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }}>=========公用表=========</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<公用电表金额>');
                  InsterMemo('返回当前单据里公用电表金额');
                }}>公用电表金额</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<公用水表金额>');
                  InsterMemo('返回当前单据里公用水表金额');
                }}>公用水表金额</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<公用煤气表金额>');
                  InsterMemo('返回当前单据里公用煤气表金额');
                }}>公用煤气表金额</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }}>=========虚拟表=========</Button>
              </Row>
              <Row style={{ marginBottom: '4px' }}>
                <Button style={{ width: '95%' }} onClick={() => {
                  InsterText('<虚拟表金额>');
                  InsterMemo('返回当前单据里虚拟表金额');
                }}>虚拟表金额</Button>
              </Row>
            </TabPane>
            {/* <TabPane tab="函数" key="3">
            </TabPane> */}
          </Tabs>
        </Col>
        <Col span={12}>
          <Form layout="vertical" hideRequiredMark>
            <Row>
              <Form.Item
                style={{ marginBottom: '1px' }}
                label="计算公式" required >
                {getFieldDecorator('feeFormulaOne', {
                  initialValue: myFormulaOne,
                  // rules: [{ required: true, message: '请设置计算公式' }],
                })(<Input.TextArea rows={4}
                  onChange={e => setMyFormulaOne(e.target.value)}
                  style={{ resize: 'none' }}
                  placeholder="请设置计算公式" />)}
              </Form.Item>
            </Row>
            <Row gutter={[8, 6]}  >
              <Col span={4}><Button onClick={() => {
                InsterText('1');
              }}>1</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('2');
              }}>2</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('3');
              }}>3</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('(');
              }}>{"("}</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('+');
              }}>+</Button></Col>
            </Row>
            <Row gutter={[8, 6]}  >
              <Col span={4}><Button onClick={() => {
                InsterText('4');
              }}>4</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('5');
              }}>5</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('6');
              }}>6</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText(')');
              }}>{")"}</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('-');
              }}>-</Button></Col>
            </Row>
            <Row gutter={[8, 6]}>
              <Col span={4}><Button onClick={() => {
                InsterText('7');
              }}>7</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('8');
              }}>8</Button></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('9');
              }}>9</Button></Col>
              <Col span={4}></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('*');
              }}>*</Button></Col>
            </Row>
            <Row gutter={[8, 6]}>
              <Col span={4}><Button onClick={() => {
                InsterText('0');
              }}>0</Button></Col>
              <Col span={4}></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('.');
              }}>.</Button></Col>
              <Col span={4}></Col>
              <Col span={4}><Button onClick={() => {
                InsterText('/');
              }}>/</Button></Col>
            </Row>
            <Row >
              <Form.Item label="描述">
                {getFieldDecorator('feeFormulaMemo', {
                })(<Input.TextArea rows={4} style={{ resize: 'none' }} />)}
              </Form.Item>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<AddFormulaProps>()(AddFormula);

