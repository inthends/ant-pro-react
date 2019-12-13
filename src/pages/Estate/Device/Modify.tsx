// import { TreeEntity } from '@/model/models';
import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Card, Form, Row } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import { SaveDeviceForm } from "./Main.service";
import styles from './style.less';
import { GetOrgs, getCommonItems } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';
interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  types?: any[];
}

const Modify = (props: ModifyProps) => {
  const { data, form, types } = props;
  let initData = data ? data : { enabledMark: 1 };
  const baseFormProps = { form, initData };
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    return SaveDeviceForm(modifyData);
  };

  const [orgs, setOrgs] = useState<TreeNode[]>();
  const [deviceLevel, setDeviceLevel] = useState<any[]>([]);

  useEffect(() => {
    GetOrgs().then(res => {
      setOrgs(res);
    });
    //设备等级
    getCommonItems('DeviceLevel').then(res => {
      setDeviceLevel(res || []);
    });

  }, []);


  return (
    <BaseModifyProvider {...props} name="设备" save={doSave} width={780} >
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="organizeId"
              label="所属机构"
              type="tree"
              lg={8}
              treeData={orgs}
              disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择所属机构' }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="typeId"
              label="所属类别"
              lg={8}
              treeData={types}
              dropdownStyle={{ maxHeight: 400 }}
              type="tree"
              rules={[{ required: true, message: "请选择所属类别" }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="level"
              lg={8}
              label="设备等级"
              // rules={[{ required: true, message: "请选择设备等级" }]}
              type="select"
              items={deviceLevel}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="设备名称"
              lg={8}
              rules={[{ required: true, message: "请输入设备名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="code"
              label="设备编号"
              lg={8}
              rules={[{ required: true, message: "请输入设备编号" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="num"
              label="数量"
              lg={8}
              type='inputNumber'
              rules={[{ required: true, message: "请输入数量" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="modelNo"
              lg={8}
              label="规格型号"
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="brand"
              lg={8}
              label="品牌"
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="status"
              lg={8}
              label="使用状态"
              rules={[{ required: true, message: "请选择使用状态" }]}
              type="select"
              items={[{
                title: '在用',
                label: '在用',
                value: 1,
              }, {
                title: '停用',
                label: '停用',
                value: 2,
              }, {
                title: '报废',
                label: '报废',
                value: 3,
              }, {
                title: '闲置',
                label: '闲置',
                value: 4,
              },]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="pStructId"
              lg={16}
              label="安装位置"
              type="tree"
              rules={[{ required: true, message: "请选择安装位置" }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="installType"
              lg={8}
              label="安装类型"
              type="select" 
              items={[{
                title: '单台运行',
                label: '单台运行',
                value: 1,
              }, {
                title: '一用一备',
                label: '一用一备',
                value: 2,
              }, {
                title: '二用一备',
                label: '二用一备',
                value: 3,
              }, {
                title: '多用一备',
                label: '多用一备',
                value: 4,
              }, {
                title: '一用多备',
                label: '一用多备',
                value: 5,
              }]}
              rules={[{ required: true, message: "请选择安装类型" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>

            <ModifyItem
              {...baseFormProps}
              field="dateLimit"
              lg={8}
              type='inputNumber'
              label="使用年限"
              rules={[{ required: true, message: "请输入使用年限" }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="useDate"
              lg={8}
              type='date'
              label="投用日期"
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="factory"
              lg={8}
              label="出厂厂家"
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="factoryNo"
              lg={8}
              label="出厂序号"
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="factoryDate"
              lg={8}
              type='date'
              label="出厂日期"
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="transferDate"
              lg={8}
              type='date'
              label="交接日期"
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="maintainUser"
              lg={8}
              label="维保商"
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="maintenanceBeginDate"
              lg={8}
              type='date'
              label="维保期间起"
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="maintenanceEndDate"
              lg={8}
              type='date'
              label="至"
            ></ModifyItem>

          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              // wholeLine={true}
              lg={24}
              type="textarea"
              field="description"
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};
export default Form.create<ModifyProps>()(Modify);
