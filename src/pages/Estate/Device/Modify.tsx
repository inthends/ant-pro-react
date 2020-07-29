
import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { Button, Icon, Tag, message, Modal, Divider, Table, Tabs, Col, TreeSelect, Card, Form, Row } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import { DefaultPagination } from "@/utils/defaultSetting";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import {
  RemoveRepairForm, RemoveDefectForm, RemoveMaintenanceForm,
  SaveDeviceForm, GetMaintenanceListJson,
  GetRepairListJson, GetDefectListJson
} from "./Main.service";
import styles from './style.less';
import { GetOrgs, GetCommonItems } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';
import moment from 'moment';

import ModifyMaintenance from './ModifyMaintenance';
import ModifyRepair from './ModifyRepair';
import ModifyDefect from './ModifyDefect';

const { TabPane } = Tabs;
interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  types?: any[];
  unitData?: any[];
}

const Modify = (props: ModifyProps) => {
  const { data, form, types, unitData, visible } = props;
  let initData = data ? data : { enabledMark: 1 };
  let deviceId = data ? data.id : '';
  const baseFormProps = { form, initData };
  const { getFieldDecorator } = form;
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    return SaveDeviceForm(modifyData);
  };

  const [orgs, setOrgs] = useState<TreeNode[]>();
  const [deviceLevel, setDeviceLevel] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      GetOrgs().then(res => {
        setOrgs(res);
      });
      //设备等级
      GetCommonItems('DeviceLevel').then(res => {
        setDeviceLevel(res || []);
      });
      if (data) {
        initMaintenanceLoadData();
        initRepairLoadData();
        initDefectLoadData();
      }
    }
  }, [visible]);


  //维保记录-begin
  const [loadingMaintenance, setLoadingMaintenance] = useState<boolean>(false);
  const [dataMaintenance, setDataMaintenance] = useState<any[]>([]);
  const [paginationMaintenance, setPaginationMaintenance] = useState<PaginationConfig>(new DefaultPagination());
  const loadMaintenance = formData => {
    setLoadingMaintenance(true);
    formData.sidx = formData.sidx || "id";
    formData.sord = formData.sord || "asc";
    return GetMaintenanceListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaginationMaintenance(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setDataMaintenance(res.data);
      setLoadingMaintenance(false);
      return res;
    });
  };

  const initMaintenanceLoadData = () => {
    const queryJson = { deviceId: deviceId };
    const sidx = "id";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = paginationMaintenance;
    return loadMaintenance({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  //刷新
  const loadDataMaintenance = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paginationMaintenance.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { deviceId: deviceId },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return loadMaintenance(searchCondition).then(res => {
      return res;
    });
  };

  const changePageMaintenance = (pagination: PaginationConfig, filters, sorter) => {
    loadDataMaintenance(pagination, sorter);
  };

  // //关闭弹出的规则页面
  // const closeRuleItem = () => {
  //   setRuleItemVisible(false);
  // };

  const doModifyMaintenance = record => {
    setMaintenanceItem(record);
    setMaintenanceVisible(true);
  };

  const doAddMaintenance = (record?) => {
    setMaintenanceItem(record);
    setMaintenanceVisible(true);
  };

  const doDeleteMaintenance = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确定要删除吗？`,
      onOk: () => {
        RemoveMaintenanceForm(record.id)
          .then(() => {
            message.success("删除成功");
            initMaintenanceLoadData();
          })
          .catch(e => { });
      }
    });
  };

  const columnsMaintenance = [
    {
      title: "维保单号",
      dataIndex: "billCode",
      key: "billCode",
      width: 100,
    },
    {
      title: "计划时间",
      dataIndex: "planDate",
      key: "planDate",
      width: 80,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: "完成时间",
      dataIndex: "finishDate",
      key: "finishDate",
      width: 80,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: " 完成人",
      dataIndex: "finishUserName",
      key: "finishUserName",
      width: 80
    },
    {
      title: " 完成情况",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">待处理</Tag>;
          case 1:
            return <Tag color="#e2aa5c">逾期</Tag>;
          case 2:
            return <Tag color="#40A9FF">已完成</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: "维保内容",
      dataIndex: "memo",
      key: "memo",
      width: 100,
    },

    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      fixed: 'right',
      width: 105,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => doModifyMaintenance(record)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => doDeleteMaintenance(record)} key="delete">删除</a>
          </span>
        ];
      }
    }
  ] as ColumnProps<any>[];
  const [maintenanceVisible, setMaintenanceVisible] = useState<boolean>(false);
  const [maintenanceItem, setMaintenanceItem] = useState<any>();
  //维保记录-end


  //维修记录-begin
  const [loadingRepair, setLoadingRepair] = useState<boolean>(false);
  const [dataRepair, setDataRepair] = useState<any[]>([]);
  const [paginationRepair, setPaginationRepair] = useState<PaginationConfig>(new DefaultPagination());
  const loadRepair = formData => {
    setLoadingRepair(true);
    formData.sidx = formData.sidx || "id";
    formData.sord = formData.sord || "asc";
    return GetRepairListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaginationRepair(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setDataRepair(res.data);
      setLoadingRepair(false);
      return res;
    });
  };

  const initRepairLoadData = () => {
    const queryJson = { deviceId: deviceId };
    const sidx = "id";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = paginationRepair;
    return loadRepair({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  //刷新
  const loadDataRepair = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paginationRepair.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { deviceId: deviceId },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return loadRepair(searchCondition).then(res => {
      return res;
    });
  };

  const changePageRepair = (pagination: PaginationConfig, filters, sorter) => {
    loadDataRepair(pagination, sorter);
  };

  // //关闭弹出的规则页面
  // const closeRuleItem = () => {
  //   setRuleItemVisible(false);
  // };

  const doModifyRepair = record => {
    setRepairItem(record);
    setRepairVisible(true);
  };

  const doAddRepair = (record?) => {
    setRepairItem(record);
    setRepairVisible(true);
  };

  const doDeleteRepair = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确定要删除吗？`,
      onOk: () => {
        RemoveRepairForm(record.id)
          .then(() => {
            message.success("删除成功");
            initRepairLoadData();
          })
          .catch(e => { });
      }
    });
  };

  const columnsRepair = [
    {
      title: "维修单号",
      dataIndex: "billCode",
      key: "billCode",
      width: 100,
    },
    {
      title: " 维修日期",
      dataIndex: "billDate",
      key: "billDate",
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: " 维修内容",
      dataIndex: "contents",
      key: "contents",
      width: 100,
    },

    {
      title: " 故障判断",
      dataIndex: "breakdown",
      key: "breakdown",
      width: 100,
    },

    {
      title: " 维修费用",
      dataIndex: "fee",
      key: "fee",
      width: 100,
    },

    {
      title: "完成时间",
      dataIndex: "finishDate",
      key: "finishDate",
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: " 完成人",
      dataIndex: "finishUserName",
      key: "finishUserName",
      width: 100
    },
    {
      title: "是否合格",
      dataIndex: "status",
      key: "status",
      align: 'center',
      width: 80,
      render: val => val ? <Tag color="#61c33a">合格</Tag> : <Tag color="#d82d2d">不合格</Tag>
    },
    {
      title: "验收时间",
      dataIndex: "checkDate",
      key: "checkDate",
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: "验收情况",
      dataIndex: "checkMemo",
      key: "checkMemo",
    },

    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      fixed: 'right',
      width: 105,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => doModifyRepair(record)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => doDeleteRepair(record)} key="delete">删除</a>
          </span>
        ];
      }
    }
  ] as ColumnProps<any>[];


  const [repairVisible, setRepairVisible] = useState<boolean>(false);
  const [repairItem, setRepairItem] = useState<any>();
  //维修记录-end


  //设备缺陷-begin
  const [loadingDefect, setLoadingDefect] = useState<boolean>(false);
  const [dataDefect, setDataDefect] = useState<any[]>([]);
  const [paginationDefect, setPaginationDefect] = useState<PaginationConfig>(new DefaultPagination());
  const loadDefect = formData => {
    setLoadingDefect(true);
    formData.sidx = formData.sidx || "id";
    formData.sord = formData.sord || "asc";
    return GetDefectListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaginationDefect(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setDataDefect(res.data);
      setLoadingDefect(false);
      return res;
    });
  };

  const initDefectLoadData = () => {
    const queryJson = { deviceId: deviceId };
    const sidx = "id";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = paginationRepair;
    return loadDefect({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  //刷新
  const loadDataDefect = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paginationRepair.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { deviceId: deviceId },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return loadDefect(searchCondition).then(res => {
      return res;
    });
  };

  const changePageDefect = (pagination: PaginationConfig, filters, sorter) => {
    loadDataDefect(pagination, sorter);
  };

  // //关闭弹出的规则页面
  // const closeRuleItem = () => {
  //   setRuleItemVisible(false);
  // };

  const doModifyDefect = record => {
    setDefectItem(record);
    setDefectVisible(true);
  };

  const doAddDefect = (record?) => {
    setDefectItem(record);
    setDefectVisible(true);
  };

  const doDeleteDefect = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确定要删除吗？`,
      onOk: () => {
        RemoveDefectForm(record.id)
          .then(() => {
            message.success("删除成功");
            initRepairLoadData();
          })
          .catch(e => { });
      }
    });
  };

  const columnsDefect = [
    {
      title: "缺陷内容",
      dataIndex: "memo",
      key: "memo",
      width: 300,
    },
    {
      title: "登记人",
      dataIndex: "createUserName",
      key: "createUserName",
      width: 120,
    },
    {
      title: "登记时间",
      dataIndex: "createDate",
      key: "createDate",
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },

    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      fixed: 'right',
      width: 105,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => doModifyDefect(record)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => doDeleteDefect(record)} key="delete">删除</a>
          </span>
        ];
      }
    }
  ] as ColumnProps<any>[];

  const [defectVisible, setDefectVisible] = useState<boolean>(false);
  const [defectItem, setDefectItem] = useState<any>();
  //设备缺陷-end 


  return (
    <BaseModifyProvider {...props} name="设备" save={doSave} width={780} >
      <Tabs defaultActiveKey="1" >
        <TabPane tab="基本信息" key="1">
          <Card className={styles.card} hoverable>
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
                {/* <ModifyItem
              {...baseFormProps}
              field="pStructId"
              lg={16}
              label="安装位置"
              type="tree"
              treeData={unitData}
              rules={[{ required: true, message: "请选择安装位置" }]}
            ></ModifyItem> */}

                <Col lg={16}>
                  <Form.Item label="安装位置" required>
                    {getFieldDecorator('pStructId', {
                      initialValue: initData.pStructId,
                      rules: [{ required: true, message: '请选择安装位置' }],
                    })(
                      <TreeSelect
                        placeholder="请选择安装位置"
                        allowClear
                        // onChange={onChange}
                        dropdownStyle={{ maxHeight: 300 }}
                        treeData={unitData}
                        treeDataSimpleMode={true} >
                      </TreeSelect>
                    )}
                  </Form.Item>
                </Col>

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

        </TabPane>
        <TabPane tab="维保记录" key="2">
          <Card hoverable>
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => doAddMaintenance()}  >
                <Icon type="plus" />新增</Button>
            </div>
            <Table
              style={{ border: 'none' }}
              bordered={false}
              size="middle"
              dataSource={dataMaintenance}
              columns={columnsMaintenance}
              rowKey={record => record.id}
              pagination={paginationMaintenance}
              scroll={{ x: 700 }}
              loading={loadingMaintenance}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePageMaintenance(pagination, filters, sorter)
              }
            />
          </Card>
        </TabPane>
        <TabPane tab="维修记录" key="3">
          <Card hoverable>
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => doAddRepair()}  >
                <Icon type="plus" />新增</Button>
            </div>
            <Table
              style={{ border: 'none' }}
              bordered={false}
              size="middle"
              dataSource={dataRepair}
              columns={columnsRepair}
              rowKey={record => record.id}
              pagination={paginationRepair}
              scroll={{ x: 1100 }}
              loading={loadingRepair}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePageRepair(pagination, filters, sorter)
              }
            />
          </Card>
        </TabPane>
        <TabPane tab="设备缺陷" key="4">
          <Card hoverable>
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Button type="link" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => doAddDefect()}  >
                <Icon type="plus" />新增</Button>
            </div>
            <Table
              style={{ border: 'none' }}
              bordered={false}
              size="middle"
              dataSource={dataDefect}
              columns={columnsDefect}
              rowKey={record => record.id}
              pagination={paginationDefect}
              loading={loadingDefect}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePageDefect(pagination, filters, sorter)
              }
            />
          </Card>
        </TabPane>
      </Tabs>


      <ModifyMaintenance
        visible={maintenanceVisible}
        closeDrawer={() => setMaintenanceVisible(false)}
        data={maintenanceItem}
        reload={initMaintenanceLoadData}
        deviceId={deviceId}
      />


      <ModifyRepair
        visible={repairVisible}
        closeDrawer={() => setRepairVisible(false)}
        data={repairItem}
        reload={initRepairLoadData}
        deviceId={deviceId}
      />

      <ModifyDefect
        visible={defectVisible}
        closeDrawer={() => setDefectVisible(false)}
        data={defectItem}
        reload={initDefectLoadData}
        deviceId={deviceId}
      />

    </BaseModifyProvider>
  );
};
export default Form.create<ModifyProps>()(Modify);
