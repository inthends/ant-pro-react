import React, { Component } from 'react';

export default class Map extends Component<any, any> {
  static defaultProps = {
    version: '1.4.12',
    mapKey: '',
    plugins: [],
    click: () => {},
  };

  map;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    // 初始化 AMap
    (window as any).initAMap = this.initAMap;
  }

  componentDidMount = () => {
    this.loadAMapApi();
  };

  componentWillUnmount = () => {
    if (this.map) {
      this.map.destroy();
    }
  };

  /**
   * 加载 AMap api
   *
   */
  loadAMapApi = () => {
    const { mapKey, version, plugins = [] } = this.props;
    const bodyETag = document.querySelector('body');
    const scriptETag = document.createElement('script');
    scriptETag.defer = true;
    scriptETag.src = `https://webapi.amap.com/maps?v=${version}&key=${mapKey}&plugin=${plugins.join(
      ',',
    )}&callback=initAMap`;
    if (bodyETag) {
      bodyETag.appendChild(scriptETag);
    }
  };

  /**
   * 初始化 AMap
   *
   */
  initAMap = () => {
    const { zoom, zooms, center, viewMode = '2D', pitch, click, ...restProps } = this.props;
    let { mapStyle = '' } = this.props;
    if (!mapStyle.includes('amap://styles')) {
      mapStyle = `amap://styles/${mapStyle}`;
    }

    this.map = new (window as any).AMap.Map('map', {
      zoom,
      zooms,
      center,
      mapStyle,
      viewMode,
      pitch,
      ...restProps,
    });

    this.map.on('click', e => {
      click(e);
    });

    this.setState({
      loading: false,
    });
  };

  renderMapChildren = () => {
    const { children } = this.props;
    // if (
    //   typeof children === 'string' ||
    //   typeof children === 'number' ||
    //   typeof children === 'boolean' ||
    //   children === {}
    // ) {
    //   return children;
    // }
    return (
      children &&
      React.Children.map<any, any>(children, child => {
        if (child) {
          return React.cloneElement<any, any>(child, {
            map: this.map,
          });
        }
        return child;
      })
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <div id="map" style={{ position: 'relative', width: '100%', height: '100%' }}>
        {!loading ? this.renderMapChildren() : null}
      </div>
    );
  }
}
