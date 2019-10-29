import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { TreeSelect, Modal, Upload, Icon, Col, Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { SaveForm } from "./Main.service";
import { GetOrgEsates } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';

// 引入编辑器组件
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
//使用antd upload

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const Modify = (props: ModifyProps) => {
  const { data, form, visible } = props;
  let initData = data ? data : { isPublish: false, isDistinguish: false, participants: 0, type: '资讯' };
  const { getFieldDecorator } = form;
  const baseFormProps = { form, initData };
  const [orgs, setOrgs] = useState<TreeNode[]>();

  useEffect(() => { 
    GetOrgEsates().then(res => {
      setOrgs(res);
    });

  }, []);

  useEffect(() => {
    //给文本编辑器赋值
    setTimeout(() => {
      form.setFieldsValue({
        description: BraftEditor.createEditorState(
          data ? data.description : ''
        )
      })
    }, 500)

    //加载图片
    let files: any[]; files = [];
    if (data != null && data.mainPic != null) {
      const filedate = {
        url: data.mainPic,
        uid: data.id//必须
      }
      files.push(filedate);
    }
    setFileList(files);

  }, [visible]);

  //图片上传begin 
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">缩略图</div>
    </div>
  );

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleRemove = (file) => {
    // const fileid = file.fileid || file.response.fileid;
    // RemoveFile(fileid).then(res => {
    // }); 
    //清空图片
    form.setFieldsValue({ mainPic: '' });
  };

  //重新设置state
  const handleChange = ({ fileList }) => {
    setFileList([...fileList]);
    let url = '';
    if (fileList.length > 0)
      url = fileList[0].response;
    //设置图片 
    form.setFieldsValue({ mainPic: url });
  };
  //图片上传end

  //文本编辑器开始
  // const [newsfileList, setnewsFileList] = useState<any[]>([]);
  const [state, setState] = useState<any>(
    {
      editorState: BraftEditor.createEditorState(null)
    }
  );

  const handleEditorChange = (editorState) => {
    setState({ editorState });
  };

  //文本编辑上传change
  const handleEditorUploadChange = ({ file }) => {
    let url = '';
    if (file.response != null && file.response != undefined) {
      url = file.response;
      const editorState = ContentUtils.insertMedias(state.editorState, [{
        type: 'IMAGE',
        url: url
      }]);
      //赋值
      form.setFieldsValue({ description: BraftEditor.createEditorState(editorState) });
      setState(editorState);
    }
  };

  let controls: any[];
  controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
  let extendControls: any[];
  extendControls = [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload
          accept="image/*"
          showUploadList={false}
          action={process.env.basePath + '/News/Upload'}
          onChange={handleEditorUploadChange}
        >
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            <Icon type="picture" theme="filled" />
          </button>
        </Upload>
      )
    }
  ];
  //文本编辑器结束

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    modifyData.description = dataDetail.description.toHTML();//toRAW();  
    modifyData.isDistinguish = modifyData.isDistinguish == 0 ? false : true;
    modifyData.isPublish = modifyData.isPublish == 0 ? false : true;
    modifyData.deadline = modifyData.deadline ? modifyData.deadline.format('YYYY-MM-DD') : null;
    return SaveForm(modifyData);
  };

  const onRoomChange = (value, label, extra) => {
    let names = '';
    label.forEach((val, idx, arr) => {
      names += ' ' + val;
    });
    form.setFieldsValue({ estateName: names });
  };

  return (
    <BaseModifyProvider {...props}
      name="公告"
      width={700}
      save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="title"
              label="标题"
              rules={[{ required: true, message: "请输入标题" }]}
              // wholeLine={true}
              lg={24}
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="type"
              type='select'
              label="类型"
              items={[
                { label: '通知', value: '通知' },
                { label: '公告', value: '公告' },
                { label: '资讯', value: '资讯' },
                { label: '广告', value: '广告' },
                { label: '活动', value: '活动' },
                { label: '关于我们', value: '关于我们' }
              ]}
              // onChange={value => form.setFieldsValue({ isPublish: value })}
              rules={[{ required: true, message: "请选择类型" }]}
              lg={10}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              type='inputNumber'
              field="sortCode"
              label="排序"
              // rules={[{ required: true, message: "请输入排序" }]}
              // wholeLine={true} 
              lg={6}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="isDistinguish"
              // type='checkbox'
              type='switch'
              label="区分小区"
              onChange={value => form.setFieldsValue({ isDistinguish: value })}
              checked={form.getFieldValue('isDistinguish')}
              lg={4}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="isPublish"
              type='switch'
              label="是否发布"
              onChange={value => form.setFieldsValue({ isPublish: value })}
              checked={form.getFieldValue('isPublish')}
              lg={4}
            ></ModifyItem>
          </Row>

          <Row gutter={24} hidden={form.getFieldValue('type') == '活动' ? false : true} >
            <ModifyItem
              {...baseFormProps}
              type='date'
              field="deadline"
              label="截止日期"
              rules={[{ required: form.getFieldValue('type') == '活动', message: "请选择截止日期" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              type='inputNumber'
              field="participants"
              label="参加人数"
              rules={[{ required: form.getFieldValue('type') == '活动', message: "请输入参加人数" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            {/* <ModifyItem
              {...baseFormProps}
              field="estateId"
              label="所属小区"
              type="tree"
              dropdownStyle={{ maxHeight: 280 }}
              multiple={true}
              wholeLine={true}
              treeData={orgs}
              onChange={onRoomChange}
              // disabled={initData.estateName != undefined}
              rules={[{ required: !form.getFieldValue('isDistinguish'), message: '请选择所属小区' }]} 
            ></ModifyItem> */}
            <Col>
              <Form.Item label="所属小区" required>
                {getFieldDecorator('estateId', {
                  initialValue: initData.estateId ? initData.estateId.split(',') : null,
                  rules: [{ required: form.getFieldValue('isDistinguish'), message: '请选择所属小区' }],
                })(
                  <TreeSelect
                    placeholder="请选择房源"
                    allowClear
                    dropdownStyle={{ maxHeight: 280 }}
                    treeData={orgs}
                    onChange={onRoomChange}
                    multiple={true}>
                  </TreeSelect>
                )}
              </Form.Item>
            </Col>
          </Row> 
          <Row gutter={24} hidden={form.getFieldValue('type') == '广告' ? false : true} >
            <ModifyItem
              {...baseFormProps}
              field="linkUrl"
              label="链接地址"
              rules={[{ required: form.getFieldValue('type') == '广告', message: "请输入链接地址" }]} 
              lg={24}
            ></ModifyItem>
          </Row> 
          <Row gutter={24}>
            <Col>
              <Form.Item required label="">
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: '请输入内容' }]
                })(
                  <BraftEditor
                    // value={state.editorState}
                    onChange={handleEditorChange}
                    controls={controls}
                    extendControls={extendControls}
                    placeholder="请输入内容"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <div className="clearfix">
                <Upload
                  accept='image/*'
                  action={process.env.basePath + '/News/Upload'}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  onRemove={handleRemove}
                >
                  {fileList.length > 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>

              {getFieldDecorator('mainPic', {
                initialValue: initData.mainPic,
              })(
                <input type='hidden' />
              )}

              {getFieldDecorator('estateName', {
                initialValue: initData.estateName,
              })(
                <input type='hidden' />
              )}

            </Col>
          </Row>



        </Form>
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
