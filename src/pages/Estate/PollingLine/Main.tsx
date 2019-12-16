import { DefaultPagination } from "@/utils/defaultSetting";
import { Button, Icon, Input, Layout } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import Modify from "./Modify";
import { GetPointTreeAll, GetPageLineListJson } from "./Main.service";
import { getResult } from '@/utils/networkUtils';
import { GetOrgEsates } from '@/services/commonItem';
import LeftTree from '../LeftTree';
const { Content } = Layout;
const { Search } = Input;

interface SearchParam {
  typeId: string;
  typeName: string;
  type: string;
  keyword: string;
}

const Main = () => {
  const [search, setSearch] = useState<SearchParam>({
    typeId: '',
    typeName: '',
    type: '',
    keyword: '',
  });

  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [treeData, setTreeData] = useState<any[]>([]);
  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);

  useEffect(() => {
    // GetDataItemTreeList().then((res) => {
    //   setTreeData(res || []);
    // });
    // initLoadData(search);

     
    //加载小区
    GetOrgEsates().then(res => {
      setTreeData(res || []);
      initLoadData(search);
      //加载点位
      GetPointTreeAll()
        .then(getResult)
        .then((res: any[]) => {
          setUnitTreeData(res || []);
          return res || [];
        });

    });

  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const showChoose = (item?) => {
    setCurrData(item);
  };
  const loadData = (
    searchParam: any,
    paginationConfig?: PaginationConfig,
    sorter?
  ) => {
    setSearch(searchParam);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: searchParam
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "ascend" ? "asc" : "desc";
      searchCondition.sidx = field ? field : "CreateDate";
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "CreateDate";
    formData.sord = formData.sord || "desc";
    return GetPageLineListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = (searchParam: SearchParam) => {
    setSearch(searchParam);
    const queryJson = searchParam;
    const sidx = "CreateDate";
    const sord = "desc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  const selectTreeLoad = (orgid, orgtype, searchText) => {
    //initLoadData({ ...searchText, orgid, orgtype, '1' });
  };

  return (
    <Layout style={{ height: "100%" }}>
      <LeftTree
        treeData={treeData}
        selectTree={(orgid, orgtype) => {
          selectTreeLoad(orgid, orgtype, search);
        }}
      />

      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: 20, padding: "3px 0" }}>
          <Search
            key='search'
            className="search-input"
            placeholder="请输入要查询的关键词"
            style={{ width: 200 }}
            onSearch={keyword => loadData({ ...search, keyword })}
          />

          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => showDrawer()}
          >
            <Icon type="plus" />
            路线
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
          choose={showChoose}
          reload={() => initLoadData(search)}
        />
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        typeId={search.typeId}
        treeData={unitTreeData}
        typeName={search.typeName}
        data={currData}
        reload={() => initLoadData(search)}
      />

    </Layout>
  );
};

export default Main;
