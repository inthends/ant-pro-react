import { DefaultPagination } from "@/utils/defaultSetting";
import { DatePicker, Select, Input, Layout } from "antd";
import { PaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import ListTable from "./ListTable";
import Show from "./Show";
import { GetPageTaskListJson } from "./Main.service";
import { GetOrgEsates } from '@/services/commonItem';
import LeftTree from '../LeftTree';
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
interface SearchParam {
  orgId: string;
  orgType: string;
  keyword: string;
  status: string;
  planDateBegin: string;
  planDateEnd: string;
}

const Main = () => {
  const [search, setSearch] = useState<SearchParam>({
    orgId: '',
    orgType: '',
    keyword: '',
    status: '',
    planDateBegin: '',
    planDateEnd: '',
  });

  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => { 
    //加载小区
    GetOrgEsates().then(res => {
      setTreeData(res || []);
      initLoadData(search);
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
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : "planTime";
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "planTime";
    formData.sord = formData.sord || "asc";
    return GetPageTaskListJson(formData).then(res => {
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
    const sidx = "planTime";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  const selectTreeLoad = (value, item) => {
    const page = new DefaultPagination();
    var orgId = value;
    var orgType = '';
    if (value != '') {
      orgType = item.node.props.type;
    }
    loadData({ ...search, orgId, orgType }, page);
  };

  return (
    <Layout style={{ height: "100%" }}>
      <LeftTree
        treeData={treeData}
        selectTree={(value, item) => {
          selectTreeLoad(value, item);
        }}
      />

      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: 20, padding: "3px 0" }}>
          <Search
            key='search'
            className="search-input"
            placeholder="搜索路线或点位"
            style={{ width: 180, marginRight: '5px' }}
            onSearch={keyword => loadData({ ...search, keyword })}
          />

          <Select placeholder="=单据状态="
            allowClear={true}
            style={{ width: '130px', marginRight: '5px' }}
            onChange={status => {
              loadData({ ...search, status })
            }}>
            <Option value="0">未巡检</Option>
            <Option value="1">已巡检</Option>
          </Select>

          <DatePicker
            placeholder='计划时间起'
            onChange={(date, planDateBegin) => {
              loadData({ ...search, planDateBegin })
            }} style={{ marginRight: '5px', width: '130px' }} />
              至
              <DatePicker
            placeholder='计划时间止'
            onChange={(date, planDateEnd) => {
              loadData({ ...search, planDateEnd })
            }} style={{ marginLeft: '5px', marginRight: '5px', width: '130px' }} />

          {/* <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => showDrawer()}
          >
            <Icon type="plus" />
            路线
          </Button> */}
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          show={showDrawer}
          choose={showChoose}
          reload={() => initLoadData(search)}
        />
      </Content>
      <Show
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() => initLoadData(search)}
      />

    </Layout>
  );
};

export default Main;
