import { DefaultPagination } from "@/utils/defaultSetting";
import { Button, Icon, Input, Layout } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import Add from "./Add";
import Modify from "./Modify";
import { GetPageListJson } from "./Code.service";
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

  const [modifyVisible, setModifyVisible] = useState<boolean>(false); 
  const [addVisible, setAddVisible] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(
    new DefaultPagination()
  );

  useEffect(() => {
    initLoadData(search);
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
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
      searchCondition.sidx = field ? field : "enCode";
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "enCode";
    formData.sord = formData.sord || "asc";
    return GetPageListJson(formData).then(res => {
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
    const sidx = "enCode";
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
            placeholder="搜索名称和编号"
            onSearch={keyword => loadData({ ...search, keyword })}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => {
              setCurrData(undefined);
              setAddVisible(true);
            }}
          >
            <Icon type="plus" />
            编码
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
          // choose={showChoose}
          reload={() => initLoadData(search)}
          setData={setData}
        />
      </Content>

      <Add
        visible={addVisible}
        closeDrawer={() => setAddVisible(false)}
        data={currData}
        reload={() => initLoadData({ ...search })}
      />

      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() => initLoadData({ ...search })}
      />
    </Layout>
  );
};

export default Main;
