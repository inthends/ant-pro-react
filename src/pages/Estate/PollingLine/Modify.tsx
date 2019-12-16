import { BaseModifyProvider } from "@/components/BaseModifyDrawer/BaseModifyDrawer";
import ModifyItem from "@/components/BaseModifyDrawer/ModifyItem";
import { message, Divider, Icon, Table, Modal, Button, Input, Form, Row, Card } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import { SaveForm, GetPageListByID, RemoveLinePoint, RemoveLinePointAll } from "./Main.service";
import { GetOrgs } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import SelectHouse from './SelectHouse';

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
  const [linepointData, setLinepointData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [selectPointVisible, setSelectPointVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [keyValue, setKeyValue] = useState<string>('');

  const doSave = dataDetail => {
    let modifyData = {
      ...initData, ...dataDetail,
      keyValue: keyValue,
      type: isAdd ? 1 : 0
    };
    return SaveForm(modifyData);
  };

  const GetGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  useEffect(() => {
    if (visible) {
      setLoading(true);
      GetOrgs().then(res => {
        setOrgs(res);
        setLoading(false);
      });
      if (initData.id === undefined) {
        setKeyValue(GetGuid());
      }
      else {
        setKeyValue(initData.id);
      }
    }
  }, [visible]);

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
        MeterId:  keyValue
      },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = data => {
    // setMeterLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetPageListByID(data).then(res => {
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
      return res;
    });
  };

  //房屋费表初始化
  const initLoadData = (search) => {
    const queryJson = {
      keyword: search,
      MeterId: keyValue
    }
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const [entity, setEntity] = useState<any>({});
  const add = () => {
    form.validateFields((errors, values) => {
      if (!errors) {

        //获取值
        var obj = {
          keyValue: keyValue,
          id: keyValue,
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

  const columns = [
    {
      title: '点位编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      sorter: true
    },
    {
      title: '点位名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      sorter: true
    },
    {
      title: '描述',
      dataIndex: 'allName',
      key: 'allName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 95,
      render: (text, record) => {
        return [
          <span>
            <a key="modify">编辑</a>
            <Divider type="vertical" />
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要删除${record.code}？`,
                cancelText: '取消',
                okText: '确定',
                onOk: () => {
                  RemoveLinePoint(record.id).then(res => {
                    initLoadData(search);
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
      <Card style={styles.Card}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="pStructId"
              lg={8}
              label="所属楼盘"
              type="tree"
              treeData={orgs}
              disabled={initData.pStructId != undefined}
              rules={[{ required: true, message: '请选择所属楼盘' }]}
            ></ModifyItem>

            {getFieldDecorator('organizeId', {
              initialValue: initData.organizeId,
            })(
              <input type='hidden' />
            )}

            <ModifyItem
              {...baseFormProps}
              field="name"
              lg={8}
              label="名称"
              rules={[{ required: true, message: "请输入名称" }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="code"
              lg={8}
              label="编号"
              rules={[{ required: true, message: "请输入编号" }]}
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
          <Row>
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
                          initLoadData(search);
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
            <Table<any>
              onChange={(paginationConfig, filters, sorter) => {
                loadData(search, paginationConfig, sorter)
              }
              }
              bordered={false}
              size="middle"
              columns={columns}
              dataSource={linepointData}
              rowKey="id"
              pagination={pagination}
              scroll={{ y: 500, x: 800 }}
              loading={loading}
            //rowSelection={rowSelection}
            />
          </Row>
        </Form>
      </Card>

      <SelectHouse
        visible={selectPointVisible}
        closeModal={closeSelectPoint}
        entity={entity}
        treeData={treeData}
        reload={() => {
          //刷新数据 
          initLoadData(search);
          setIsAdd(false);
        }}
      />

    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);