import React, { Component } from 'react';

export default class DistrictLayer extends Component<any, any> {
  static defaultProps = {
    type: 'country',
    nationStroke: '#2D9DE9',
    provinceStroke: '#2D9DE9',
    cityStroke: '#2D9DE9',
    countyStroke: '#2D9DE9',
    coastlineStroke: '#2D9DE9',
    depth: 1,
    SOC: 'CHN',
  };

  static getDerivedStateFromProps(props, state) {
    const { adcode: defaultAdCode } = props;
    const { selectedAdCode } = state;

    if (defaultAdCode && !selectedAdCode) {
      return {
        ...state,
        selectedAdCode: defaultAdCode,
      };
    }
    return {
      ...state,
    };
  }

  districtLayer;
  constructor(props) {
    super(props);

    this.state = {
      selectedAdCode: '',
    };
  }

  componentDidMount = () => {
    const { map } = this.props;
    if (map) {
      this.init();
    }
  };

  init = () => {
    const { map, onClick, onMouseMove, OnMouseOut } = this.props;

    this.districtLayer = this.createLayer();
    // this.districtLayer.setMap(map);
    map.setLayers([this.districtLayer]);

    // 图层点击事件
    map.on('click', e => {
      const props = this.districtLayer.getDistrictByContainerPos(e.pixel);
      if (onClick) {
        onClick(e, props);
      }
      // if (props) {
      //   const { adcode } = props;
      //   this.setState(
      //     {
      //       selectedAdCode: adcode,
      //     },
      //     () => {
      //       if (this.districtLayer) {
      //         this.districtLayer.setMap(null);
      //       }
      //       this.districtLayer = this.createLayer();
      //       this.districtLayer.setMap(map);
      //     }
      //   );
      // }
    });
    // 图层点击事件
    map.on('mousemove', e => {
      const props = this.districtLayer.getDistrictByContainerPos(e.pixel);
      if (onMouseMove) {
        onMouseMove(e, props);
      }
    });
    // 图层点击事件
    map.on('mouseout', e => {
      const props = this.districtLayer.getDistrictByContainerPos(e.pixel);
      if (OnMouseOut) {
        OnMouseOut(e, props);
      }
    });
  };

  createLayer = () => {
    const { type, SOC, depth, nationStroke, provinceStroke, cityStroke, fillColor } = this.props;

    let { fill } = this.props;
    let districtLayer;
    if (!fill) {
      fill = (_, { adcode }) => {
        const { selectedAdCode } = this.state;
        return selectedAdCode === adcode ? 'green' : fillColor;
      };
    }

    switch (type) {
      case 'province':
        break;
      case 'world':
        break;
      case 'country':
      default:
        // eslint-disable-next-line no-undef
        districtLayer = new (window as any).AMap.DistrictLayer.Country({
          zIndex: 12,
          depth,
          SOC,
          styles: {
            'nation-stroke': nationStroke,
            'province-stroke': provinceStroke,
            'city-stroke': cityStroke,
            fill: fill.bind(this, depth),
          },
        });
    }
    return districtLayer;
  };

  randomColor = () => {
    const rg = Math.random() * 155 + 50;
    return `rgb(${rg},${rg},255)`;
  };

  render() {
    return <div />;
  }
}
