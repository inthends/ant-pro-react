//添加编辑费项
import {
  Button,
  Col, 
  Form,Input,
  Row,Modal,Tabs
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect  } from 'react'; 
import './style.less'; 

const {TabPane}=Tabs;
interface AddFormulaProps {
  visible: boolean;
  closeModal(): void;
  getFormulaStr(id,type):void;
  form: WrappedFormUtils;
  isFormula:boolean;
}

const AddFormula = (props: AddFormulaProps) => {
  const { visible, closeModal,getFormulaStr ,isFormula} = props;

  useEffect(() => {
    if(visible){

    };
  }, [visible]);

  const pushSelectKey=()=>{
    const { textAreaRef } =inputRef;
    getFormulaStr(textAreaRef.value,isFormula);
    closeModal();
  }

  let inputRef= undefined;
  let memoRef= undefined;

  const InsterText=(value)=>{
    const { textAreaRef } =inputRef;
    if (document.selection) {
        textAreaRef.focus();
        var sel = document.selection.createRange();
        sel.text = textAreaRef;
        sel.select();
    } else if (textAreaRef.selectionStart || textAreaRef.selectionStart == '0') {
        var startPos = textAreaRef.selectionStart;
        var endPos = textAreaRef.selectionEnd;
        var beforeValue = textAreaRef.value.substring(0, startPos);
        var afterValue = textAreaRef.value.substring(endPos, textAreaRef.value.length);
        textAreaRef.value = beforeValue + value + afterValue;
        textAreaRef.selectionStart = startPos + value.length;
        textAreaRef.selectionEnd = startPos + value.length;
        textAreaRef.focus();
    } else {
      textAreaRef.value += value;
      textAreaRef.focus();
    }
    /*const { textAreaRef } =inputRef;
    var startPos=textAreaRef.selectionStart;
    var endPos=textAreaRef.selectEnd;
    var beforeValue=textAreaRef.value.substring(0,startPos);
    var afterValue=textAreaRef.value.substring(endPos,textAreaRef.value.length);
    textAreaRef.value=beforeValue+value+afterValue;
    textAreaRef.selectionStart = startPos + value.length;
    textAreaRef.selectionEnd = startPos + value.length;
    textAreaRef.focus();*/
  }

  const InsterMemo=(value)=>{
    const { textAreaRef } =memoRef;
    textAreaRef.value=value;
  }
  return (
    <Modal
      title="选择收费项目"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => pushSelectKey()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' ,height:'380px'}}
      width='600px'
    >
      <Row gutter={8} style={{width:'100%'}}>
        <Col span={12}>
        <Tabs type="card">
          <TabPane tab="房屋项目" key="1">
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<建筑面积>');
                  InsterMemo('当前房屋的建筑面积');

              }}>建筑面积</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<套内面积>');
                  InsterMemo('当前房屋的套内面积');

              }}>套内面积</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<实用面积>');
                  InsterMemo('当前房屋的实用面积');

              }}>实用面积</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<计费面积>');
                  InsterMemo('当前房屋的计费面积');

              }}>计费面积</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<单据总建筑面积>');
                  InsterMemo('当前房屋的单据总建筑面积');
              }}>单据总建筑面积</Button>
            </Row>
          </TabPane>
          <TabPane tab="费表" key="2">
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}}>=========单元表=========</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<涵碧楼电表金额>');
                  InsterMemo('返回当前单据里涵碧楼电表金额');
              }}>涵碧楼电表金额</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<涵碧楼水表金额>');
                  InsterMemo('返回当前单据里涵碧楼水表金额');
              }}>涵碧楼水表金额</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}}>=========公用表=========</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<公用电表金额>');
                  InsterMemo('返回当前单据里公用电表金额');
              }}>公用电表金额</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<公用电表2金额>');
                  InsterMemo('返回当前单据里公用电表2金额');
              }}>公用电表2金额</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}}>=========虚拟表=========</Button>
            </Row>
            <Row style={{marginBottom:'2px'}}>
              <Button style={{width:'95%'}} onClick={()=>{
                  InsterText('<虚拟表测试1金额>');
                  InsterMemo('返回当前单据里虚拟表测试1金额');
              }}>虚拟表测试1金额</Button>
            </Row>
          </TabPane>
          <TabPane tab="函数" key="3">

          </TabPane>
        </Tabs>
        </Col>
        <Col span={12}>
          <Row>
            计算公式：
          </Row>
          <Row style={{marginBottom:"2px"}}>
            <Input.TextArea   ref={c => inputRef = c} rows={4} style={{resize:'none'}}
            ></Input.TextArea>
          </Row>
          <Row style={{marginBottom:"2px"}}>
            <Row gutter={2}>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('1');
              }}>1</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('2');
              }}>2</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('3');
              }}>3</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('(');
              }}>{"("}</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('+');
              }}>+</Button></Col>
            </Row>
            <Row gutter={2}>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('4');
              }}>4</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('5');
              }}>5</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('6');
              }}>6</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText(')');
              }}>{")"}</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('-');
              }}>-</Button></Col>
            </Row>
            <Row gutter={2}>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('7');
              }}>7</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('8');
              }}>8</Button></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('9');
              }}>9</Button></Col>
              <Col span={4}></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('*');
              }}>*</Button></Col>
            </Row>
            <Row gutter={2}>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('0');
              }}>0</Button></Col>
              <Col span={4}></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('.');
              }}>.</Button>  </Col>
              <Col span={4}></Col>
              <Col span={4}><Button style={{width:'100%'}} onClick={()=>{
                  InsterText('/');
              }}>/</Button></Col>
            </Row>
          </Row>
          <Row style={{marginBottom:"2px"}}>
            项目描述
          </Row>
          <Row>
            <Input.TextArea rows={3}  ref={c => memoRef = c}  style={{resize:'none'}}></Input.TextArea>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<AddFormulaProps>()(AddFormula);

