//巡检内容
import { Divider, message, Table, Icon, Input, Modal, Button, Drawer, Card, Form } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { GetPointcontentPageListByID, RemoveLineContentPoint, RemoveLineContentPointAll } from "./Main.service";
import DeviceContentModify from './DeviceContentModify';
const Search = Input.Search;

interface PlanContentProps {
  visible: boolean;
  planDeviceId: string;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const PlanContent = (props: PlanContentProps) => {
  const { visible, closeDrawer, planDeviceId } = props;
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (planDeviceId) {
        //获取明细
        initLoadData(search, planDeviceId);
      }
    }
  }, [visible]);

  //初始化
  const initLoadData = (search, lineId) => {
    const queryJson = {
      keyword: search,
      planDeviceId: planDeviceId
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
        planDeviceId: planDeviceId
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
    return GetPointcontentPageListByID(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setData(res.data);
      setLoading(false);
      return res;
    });
  };

  const [currData, setCurrData] = useState<any>();
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);

  const closeModal = () => {
    setModifyVisible(false);
  };
  const showModal = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 120,
      sorter: true
    },
    {
      title: '维保内容',
      dataIndex: 'contentName',
      key: 'contentName',
      width: 120,
      sorter: true
    },
    {
      title: '频次单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80, 
    },
    {
      title: "类别",
      dataIndex: "typeName",
      key: "typeName",
      width: 100
    },
    {
      title: "维保角色",
      dataIndex: "roleName",
      key: "roleName",
      width: 100
    },
    {
      title: "标准要求",
      dataIndex: "criterion",
      key: "criterion",
      width: 180
    },
    {
      title: "检查方法",
      dataIndex: "checkWay",
      key: "checkWay",
      width: 100
    }, 
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        return [
          <span key='span'>
            <a onClick={() => showModal(record)} key="modify">编辑</a>
            <Divider type="vertical" />
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要删除${record.contentName}？`,
                cancelText: '取消',
                okText: '确定',
                onOk: () => {
                  RemoveLineContentPoint(record.id).then(res => {
                    initLoadData(search, planDeviceId);
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
    <Drawer
      title='维保内容'
      placement="right"
      width={800}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Card>
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
                  RemoveLineContentPointAll(planDeviceId).then(res => {
                    message.success('删除成功');
                    initLoadData(search, planDeviceId);
                  });
                },
              });
            }}
          ><Icon type="delete" />全部删除</Button>
          <Button type="link" style={{ float: 'right', marginLeft: '1px' }} onClick={() => showModal()}>
            <Icon type="plus" />
            添加内容
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
          dataSource={data}
          rowKey="id"
          pagination={pagination}
          scroll={{ y: 500, x: 1100 }}
          loading={loading}
        />
      </Card>
      <div
        style={{
          position: 'absolute',
          zIndex: 999,
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={closeDrawer} >
          关闭
        </Button>
      </div>
      <DeviceContentModify
        visible={modifyVisible}
        closeModal={closeModal}
        data={currData}
        planDeviceId={planDeviceId}
        reload={() => {
          initLoadData(search, planDeviceId); //刷新数据 
        }}
      />

    </Drawer>
  );
};

export default Form.create<PlanContentProps>()(PlanContent);
