 
import { Button, Icon, Input, Layout } from 'antd'; 
import React, { useEffect, useState } from 'react';
import ListTable from './ListTable';
import { GetTreeListJson } from './Main.service';
import Modify from './Modify';

const { Content } = Layout;
const { Search } = Input; 

function Main() { 
  const [search, setSearch] = useState<string>(''); 
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();

  useEffect(() => {
    initLoadData({   searchText: '' });
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const loadData = (
    { searchText }, sorter?) => {
    setSearch(searchText); 

    let queryJson: any = {   keyword: searchText }; 
    const searchCondition: any = { 
      queryJson
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    } 
    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'id';
    formData.sord = formData.sord || 'asc';
    return GetTreeListJson(formData).then(res => {    
      setData(res);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = ({ searchText }) => {
    let queryJson: any = {keyword: searchText }; 
    const sidx = 'id';
    const sord = 'asc'; 
    return load({  sidx, sord,  queryJson }).then(res => {
      return res;
    });
  };
 
  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ padding: '0 20px', overflow: 'auto' }}>
        <div style={{ marginBottom: '20px', padding: '3px 0' }}> 

          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={value =>
              loadData({   searchText: value })
            }
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer({flag: ''})}>
            <Icon type="plus" />
            机构
          </Button>
        </div>
        <ListTable
          onchange={( sorter) =>
            loadData(
              {  searchText: search }, 
              sorter
            )
          }
          loading={loading} 
          data={data}
          modify={showDrawer}
          reload={() =>
            initLoadData({  searchText: search })
          }
        />
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() =>
          initLoadData({   searchText: search })
        }
      />
    </Layout>
  );
}

export default Main;
