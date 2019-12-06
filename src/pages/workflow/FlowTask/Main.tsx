import { DefaultPagination } from '@/utils/defaultSetting';
import { Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import ListTable from './ListTable';
import { GetDataList } from './FlowTask.service';
//合同审批
import Approve from '../../Contract/List/Approve';
//合同退租验房
import RoomCheck from '../../Contract/List/RoomCheck';
//合同退租结算
import BillCheck from '../../Contract/List/BillCheck';

const { Content } = Layout;
const { Search } = Input;
interface SearchParam {
  keyword: string;
};

const Main = () => {
  const [search, setSearch] = useState<SearchParam>({
    keyword: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [roomcheckVisible, setRoomCheckVisible] = useState<boolean>(false);
  const [billcheckVisible, setBillCheckVisible] = useState<boolean>(false);
  const [approveVisible, setApproveVisible] = useState<boolean>(false);
  const [flowId, setFlowId] = useState<string>();
  const [id, setId] = useState<string>();
  const [instanceId, setInstanceId] = useState<string>();

  useEffect(() => {
    initLoadData(search);
  }, []);

  //初始化
  const initLoadData = (searchParam: SearchParam) => {
    // setSearch(searchParam);
    const queryJson = searchParam;
    const sidx = 'ReceiveTime';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //刷新
  const loadData = (searchParam: any, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(searchParam);//查询的时候，必须赋值，否则查询条件会不起作用 
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: searchParam,
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'ReceiveTime';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'ReceiveTime';
    formData.sord = formData.sord || 'desc';
    return GetDataList(formData).then(res => {
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

  //approve
  const closeApproveDrawer = () => {
    setApproveVisible(false);
  };

  const showApproveDrawer = (flowId,id,instanceId) => {
    setApproveVisible(true);
    setFlowId(flowId);
    setId(id);
    setInstanceId(instanceId);
  };

  //验房
  const closeRoomCheckDrawer = () => {
    setRoomCheckVisible(false);
  };

  const showRoomCheckDrawer = (flowId,id,instanceId) => {
    setRoomCheckVisible(true);
    setFlowId(flowId);
    setId(id);
    setInstanceId(instanceId);
  };

  //结算
  const closeBillCheckDrawer = () => {
    setBillCheckVisible(false);
  };

  const showBillCheckDrawer = (flowId,id,instanceId) => {
    setBillCheckVisible(true);
    setFlowId(flowId);
    setId(id);
    setInstanceId(instanceId);
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ padding: '0 20px', overflow: 'auto' }}>
        <div style={{ marginBottom: 20, padding: '3px 0' }}>
          {/* <Select
            style={{ marginRight: 20, width: 100 }}
            value={search.condition}
            onChange={condition => loadData({ ...search, condition })}
          >
            <Option value="EnCode" key="EnCode">
              角色编号
            </Option>
            <Option value="FullName" key="FullName">
              角色名称
            </Option>
          </Select> */}
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={keyword => loadData({ ...search, keyword })}
            style={{ width: 200 }}
          />
        </div>
        <ListTable
          key='ListTable'
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          reload={() => initLoadData(search)}
          roomcheck={showRoomCheckDrawer}
          billcheck={showBillCheckDrawer}
          approve={showApproveDrawer}
        />

        <RoomCheck
          visible={roomcheckVisible}
          closeDrawer={closeRoomCheckDrawer}
          flowId={flowId}
          id={id}
          instanceId={instanceId}
          reload={() => initLoadData(search)}
        />
        
        <BillCheck
          visible={billcheckVisible}
          closeDrawer={closeBillCheckDrawer}
          flowId={flowId}
          id={id}
          instanceId={instanceId}
          reload={() => initLoadData(search)}
        />

        <Approve
          visible={approveVisible}
          closeDrawer={closeApproveDrawer}
          flowId={flowId}
          id={id}
          instanceId={instanceId}
          reload={() => initLoadData(search)}
        />

      </Content>
    </Layout>
  );
};

export default Main;
