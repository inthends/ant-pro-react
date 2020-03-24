import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { message, Divider, Icon, Table, Modal, Button, Input, Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import {MovePoint, SaveFormLine, GetLinePonitPageListByID, RemoveLinePoint, RemoveLinePointAll } from "./Main.service";
import { GetOrgEsates } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import SelectHouse from './SelectHouse';
import LineContent from './LineContent';

import styles from './style.less';
const Search = Input.Search;

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
  typeId: string;
  typeName: string;
  treeData: any[];
};

const Modify = (props: ModifyProps) => {
  const { data, form, visible, treeData } = props;
  const { getFieldDecorator } = form;
  let initData = data ? data : { unit: '月' };
  const baseFormProps = { form, initData };
  const [orgs, setOrgs] = useState<TreeNode[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [linepointData, setLinepointData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectPointVisible, setSelectPointVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [lineId, setLineId] = useState<string>('');

  const doSave = dataDetail => {
    let modifyData = {
      ...initData, ...dataDetail,
      keyValue: lineId,
      type: isAdd
    };
    modifyData.beginDate = modifyData.beginDate.format('YYYY-MM-DD');
    modifyData.endDate = modifyData.endDate.format('YYYY-MM-DD');
    return SaveFormLine(modifyData);
  };

  const GetGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  useEffect(() => {
    GetOrgEsates().then(res => {
      setOrgs(res);
    });
  }, []);

  useEffect(() => {
    if (visible) {

      //巡检角色
      // GetTreeRoleJson().then(res => {
      //   setRoles(res || []);
      // });

      if (data) {
        setLineId(data.id);
        // setLoading(true);
        initLoadData(search, data.id);
        // setLoading(false);
        setIsAdd(false);

      } else {
        setLineId(GetGuid());
        setLinepointData([]);
      }
    }
  }, [visible]);

  //初始化
  const initLoadData = (search, lineId) => {
    const queryJson = {
      keyword: search,
      LineId: lineId
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadData = (searchText, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(searchText);//查询的时候，必须赋值，否则查询条件会不起作用 
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        LineId: lineId
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetLinePonitPageListByID(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setLinepointData(res.data);
      setLoading(false);
      return res;
    });
  };

  const [entity, setEntity] = useState<any>({});
  const add = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //获取值
        var obj = {
          keyValue: lineId,
          id: lineId,
          organizeId: values.organizeId,
          pStructId: values.pStructId,
          name: values.name,
          code: values.code,
          memo: values.memo
        }
        setEntity(obj);
        setSelectPointVisible(true);
      }
    });
  };

  const closeSelectPoint = () => {
    setSelectPointVisible(false);
  };

  const [pointcontentVisible, setPointcontentVisible] = useState<boolean>(false);
  const [lpId, setLpId] = useState<any>();
  const doModify = record => {
    setLpId(record.id);
    setPointcontentVisible(true);
  };

  const columns = [
    {
      title: '点位编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '点位名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
    },
    {
      title: '描述',
      dataIndex: 'allName',
      key: 'allName',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 220,
      render: (text, record) => {
        return [
          <span key='span'>
            <a onClick={() => doModify(record)} key="modify">巡检内容</a>
            <Divider type="vertical" key='divider2' />
            <a onClick={() => { 
              MovePoint(record.id,0).then(res => {
                initLoadData(search, lineId);
              })
            }
            } key="modify">上移</a>

            <Divider type="vertical" key='divider3' />
            <a onClick={() =>   
            { 
              MovePoint(record.id,1).then(res => {
                initLoadData(search, lineId);
              })
            }
            
            } key="modify">下移</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要删除${record.name}？`,
                cancelText: '取消',
                okText: '确定',
                onOk: () => {
                  RemoveLinePoint(record.id).then(res => {
                    initLoadData(search, lineId);
                  })
                }
              })
            }} key="delete">删除</a>
          </span>
        ];
      },
    }
  ] as ColumnProps<any>[];

  return (
    <BaseModifyProvider {...props}
      width={700}
      name="巡检路线" save={doSave}>
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="pStructId"
              label="所属楼盘"
              type="tree"
              lg={24}
              dropdownStyle={{ maxHeight: 380 }}
              treeData={orgs}
              disabled={initData.pStructId != undefined}
              rules={[{ required: true, message: '请选择所属楼盘' }]}
              onChange={(value, item, option) => {
                const organizeId = option.triggerNode.props.parentId;
                form.setFieldsValue({ organizeId: organizeId });
              }}
            ></ModifyItem>

            {getFieldDecorator('organizeId', {
              initialValue: initData.organizeId,
            })(
              <input type='hidden' />
            )}

            {/* <ModifyItem
              {...baseFormProps}
              field="roleId"
              label="巡检角色"
              type='select'
              items={roles}
              rules={[{ required: true, message: "请选择巡检角色" }]}
            ></ModifyItem> */}

          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="name"
              label="名称"
              rules={[{ required: true, message: "请输入名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="code"
              label="编号"
              rules={[{ required: true, message: "请输入编号" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="beginDate"
              label="开始日期"
              type='date'
              rules={[{ required: true, message: "请选择开始日期" }]}
            ></ModifyItem>

            <ModifyItem
              {...baseFormProps}
              field="endDate"
              label="结束日期"
              type='date'
              rules={[{ required: true, message: "请选择结束日期" }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              // wholeLine={true}
              lg={24}
              type="textarea"
              field="memo"
              label="备注"
            ></ModifyItem>
          </Row>
          <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
            <Search className="search-input"
              placeholder="请输入要查询的关键词"
              style={{ width: 200 }}
              onSearch={value => loadData(value)} />
            <Button type="link" style={{ float: 'right' }}
              onClick={() => {
                Modal.confirm({
                  title: '请确认',
                  content: `您是否确定全部删除？`,
                  onOk: () => {
                    if (data != null || data.id != '') {
                      RemoveLinePointAll(data.id).then(res => {
                        message.success('删除成功');
                        initLoadData(search, lineId);
                      });
                    }
                  },
                });
              }}
            ><Icon type="delete" />全部删除</Button>
            <Button type="link" style={{ float: 'right', marginLeft: '1px' }} onClick={add}>
              <Icon type="plus" />
              添加点位
              </Button>
          </div>
          <Table
            key="list"
            onChange={(paginationConfig, filters, sorter) => {
              loadData(search, paginationConfig, sorter)
            }
            }
            bordered={false}
            size="middle"
            columns={columns}
            dataSource={linepointData}
            rowKey={record => record.id}
            pagination={pagination}
            scroll={{ y: 500, x: 800 }}
            loading={loading}
          />
        </Form>
      </Card>
      <SelectHouse
        visible={selectPointVisible}
        closeModal={closeSelectPoint}
        entity={entity}
        treeData={treeData}
        reload={() => {
          //刷新数据 
          initLoadData(search, lineId);
          setIsAdd(false);
        }}
      />

      <LineContent
        visible={pointcontentVisible}
        closeDrawer={() => setPointcontentVisible(false)}
        lpId={lpId}
        reload={() => { }}
      />
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
