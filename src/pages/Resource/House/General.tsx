import Page from '@/components/Common/Page';
import NumberInfo from '@/components/NumberInfo';
import { Col, Row } from 'antd';
import React from 'react';
interface GeneralProps {
  totalData: any;
}
function General(props: GeneralProps) {
  const { totalData } = props;
  const generalData = totalData.length === 1 ? totalData[0] : {};
  return (
    <Page style={{ padding: '20px', marginBottom: '20px' }}>
      <Row gutter={24}>
        <Col sm={24}>
          <Row>
            <Col xxl={3} xl={3} md={6} sm={12} xs={24}>
              <NumberInfo subTitle="项目总数" total={generalData.count} />
            </Col>
            <Col xxl={3} xl={3} md={6} sm={12} xs={24}>
              <NumberInfo
                subTitle="总建筑面积"
                total={((generalData.areasum || 0) / 10000).toFixed(4)}
                suffix="万m²"
              />
            </Col>
            <Col xxl={3} xl={3} md={6} sm={12} xs={24}>
              <NumberInfo
                subTitle="入住面积"
                total={((generalData.checkroom || 0) / 10000).toFixed(4)}
                suffix="万m²"
              />
            </Col>

            <Col xxl={3} xl={3} md={6} sm={12} xs={24}>
              <NumberInfo
                subTitle="空置面积"
                total={(((generalData.areasum || 0) - (generalData.checkroom || 0)) / 10000).toFixed(
                  4,
                )}
                suffix="万m²"
              />
            </Col>
            <Col xxl={3} xl={3} md={6} sm={12} xs={24}>
              <NumberInfo subTitle="总房屋数" total={generalData.roomcount || 0 }/>
            </Col>
            <Col xxl={3} xl={3} md={6} sm={12} xs={24}>
              <NumberInfo subTitle="入住房屋数" total={generalData.checkroom || 0 } />
            </Col>
            <Col xxl={3} xl={3} md={6} sm={12} xs={24}>
              <NumberInfo subTitle="空置房屋数" total={(generalData.roomcount || 0) - (generalData.checkroom || 0)} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Page>
  );
}

export default General;
