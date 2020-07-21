import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { AnalysisData } from './data.d';
import { fakeChartData, GetOrgs } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AnalysisData;
  effects: {
    fetch: Effect;
    // fetchSalesData: Effect;
    fetchOrgs: Effect;//加载机构
  };
  reducers: {
    save: Reducer<AnalysisData>;
    clear: Reducer<AnalysisData>;
  };
}

const initState = {
  // visitData: [],
  // visitData2: [],
  monthReceiveData: [],
  receiveData: [],

  payTypeData: [],
  payTypeDataOnline: [],
  payTypeDataOffline: [],
  // searchData: [],
  // offlineData: [],
  // offlineChartData: [],
  feeTypeData: [],

  // radarData: [],
  treeData: []//机构树 
};

const Model: ModelType = {
  namespace: 'dashboardAnalysis',
  state: initState,
  effects: {

    // *fetch(_, { call, put }) {
    //   const response = yield call(fakeChartData);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },

    *fetch({ orgId,orgType }, { call, put }) {
 
      const response = yield call(fakeChartData, orgId,orgType);
      yield put({
        type: 'save',
        payload: response,
      });

    },

    // *fetchSalesData(_, { call, put }) {
    //   const response = yield call(fakeChartData);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       monthReceiveData: response.monthReceiveData,
    //     },
    //   });
    // },

    *fetchOrgs(_, { call, put }) {
      const response = yield call(GetOrgs);
      yield put({
        type: 'save',
        payload: { treeData: response }
      });
    },

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return initState;
    },
  },
};

export default Model;
