//多选异步树
import Page from '@/components/Common/Page';
import { Spin, message, Modal, Col, Row, Input, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
// import { WrappedFormUtils } from 'antd/lib/form/Form';
// import { SiderContext } from '../SiderContext';
import { GetOrgTree, GetAsynChilds, GetUnitTree } from '@/services/commonItem';
import { GetFeeItemsByUnitIds } from './Main.service';
const { Search } = Input;
const { TreeNode } = Tree;
// const { Sider } = Layout;

interface SelectHouseProps {
  //treeData: any[];
  // selectTree(parentId, type, info): void;
  // parentid: string;
  visible: boolean;
  closeModal(): void;
  getSelectTree(rooms, feeItems): void;
  // form: WrappedFormUtils;
}

function SelectHouse(props: SelectHouseProps) {
  // const { selectTree } = props;
  const { visible, closeModal, getSelectTree } = props;
  // const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  // const { hideSider, setHideSider } = useContext(SiderContext);
  //动态子节点
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //默认展开的节点
  // let keys: any[];
  // keys = [];
  // const getAllkeys = res =>
  //   res.forEach(item => {
  //     // if (item.children && item.type != 'C') { 
  //     if (item.children && 'AB'.indexOf(item.type) != -1) {
  //       keys.push(getAllkeys(item.children))
  //     }
  //     keys.push(item.key);
  //   });

  //展开到管理处
  useEffect(() => {
    if (visible) {
      //根据父节点获取房产树
      setLoading(true);
      //还原
      setTreeSearchData([]);
      GetOrgTree().then((res: any[]) => {
        setTreeData(res || []);
        setLoading(false);
        // getAllkeys(res || []);
        // setExpandedKeys(keys);
      });
      //setExpandedKeys(treeData.map(item => item.id as string)); 
    }
  }, [visible]);

  // const [roomIds, setRoomIds] = useState<any[]>([]);
  // const [roomNames, setRoomNames] = useState<any>();

  const [rooms, setRooms] = useState<any[]>([]);
  const [roomIds, setRoomIds] = useState<any[]>([]);

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      //const item = treeData.filter(treeItem => treeItem.key === selectedKeys[0])[0];
      const type = info.node.props.type;
      // if ('ABCD'.indexOf(type) != -1)
      if ('59'.indexOf(type) == -1)
        return;
      // selectTree(selectedKeys[0], type, info); 
      //返回多选值
      // var roomName="";
      // info.selectedNodes.forEach((val, idx, arr) => {
      //   roomName += " " + val.props.allname;
      // }); 
      var rooms: any[] = [];
      var roomIds: any[] = [];
      info.selectedNodes.forEach((val, idx, arr) => {
        rooms.push({ id: val.key, roomId: val.key, area: val.props.attributeA, rentPrice: val.props.attributeB, allName: val.props.allname });
        roomIds.push(val.key);
      });
      setRooms(rooms);
      setRoomIds(roomIds);
    }
  };

  // const clickExpend = (expandedKeys, { isExpanded, node }) => {
  //   const selectNode = node.props.eventKey; 
  //   if (isExpanded) {
  //     setExpanded(expend => [...expend, selectNode]);
  //   } else {
  //     setExpanded(expend => expend.filter(item => item !== selectNode));
  //   }
  // };

  // const clickExpend = expandedKeys => {
  //   // if not set autoExpandParent to false, if children expanded, parent can not collapse.
  //   // or, you can remove all expanded children keys.
  //   setExpandedKeys(expandedKeys);
  //   //setAutoExpandParent(false);
  // };

  //异步加载
  const onLoadData = treeNode =>
    new Promise<any>(resolve => {
      if (treeNode.props.children && treeNode.props.children.length > 0 && treeNode.props.type != 'D') {
        resolve();
        return;
      }
      setTimeout(() => {
        GetAsynChilds(treeNode.props.ptype, treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
          treeNode.props.dataRef.children = res || [];
          setTreeData([...treeData]);
        });
        resolve();
      }, 500);
    });

  // const renderTree = (tree: any[], parentId: string) => {
  //   return tree.filter(item => item.parentId === parentId).map(filteditem => {
  //       return (
  //         <TreeNode title={filteditem.title} key={filteditem.id} dataRef={filteditem}>
  //           {renderTree(tree, filteditem.id as string)}
  //         </TreeNode>
  //       );
  //     });
  // };

  const [treeSearchData, setTreeSearchData] = useState<any[]>([]);
  const loadUnitData = (search) => {
    if (search) {
      setLoading(true);
      GetUnitTree(search).then((res: any[]) => {
        setTreeSearchData(res || []);
        setLoading(false);
      });
    } else {
      //还原
      setTreeSearchData([]);
    }
  };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          // <TreeNode title={item.title} key={item.key} dataRef={item} type={item.type} >
          <TreeNode {...item} dataRef={item} >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });

  return (

    <Modal
      title="选择房屋"
      visible={visible}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      onCancel={() => closeModal()}
      onOk={() => {
        setLoading(true);
        if (rooms.length == 0)//||unitData.isLeaf!=1){
        {
          message.destroy();
          message.warning('请选择房间或车位');
          setLoading(false);
        }
        else {
          //加载费项 
          GetFeeItemsByUnitIds(JSON.stringify(roomIds)).then(feeItems => {
            getSelectTree(rooms, feeItems || []);
            closeModal();
            setLoading(false);
          });
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'
    >
      <Spin tip="数据处理中..." spinning={loading}>

        <Row gutter={8}>
          <Col>
            <Search placeholder="搜索房号或名称"
              onSearch={value => loadUnitData(value)}
            />
          </Col>
        </Row>

        <Row style={{ height: '400px', overflow: 'auto', marginTop: '10px', backgroundColor: 'rgb(255,255,255)' }}>
          <Col>
            <Page
              style={{
                padding: '6px',
                borderLeft: 'none',
                borderBottom: 'none',
                height: '400px',
                overflowY: 'auto',
              }}>

              {treeSearchData.length > 0 ?
                <Tree
                  showLine
                  multiple={true}
                  // expandedKeys={expandedKeys}
                  // onExpand={clickExpend}
                  onSelect={onSelect}>
                  {renderTreeNodes(treeSearchData)}
                </Tree> :
                <Tree
                  // style={{ height: '400px', maxHeight: '400px' }}
                  loadData={onLoadData}
                  showLine
                  // expandedKeys={expandedKeys}
                  // onExpand={clickExpend}
                  multiple={true}
                  onSelect={onSelect}>
                  {renderTreeNodes(treeData)}
                </Tree>
              }

            </Page>
          </Col>
        </Row>
      </Spin>
    </Modal>

  )
};

export default SelectHouse;
