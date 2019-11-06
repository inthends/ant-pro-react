import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem from '@/components/BaseModifyDrawer/ModifyItem';
import { Col, Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm } from './Flow.service';

import GGEditor, { Flow } from 'gg-editor';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import EditorMinimap from './components/EditorMinimap';
import styles from './index.less';
import SaveCommand from './components/SaveCommand';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  typeId: string;
  typeName: string;
};

const Modify = (props: ModifyProps) => {
  const { typeName, typeId, data, form } = props;
  let initData = data ? data : { flowTypeName: typeName, flowType: typeId };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  //流程图
  // const [flowData, setflowData] = useState<any>({});

  //数据保存
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    // modifyData.flowType = typeId;
    // modifyData.flowTypeName = typeName;
    //保存流程图 
    // modifyData.designerJSON = flowData; //JSON.stringify(flowData);
    return SaveForm(modifyData);
  };

  // useEffect(() => {
  //   if (visible) {
  //     if (data) {
  //       var str = initData.designerJSON;
  //       setflowData(JSON.parse(str))
  //     }
  //   }
  // }, [visible]);

  // const fdata = {
  //   nodes: [{
  //     type: 'node',
  //     size: '70*70',
  //     shape: 'flow-circle',
  //     color: '#FA8C16',
  //     label: '起止节点',
  //     x: 55,
  //     y: 55,
  //     id: 'ea1184e8',
  //     index: 0,
  //   }, {
  //     type: 'node',
  //     size: '70*70',
  //     shape: 'flow-circle',
  //     color: '#FA8C16',
  //     label: '结束节点',
  //     x: 55,
  //     y: 255,
  //     id: '481fbb1a',
  //     index: 2,
  //   }],
  //   edges: [{
  //     source: 'ea1184e8',
  //     sourceAnchor: 2,
  //     target: '481fbb1a',
  //     targetAnchor: 0,
  //     id: '7989ac70',
  //     index: 1,
  //   }],
  // };

  const GetData = () => {
    if (data) {
      var str = initData.designerJSON;
      return JSON.parse(str);
    }
    return null;
  };

  return (
    <BaseModifyProvider
      {...props}
      name="流程"
      save={doSave}
      width={1000}>
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="流程名称"
              rules={[{ required: true, message: "请输入流程名称" }]}
              lg={8}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="flowTypeName"
              label="流程分类"
              readOnly={true}
              lg={8}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="createUserName"
              label="创建人"
              readOnly={true}
              lg={8}
            ></ModifyItem>
          </Row>
        </Form>
      </Card>

      <GGEditor className={styles.editor} >
        <Row type="flex" className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
            {/* 注册保存命令 */}
            <SaveCommand GetData={(data) => {
              // console.log("data", data); 
              //setflowData(data);
              initData.designerJSON = JSON.stringify(data);//转化为json
            }} />
          </Col>
        </Row>
        <Row type="flex" className={styles.editorBd}>
          <Col span={4} className={styles.editorSidebar}>
            <FlowItemPanel />
          </Col>
          <Col span={16} className={styles.editorContent}>
            <Flow className={styles.flow}
              graph={{ edgeDefaultShape: 'flow-polyline' }}
              // data={
              //   data ? flowData : {}
              // }
              data={GetData()}
            />
          </Col>
          <Col span={4} className={styles.editorSidebar}>
            <FlowDetailPanel />
            <EditorMinimap />
          </Col>
        </Row>
        <FlowContextMenu />
      </GGEditor >

    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
