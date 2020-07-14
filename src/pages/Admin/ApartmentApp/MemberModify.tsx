import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import {Icon,Modal,Upload, Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import {GetMemberFilesData,RemoveMemberFile, SaveItemForm } from "./ApartmentApp.service";
import styles from './style.less';
interface MemberModifyProps {
  visible: boolean;
  isAdd: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const MemberModify = (props: MemberModifyProps) => {
  const { data, form, isAdd, visible } = props;
  let initData = data;//? data : { keyvalue: keyvalue };
  const baseFormProps = { form, initData };
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, isAdd: isAdd, keyvalue: keyvalue };
    return SaveItemForm(modifyData);
  };

  const [keyvalue, setKeyvalue] = useState<any>();

  const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (isAdd) {
        setKeyvalue(guid());
      }
      else {
        setKeyvalue(data.id);
        GetMemberFilesData(data.id).then(res => {
          setFileList(res || []);
        });
      }
    }
  }, [visible]);

//图片上传
const [fileList, setFileList] = useState<any[]>([]);
const [previewVisible, setPreviewVisible] = useState<boolean>(false);
const [previewImage, setPreviewImage] = useState<string>('');
const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传</div>
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

const handleChange = ({ fileList }) => setFileList([...fileList]);

const handleRemove = (file) => {
  const fileid = file.fileid || file.response.fileid;
  RemoveMemberFile(fileid).then(res => {
  });
};

  return (
    <BaseModifyProvider 
    width={700}
    {...props} name="入住人员" save={doSave}>
      <Card className={styles.card} hoverable>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="姓名"
              rules={[{ required: true, message: "请输入姓名" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="phoneNum"
              label="手机号码"
              rules={[{ required: true, message: "请输入手机号码" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="certificateType"
              label="证件类型"
              rules={[{ required: true, message: "请选择证件类型" }]}
              type='select'
              items={[
                { label: '身份证', value: '身份证', title: '身份证' },
                { label: '护照', value: '护照', title: '护照' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="certificateNO"
              label="证件号码"
              rules={[{ required: true, message: "请输入证件号码" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="education"
              label="学历"
              rules={[{ required: true, message: "请选择学历" }]}
              type='select'
              items={[
                { label: '专科', value: '专科', title: '专科' },
                { label: '本科', value: '本科', title: '本科' },
                { label: '研究生', value: '研究生', title: '研究生' },
                { label: '博士', value: '博士', title: '博士' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="certificate"
              label="荣誉证书"
            //rules={[{ required: true, message: "请输入荣誉证书" }]}
            ></ModifyItem>
          </Row>


          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="sharing"
              label="合住人数"
            //rules={[{ required: true, message: "请输入合住人数" }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="sharingMan"
              label="合住人"
            //rules={[{ required: true, message: "请输入合住人" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="sharingTel"
              label="合住人联系方式 "
            //rules={[{ required: true, message: "请输入合住人联系方式 " }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="sharingRelation"
              label="合住人关系"
            //rules={[{ required: true, message: "请输入合住人" }]}
            ></ModifyItem>
          </Row>


          <div className="clearfix">
            <Upload
              accept='image/*'
              action={process.env.basePath + '/Apartment/UploadMember?keyvalue=' + keyvalue}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              onRemove={handleRemove}>
              {uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            请上传证件照片
          </div>

        </Form>
      </Card>
    </BaseModifyProvider >
  );
};

export default Form.create<MemberModifyProps>()(MemberModify);
