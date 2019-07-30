import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetQuickPStructsTreeJsonAll, GetPageListJson } from './Main.service';
import ListTable from './ListTable';
import Modify from './Modify';

const { Content } = Layout;
const { Search } = Input;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());

  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();

  const [FeeKind, SetFeeKind] = useState<string>('');
  const [FeeType, SetFeeType] = useState<string>('');
  const [search, setSearch] = useState<string>('');


  const selectTree = (item, search) => {

    var feeKind = "", feeType = "";
    switch (item.value) {
      case "All":
        feeKind = "";
        feeType = "";
        break;
      case "FeeType":
        feeType = item.text;
        feeKind = item.AttributeValue;
        break;
      case "PaymentItem":
        feeKind = item.text;
        feeType = "";
        break;
      case "ReceivablesItem":
        feeKind = item.text;
        feeType = "";
        break;
      default:
        feeKind = item.text;
        feeType = "";
        break;
    }

    SetFeeKind(feeKind);
    SetFeeType(feeType);
    initLoadData(feeKind, feeType, search);

  };

  useEffect(() => {
    getTreeData().then(res => {
      SetFeeKind('');
      SetFeeType('');
      initLoadData('', '', '');
    });
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetQuickPStructsTreeJsonAll()
      .then(getResult)
      .then((res: TreeEntity[]) => {
        setTreeData(res || []);
        return res || [];
      });
  };

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (id?) => {
    setModifyVisible(true);
    setId(id);
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
      queryJson: { FeeKind: FeeKind, FeeType: FeeType, keyword: search },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
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
  const initLoadData = (FeeKind, FeeType, search) => {
    setSearch(search);
    const queryJson = { FeeKind: FeeKind, FeeType: FeeType, keyword: search };
    const sidx = 'BillingDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  return (
    <Layout style={{ height: '100%' }}>

      <Content style={{ padding: '0 20px' }}>



        <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
          <Search
            className="search-input"
            placeholder="搜索合同名称或编号"
            style={{ width: 200 }}
            onSearch={value => loadData(value)}
          />
          <Button type="primary" style={{ float: 'right' }}
            onClick={() => showDrawer()}
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
          modify={showDrawer}
          reload={() => initLoadData(FeeKind, FeeType, search)}
        />


      </Content>


      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={treeData}
        id={id}
        reload={() => initLoadData(FeeKind, FeeType, search)}
      />
    </Layout>
  );
}

export default Main;
