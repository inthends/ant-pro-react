import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request"; 

//删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}
   
//获取巡检任务
export function GetPageTaskListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/GetPageTaskListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//获取图片
export function GetFilesData(keyvalue): Promise<any> {
  return request
    .get(process.env.basePath + `/Polling/GetFilesData?keyvalue=${keyvalue}`)
    .then(getResult as any);
}
