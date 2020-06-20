
import { DefaultPagination } from '@/utils/defaultSetting';
import { Select, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import { GetPageListJson } from './Main.service';
// import { GetQuickSimpleTreeAllForDeskService } from '@/services/commonItem';
// import { getResult } from '@/utils/networkUtils';
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
//查看
import RShowLink from '../Repair/ShowLink';
import CShowLink from '../Complaint/ShowLink';

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  // const [treeData, setTreeData] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('');
  const selectTree = (id, type, info) => {
    // initLoadData(info.node.props.dataRef, search);
    SetOrganize(info.node.props.dataRef);
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, info.node.props.dataRef, page);
  };

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    //   SetOrganize(rootOrg);
    //   initLoadData('', '');
    // }); 
    //获取房产树
    // GetQuickSimpleTreeAllForDeskService()
    //   .then(getResult)
    //   .then((res: any[]) => {
    //     setTreeData(res || []);
    //     // return res || [];
    //   }); 
    initLoadData('', '','');

  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickPStructsTree().then((res: any[]) => {
  //     //const treeList = (res || []).map(item => {
  //     //   return {
  //     //     ...item,
  //     //     id: item.id,
  //     //     text: item.name,
  //     //     parentId: item.pId,
  //     //   };
  //     // });
  //     setTreeData(res || []);
  //     return res || [];
  //   });
  // };

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  const loadData = (searchText, org, status, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(searchText);
    setStatus(status);
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
        // OrganizeId: org.organizeId,
        TreeTypeId: org.key,
        TreeType: org.type,
        status: status
      },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'createDate';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'createDate';
    formData.sord = formData.sord || 'desc';
    return GetPageListJson(formData).then(res => {
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

  const initLoadData = (org, searchText,status) => {
    setSearch(searchText);
    const queryJson = {
      // OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.key,
      TreeType: org.type,
      status: status
    };
    const sidx = 'createDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const [repairVisible, setRepairVisible] = useState<boolean>(false);//查看 
  const [complaintVisible, setComplaintVisible] = useState<boolean>(false);//查看 
  const [billCode, setBillCode] = useState<any>();

  //查看关联单据
  const showLinkDrawer = (type, code) => {
    if (type == "Repair") {
      setRepairVisible(true);
    } else {
      setComplaintVisible(true);
    }
    setBillCode(code);
  };

  const closeLinkDrawer = (type) => {
    if (type == "Repair") {
      setRepairVisible(false);
    }
    else {
      setComplaintVisible(false);
    }
  };

  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(pid, type, info) => {
          selectTree(pid, type, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Select placeholder="=请选择状态="
            allowClear={true}
            style={{ width: '140px', marginRight: '5px' }}
            onChange={value => {
              loadData(search, organize, value);
            }}>
            <Option value="1">待处理</Option>
            <Option value="2" >待完成</Option>
            <Option value="3">待评价</Option>
            <Option value="4">已评价</Option>
            <Option value="-1">已作废</Option>
          </Select>
          <Search
            className="search-input"
            placeholder="搜索服务单号"
            onSearch={value => loadData(value, organize,status)}
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            服务单
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(search, organize, paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() => initLoadData(organize, search,status)}
        />
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        // treeData={treeData}
        data={currData}
        reload={() => initLoadData(organize, search,status)}
        showLink={showLinkDrawer}
      />

      <RShowLink
        showVisible={repairVisible}
        closeDrawer={closeLinkDrawer}
        billCode={billCode}
      />

      <CShowLink
        showVisible={complaintVisible}
        closeDrawer={closeLinkDrawer}
        billCode={billCode}
      />

    </Layout>
  );
}
export default Main;
