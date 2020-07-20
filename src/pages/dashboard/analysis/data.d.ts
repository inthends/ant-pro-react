export interface CommonDataType {
  //通用数据类型
  x: string;
  y: number;
}

export interface SearchDataType {
  index: number;
  keyword: string;
  count: number;
  range: number;
  status: number;
}

export interface OfflineDataType {
  name: string;
  cvr: number;
}

export interface OfflineChartData {
  x: any;
  y1: number;
  y2: number;
}

export interface RadarData {
  name: string;
  label: string;
  value: number;
}

export interface AnalysisData {
  // monthReceivables: any;//本月收款,add new
  // visitData: CommonDataType[];
  // visitData2: CommonDataType[];
  monthReceiveData: CommonDataType[];
  receiveData: CommonDataType[];
  searchData: SearchDataType[];
  offlineData: OfflineDataType[];
  offlineChartData: OfflineChartData[];
  salesTypeData: CommonDataType[];
  salesTypeDataOnline: CommonDataType[];
  salesTypeDataOffline: CommonDataType[];
  radarData: RadarData[];
}
