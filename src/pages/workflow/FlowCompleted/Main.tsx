//已办任务
import { DefaultPagination } from '@/utils/defaultSetting';
import { Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import ListTable from './ListTable';
import { GetDataList } from './FlowCompleted.service';
//合同审批查看
// import ContractView from '../../Contract/List/ApproveView';
import ContractApprove from '../../Contract/List/Approve';
// //收款单审批查看
// import ReceiveView from '../../Financial/ChargeBill/ApproveView';
//入住审批查看
import ApartmentApprove from '../../Admin/ApartmentApp/Approve';

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
  const [code, setCode] = useState<string>();
  const [instanceId, setInstanceId] = useState<string>();
  // const [contractVisible, setContractVisible] = useState<boolean>(false);
  // const [receiveVisible, setReceiveVisible] = useState<boolean>(false);

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

  //入住申请
  const [apartmentVisible, setApartmentVisible] = useState<boolean>(false);
  //合同审批
  const [contractVisible, setContractVisible] = useState<boolean>(false);

  const closeDrawer = () => {
    // if (flowId == 'b5011d6f-d386-4ed3-a2ab-2f2eb5597b7f'
    //   || flowId == 'b6011d6f-d386-4ed3-a2ab-2f2eb5597b7f'
    //   || flowId == 'b7011d6f-d386-4ed3-a2ab-2f2eb5597b7f'
    // ) {
    //   //合同
    //   setContractVisible(false);
    // }
    // else {
    //   //收款送审
    //   setReceiveVisible(false);
    // } 

    switch (code) {
      case '1001':
        setApartmentVisible(false);
        break;
      case '1002':
      case '1003':
        setContractVisible(false);
        break;
    }

  };


  //弹出查看
  const showDrawer = (code, id, instanceId) => {

    switch (code) {
      case '1001':
        setApartmentVisible(true);
        break;
      case '1002':
      case '1003':
        setContractVisible(true);
        break;
    }
    setCode(code);
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
            placeholder="搜索流程名称和标题"
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
          view={showDrawer}
        />


        {/*<ContractView
          visible={contractVisible}
          closeDrawer={closeDrawer}
          instanceId={instanceId}
          reload={() => initLoadData(search)}
        />

        <ReceiveView
          visible={receiveVisible}
          closeDrawer={closeDrawer}
          instanceId={instanceId}
          reload={() => initLoadData(search)}
        /> */}

        <ContractApprove
          visible={contractVisible}
          closeDrawer={closeDrawer}
          isView={true}
          instanceId={instanceId}
          reload={() => initLoadData(search)}
        />

        <ApartmentApprove
          visible={apartmentVisible}
          closeDrawer={closeDrawer}
          isView={true}
          instanceId={instanceId}
          reload={() => initLoadData(search)}
        />

      </Content>
    </Layout>
  );
};

export default Main;
