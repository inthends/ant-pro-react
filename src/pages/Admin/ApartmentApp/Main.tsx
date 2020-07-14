import { DefaultPagination } from "@/utils/defaultSetting";
import { Icon, Button, Input, Layout } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import Approve from "./Approve";
import Modify from "./Modify";
import { GetAppPageListJson } from "./ApartmentApp.service";
const { Content } = Layout;
const { Search } = Input;
interface SearchParam {
  // condition: "EnCode" | "FullName";
  keyword: string;
};

const Main = () => {
  const [search, setSearch] = useState<SearchParam>({
    // condition: "EnCode",
    keyword: ""
  });

  // const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [viewVisible, setViewVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  // const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>( new DefaultPagination());  

  useEffect(() => {
    initLoadData(search);
  }, []);

  // const closeDrawer = () => {
  //   setModifyVisible(false);
  // };

  const showDrawer = (id?) => {
    // setCurrData(item);
    setInstanceId(id);
    setAddVisible(true);
  };


  //查看
  const [instanceId, setInstanceId] = useState<string>();
  const showViewDrawer = (id?) => {
    setInstanceId(id);
    setViewVisible(true);
  };


  // const showChoose = (item?) => {
  //   // setUserVisible(true);
  //   setCurrData(item);
  // };

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
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : "createDate";
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };


  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "createDate";
    formData.sord = formData.sord || "asc";
    return GetAppPageListJson(formData).then(res => {
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
    const sidx = "createDate";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Content  >
        <div style={{ marginBottom: 20, padding: "3px 0" }}>
          <Search
            className="search-input"
            placeholder="搜索标题"
            onSearch={keyword => loadData({ ...search, keyword })}
            style={{ width: 180 }}
          />
          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => {
              // setCurrData(undefined);
              setInstanceId(undefined);
              setAddVisible(true);
            }}>
            <Icon type="plus" />
            申请
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
          view={showViewDrawer}
          // choose={showChoose}
          reload={() => initLoadData(search)}
          setData={setData}
        />
      </Content>

      <Modify
        visible={addVisible}
        closeDrawer={() => setAddVisible(false)}
        // data={currData}
        instanceId={instanceId}
        isReSubmit={false}
        reload={() => initLoadData({ ...search })}
      />

      <Approve
        visible={viewVisible}
        closeDrawer={() => setViewVisible(false)}
        isView={true}
        instanceId={instanceId}
        reload={() => initLoadData(search)}
      />

    </Layout>
  );
};

export default Main;
