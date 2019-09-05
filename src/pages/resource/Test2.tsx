import Page from '@/components/Common/Page';
import NumberInfo from '@/components/NumberInfo';
import { Button, Col, Layout, Row, Table, Tree } from 'antd';
import React from 'react';
const { Sider, Content } = Layout;
const { TreeNode } = Tree;

function Test2() {
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <Page>
      <Layout style={{ height: '100%' }}>
        <Sider theme="light" style={{ overflow: 'hidden' }} width="245px">
          <div style={{padding: '6px'}}>
            <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={onSelect}>
              <TreeNode title="南京兆信物业管理有限公司" key="0-0">
                <TreeNode title="涵碧楼管理处" key="0-0-0" />
              </TreeNode>
            </Tree>
          </div>
        </Sider>
        <Content style={{ padding: '0 20px' }}>
          <Page style={{ padding: '15px' }}>
            <Row gutter={24}>
              <Col sm={24} style={{ marginBottom: 24 }}>
                <Row>
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24}>
                    <NumberInfo subTitle="空置面积" total={4.6837} suffix="万m²" />
                  </Col>
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24}>
                    <NumberInfo subTitle="总房屋数" total={573} />
                  </Col>
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24}>
                    <NumberInfo subTitle="入住房屋数" total={0} />
                  </Col>
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24}>
                    <NumberInfo subTitle="空置房屋数" total={217} />
                  </Col>
                  
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24}>
                    <NumberInfo subTitle="项目总数" total={1} />
                  </Col>
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24}>
                    <NumberInfo subTitle="总建筑面积" total={4.6837} suffix="万m²" />
                  </Col>
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24}>
                    <NumberInfo subTitle="入住面积" total={0.0} suffix="万m²" />
                  </Col>
                  <Col xxl={3} xl={6} md={6} sm={12} xs={24} style={{ padding: '13px 0' }}>
                    <Button.Group>
                      <Button type="primary">新增</Button>
                    </Button.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Table bordered size="small" dataSource={dataSource} columns={columns} rowKey="id" scroll={{x: 1850}}/>
          </Page>
        </Content>
      </Layout>
    </Page>
  );
}

export default Test2;

const dataSource = [
  {
    memo: null,
    name: '涵碧楼',
    id: 'HBL',
    area: 46837.0,
    roomcount: 573,
    checkarea: 0.0,
    checkroom: 0.0,
    vacancyroom: 217.0,
  },
];
const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    width: 250,
    fixed:'left',
  },
  {
    title: '总建筑面积',
    dataIndex: 'area',
    key: 'area',
    width: 200
  },
  {
    title: '总房屋数',
    dataIndex: 'roomcount',
    key: 'roomcount',
    width: 200
  },
  {
    title: '入住面积',
    dataIndex: 'checkarea',
    key: 'checkarea',
    width: 200
  },
  {
    title: '空置面积',
    dataIndex: 'area',
    key: 'area2',
    width: 200
  },
  {
    title: '入住房屋数',
    dataIndex: 'checkroom',
    key: 'checkroom',
    width: 200
  },
  {
    title: '空置房屋数',
    dataIndex: 'vacancyroom',
    key: 'vacancyroom' 
  },
  {
    title: '入驻率',
    dataIndex: 'rate',
    key: 'rate',
    width: 200,
    fixed:'right',
    render: (text, record) => {
      return ((record.checkroom / record.roomcount) * 100).toFixed(2) + '%';
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 200,
    fixed:'right',
    render: (text, record) => {
      return [
        <Button type="primary" style={{marginRight: '10px'}}>修改</Button>,
        <Button type="danger">删除</Button>,
      ];
    },
  },
];
