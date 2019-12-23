
import { Divider, message, Table, Icon, Input, Modal, Button, Drawer, Card, Form } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useState, useEffect } from 'react';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
const Search = Input.Search;
import { GetPointcontentPageListByID, RemoveLineContentPoint, RemoveLineContentPointAll } from "./Main.service";
import SelectPointContent from './SelectPointContent';

interface LineContentProps {
  visible: boolean;
  lpId: string;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}

const LineContent = (props: LineContentProps) => {
  const { visible, closeDrawer, lpId } = props;
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        //获取明细
        initLoadData(search, lpId);
      }
    }
  }, [visible]);

  //初始化
  const initLoadData = (search, lineId) => {
    const queryJson = {
      keyword: search,
      lpId: lpId
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
        lpId: lpId
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


  const [selectPointContentVisible, setSelectPointContentVisible] = useState<boolean>(false);

  const add = () => {
    setSelectPointContentVisible(true);
  };

  const closeSelectPointContent = () => {
    setSelectPointContentVisible(false);
  };

  const [lpcId, setLpcId] = useState<any>();
  const [pointcontentVisible, setPointcontentVisible] = useState<boolean>(false);
  const doModify = record => {
    setLpcId(record.id);
    setPointcontentVisible(true);
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
      width: 125,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => doModify(record)} key="modify">巡检内容</a>
            <Divider type="vertical" />
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要删除${record.code}？`,
                cancelText: '取消',
                okText: '确定',
                onOk: () => {
                  RemoveLineContentPoint(record.id).then(res => {
                    initLoadData(search, lpId);
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
      title='巡检内容'
      placement="right"
      width={1050}
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
                  RemoveLineContentPointAll(data.id).then(res => {
                    message.success('删除成功');
                    initLoadData(search, lpId);
                  });
                },
              });
            }}
          ><Icon type="delete" />全部删除</Button>
          <Button type="link" style={{ float: 'right', marginLeft: '1px' }} onClick={add}>
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
          scroll={{ y: 500, x: 700 }}
          loading={loading}
        //rowSelection={rowSelection}
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


      <SelectPointContent
        visible={selectPointContentVisible}
        closeModal={closeSelectPointContent} 
        reload={() => {
          //刷新数据 
          initLoadData(search, lpId);
          // setIsAdd(false);
        }}
      />

    </Drawer>
  );
};

export default Form.create<LineContentProps>()(LineContent);
