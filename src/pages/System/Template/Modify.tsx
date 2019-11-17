import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem from '@/components/BaseModifyDrawer/ModifyItem';
import { message, Tooltip, Button, Icon, Col, Upload, Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import { SaveForm } from './Template.service';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './style.less';
import copy from 'copy-to-clipboard';
import { GetOrgs } from '@/services/commonItem';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  typeId: string;
};

const Modify = (props: ModifyProps) => {
  const { typeId, data, form, visible } = props;
  const { getFieldDecorator } = form;
  const [orgs, setOrgs] = useState<TreeNode[]>();
  let initData = data ? data : { fixTable: false, rowNumbers: 0 };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  const [fileList, setFileList] = useState<any[]>([]);
  const getOrgs = () => {
    GetOrgs().then(res => {
      setOrgs(res);
    });
  };

  useEffect(() => {
    getOrgs();
  }, []);


  useEffect(() => {
    //加载图片
    let files: any[]; files = [];
    if (data != null && data.fileUrl != null) {
      const filedate = {
        url: data.fileUrl,
        uid: data.id//必须
      }
      files.push(filedate);
    }
    setFileList(files);

  }, [visible]);


  //数据保存
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id }; 
    modifyData.categoryId = modifyData.categoryId ? modifyData.categoryId : typeId;
    return SaveForm(modifyData);
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">点击上传模板</div>
    </div>
  );

  //图片上传
  const handleRemove = (file) => {
    // const fileid = file.fileid || file.response.fileid;
    // RemoveFile(fileid).then(res => {
    // }); 
    //清空
    form.setFieldsValue({ fileUrl: '' });
  };

  //重新设置state
  const handleChange = ({ fileList }) => {
    setFileList([...fileList]);
    let url = '';
    if (fileList.length > 0)
      url = fileList[0].response;
    //设置
    form.setFieldsValue({ fileUrl: url });
  };

  //关键词复制
  const clipcopy = (e) => {
    copy(e.target.dataset.clipboardText);
    message.success('复制成功');
  };

  //图片上传结束 
  return (
    <BaseModifyProvider {...props} name="模板" save={doSave}
      width={750}
    >
      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card}>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              lg={8}
              field="organizeId"
              label="所属机构"
              type="tree"
              treeData={orgs}
              disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择所属机构' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              lg={8}
              field="templateName"
              label="模板名称"
              rules={[{ required: true, message: '请输入模板名称' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              lg={3}
              type='checkbox'
              field="fixTable"
              label="固定表格"
              checked={form.getFieldValue('fixTable')}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              lg={5}
              field="rowNumbers"
              type='inputNumber'
              label="行数"
            ></ModifyItem>
          </Row>
        </Card>
        <Card className={styles.card} title='关键词复制'>
          <Row gutter={24}>
            <Tooltip title="当前系统登录用户名">
              <Button className={styles.button}
                data-clipboard-text="${当前用户}"
                onClick={clipcopy}
              >当前用户</Button>
            </Tooltip>
            <Button className={styles.button}
              data-clipboard-text="${当前日期}"
              onClick={clipcopy}
            >当前日期</Button>
            <Tooltip title="账单里住户姓名">
              <Button className={styles.button}
                data-clipboard-text="${客户名称}"
                onClick={clipcopy}
              >客户名称</Button></Tooltip>
            <Tooltip title="如：王道公园2幢502单元">
              <Button className={styles.button}
                data-clipboard-text="${房源信息}"
                onClick={clipcopy}
              >房源信息</Button></Tooltip>
            <Tooltip title="如：241.9㎡"><Button className={styles.button}
              data-clipboard-text="${房源面积}"
              onClick={clipcopy}
            >房源面积</Button></Tooltip>
            <Tooltip title="抄表单上期读数"><Button className={styles.button}
              data-clipboard-text="${上期读数}"
              onClick={clipcopy}
            >上期读数</Button></Tooltip>
            <Tooltip title="抄表单本期读数"><Button className={styles.button}
              data-clipboard-text="${本期读数}"
              onClick={clipcopy}
            >本期读数</Button></Tooltip>
            <Tooltip title="抄表单用量"><Button className={styles.button}
              data-clipboard-text="${本期使用}"
              onClick={clipcopy}
            >本期使用</Button></Tooltip>
            <Button className={styles.button}
              data-clipboard-text="${费用单价}"
              onClick={clipcopy}
            >费用单价</Button>
            <Button className={styles.button}
              data-clipboard-text="${使用金额}"
              onClick={clipcopy}
            >使用金额</Button>
            <Tooltip title="出账单后截至的缴费时间，根据账单生成日加上缴交时间距离通知单日的天数得出">
              <Button className={styles.button}
                data-clipboard-text="${缴费期限}"
                onClick={clipcopy}
              >缴费期限</Button></Tooltip>
            <Tooltip title="通知单的起至账单日，如：2019-07-01至2019-09-30">
              <Button className={styles.button} data-clipboard-text="${计费时段}"
                onClick={clipcopy}
              >计费时段</Button></Tooltip>
            <Button className={styles.button} data-clipboard-text="${通知单号}"
              onClick={clipcopy}
            >通知单号</Button>
            <Button className={styles.button} data-clipboard-text="${收款单号}"
              onClick={clipcopy}
            >收款单号</Button>
            <Tooltip title="收款单明细，自动生成表格"><Button className={styles.button}
              data-clipboard-text="${收款明细}"
              onClick={clipcopy}
            >收款明细</Button></Tooltip>
          </Row>
        </Card>
        <Card className={styles.card2}>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              lg={24}
              // wholeLine={true}
              type="textarea"
              field="sql"
              label="SQL(存储过程和SQL语句必须声明单据Id参数call sp_PayNotice(@MainId);)"
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <Col lg={24}>
              <div className="clearfix">
                <Upload
                  accept='.doc,.docx'
                  action={process.env.basePath + '/Template/Upload'}
                  fileList={fileList}
                  listType="picture-card"
                  onChange={handleChange}
                  onRemove={handleRemove}
                >
                  {fileList.length > 1 ? null : uploadButton}
                </Upload>
              </div>

              {getFieldDecorator('fileUrl', {
                initialValue: initData.fileUrl,
              })(
                <input type='hidden' />
              )}
            </Col>
          </Row>
        </Card>
      </Form>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);