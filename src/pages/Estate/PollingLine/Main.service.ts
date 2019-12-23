import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { ResponseObject, TreeEntity } from '@/model/models';

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

// 逻辑删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

// 查询机构
// export function searchOrgs(): Promise<any[]> {
//   return request.get(process.env.basePath + `/Common/GetOrgTreeOnly`).then(getResult as any);
// }

//获取分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Polling/GetDataItemTreeList`, {}).then(getResult as any);
}

//获取巡检内容
export function GetPageContentListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/GetPageContentListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存巡检路线点位
export function SaveLinePointForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Polling/SaveLinePointForm`, { data: objToFormdata(data) }).then(getResult as any);
}


//加载全部checkbox巡检点位
export function GetPointTreeAll(): Promise<ResponseObject<TreeEntity[]>> {
  return request.get(process.env.basePath + `/Common/GetPointTreeAll`, {});
} 

//获取巡检路线
export function GetPageLineListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/GetPageLineListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//获取点位明细
export function GetPonitPageListByID(data): Promise<any> {
  return request.post(process.env.basePath + `/Polling/GetPonitPageListByID`, { data: objToFormdata(data) }).then(getResult as any);;
}