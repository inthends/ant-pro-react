
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson } from './Main.service';
import ListTable from './ListTable';
// import { getResult } from '@/utils/networkUtils';
import Add from './Add';
import Modify from './Modify';
import Detail from './Detail';
import Approve from './Approve';
import Change from './Change';
import Renewal from './Renewal';
import Withdrawal from './Withdrawal';
import Forward from './Forward';
// import ChooseUser from './ChooseUser';
// import { GetQuickSimpleTreeAllForContract } from '@/services/commonItem';

const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [addVisible, setAddVisible] = useState<boolean>(false);//新建
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);//修改
  const [detailVisible, setDetailVisible] = useState<boolean>(false);//查看
  const [changeVisible, setChangeVisible] = useState<boolean>(false);//变更
  const [renewalVisible, setRenewalVisible] = useState<boolean>(false);//续租 
  const [withdrawalVisible, setWithdrawalVisible] = useState<boolean>(false);//退租 
  const [forwardVisible, setForwardVisible] = useState<boolean>(false);//结转

  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();
  const [chargeId, setChargeId] = useState<string>();
  const [search, setSearch] = useState<string>('');
  // const [treeData, setTreeData] = useState<any[]>([]); 
  // const [userVisible, setUserVisible] = useState<boolean>(false); 
  const [approveVisible, setApproveVisible] = useState<boolean>(false);

  const closeAddDrawer = () => {
    setAddVisible(false);
  };

  const showAddDrawer = (id?, chargeId?) => {
    setAddVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeModifyDrawer = () => {
    setModifyVisible(false);
  };

  const showModifyDrawer = (id?, chargeId?) => {
    setModifyVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeDetailDrawer = () => {
    setDetailVisible(false);
  };

  const showDetailDrawer = (id?, chargeId?) => {
    setDetailVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeChangeDrawer = () => {
    setChangeVisible(false);
  };

  //变更
  const showChangeDrawer = (id?, chargeId?) => {
    setChangeVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  //续租
  const showRenewalDrawer = (id?, chargeId?) => {
    setRenewalVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeRenewalDrawer = () => {
    setRenewalVisible(false);
  };

  //退租
  const showWithdrawalDrawer = (id?, chargeId?) => {
    setWithdrawalVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeWithdrawalDrawer = () => {
    setWithdrawalVisible(false);
  };

  //结转
  const showForwardDrawer = (id?, chargeId?) => {
    setForwardVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeForwardDrawer = () => {
    setForwardVisible(false);
  };




  const loadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'BillingDate';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'BillingDate';
    data.sord = data.sord || 'asc';
    return GetPageListJson(data).then(res => {
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
  const initLoadData = (search) => {
    setSearch(search);
    const queryJson = { keyword: search };
    const sidx = 'BillingDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  useEffect(() => {
    //获取房产树
    // GetQuickSimpleTreeAllForContract()
    //   .then(getResult)
    //   .then((res: any[]) => {
    //     setTreeData(res || []);
    //     return res || [];
    //   });
    initLoadData('');
  }, []);

  // const showChoose = () => {
  //   setUserVisible(true);
  //   // setCurrData(item);
  // };

  const showApproveDrawer = (id?, chargeId?) => {
    setApproveVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeApproveDrawer = () => {
    setApproveVisible(false);
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Content  >
        <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
          <Search
            className="search-input"
            placeholder="搜索合同编号"
            style={{ width: 200 }}
            onSearch={value => loadData(value)}
          />
          <Button type="primary" style={{ float: 'right' }}
            onClick={() => showAddDrawer()}
          >
            <Icon type="plus" />
            合同
          </Button>
        </div>

        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          detail={showDetailDrawer}
          modify={showModifyDrawer}
          approve={showApproveDrawer}
          change={showChangeDrawer}
          renewal={showRenewalDrawer}
          withdrawal={showWithdrawalDrawer}
          forward={showForwardDrawer}
          reload={() => initLoadData(search)} />
      </Content>

      <Add
        visible={addVisible}
        closeDrawer={closeAddDrawer}
        // treeData={treeData}
        id={id}
        reload={() => initLoadData(search)}
      />

      <Modify
        visible={modifyVisible}
        closeDrawer={closeModifyDrawer}
        // treeData={treeData}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      // choose={showChoose}
      />

      <Detail
        visible={detailVisible}
        closeDrawer={closeDetailDrawer}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      />

      <Approve
        visible={approveVisible}
        closeDrawer={closeApproveDrawer}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      />

      {/* <ChooseUser
        visible={userVisible}
        close={() => setUserVisible(false)}
      /> */}

      <Change
        visible={changeVisible}
        closeDrawer={closeChangeDrawer}
        // treeData={treeData}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      // choose={showChoose}
      />

      <Renewal
        visible={renewalVisible}
        closeDrawer={closeRenewalDrawer}
        // treeData={treeData}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      // choose={showChoose}
      />

      <Withdrawal
        visible={withdrawalVisible}
        closeDrawer={closeWithdrawalDrawer}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      />

      <Forward
        visible={forwardVisible}
        closeDrawer={closeForwardDrawer}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      />

    </Layout>
  );
}

export default Main;
