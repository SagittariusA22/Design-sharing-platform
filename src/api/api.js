//项目中对应的各种接口
import axios1 from "@/api/axios.js";

// 登录接口
export function login(data) {
  return axios1({
    url: "/login",
    method: "post",
    data,
  });
}
// 修改用户信息
export function changeUserInfo(data) {
  return axios1({
    url: "/login",
    method: "put",
    data,
  });
}

// 查询项目接口
export function projects(params) {
  return axios1({
    url: "/projects",
    method: "get",
    params,
  });
}

// 删除项目接口
export function delProject(id) {
  return axios1({
    url: "/projects",
    method: "delete",
    params: { id }
  });
}

// 添加项目接口
export function addProject(data) {
  // data = qs.stringify(data)
  return axios1({
    url: "/projects",
    method: "post",
    data,
  });
}

// 编辑项目接口
export function changProject(data) {
  return axios1({
    url: "/projects",
    method: "put",
    data,
  });
}

// 轮播图接口
export function getImg(params) {
  return axios1({
    url: "/img",
    method: "get",
    params,
  });
}

// 精品建筑项目接口
export function getVipProject(params) {
  return axios1({
    url: "/vipProject",
    method: "get",
    params,
  });
}

// 删除建筑精品项目接口
export function delVipProject(id){
  return  axios1({
        url:"/vipProject",
        method:'delete',
        params: { id }
    })
}

// 添加建筑精品项目接口
export function addVipProject(data){
  return  axios1({
        url:'/vipProject',
        method:'post',
        data
    })
}
// 修改建筑精品项目接口
export function changeVipProject(data){
  return  axios1({
        url:'/vipProject',
        method:'put',
        data
    })
}

// 精品规划项目接口
export function getPlanVipProject(params) {
  return axios1({
    url: "/planVipProject",
    method: "get",
    params,
  });
}

// 删除规划精品项目接口
export function delPlanVipProject(id){
  return  axios1({
        url:"/planVipProject",
        method:'delete',
        params: { id }
    })
}

// 添加规划精品项目接口
export function addPlanVipProject(data){
  return  axios1({
        url:'/planVipProject',
        method:'post',
        data
    })
}
// 修改规划精品项目接口
export function changePlanVipProject(data){
  return  axios1({
        url:'/planVipProject',
        method:'put',
        data
    })
}


// 材料接口
export function getMaterail(params) {
  return axios1({
    url: "/materail",
    method: "get",
    params,
  });
}

// 删除材料接口
export function delMaterail(id){
  return  axios1({
        url:"/materail",
        method:'delete',
        params: { id }
    })
}

// 添加材料接口
export function addMaterail(data){
  return  axios1({
        url:'/materail',
        method:'post',
        data
    })
}
// 修改材料接口
export function changeMaterail(data){
  return  axios1({
        url:'/materail',
        method:'put',
        data
    })
  }

// 员工接口
export function getWorkerLists(params) {
  return axios1({
    url: "/workerInfo",
    method: "get",
    params,
  });
}

// 管理员接口
export function getAdminLists(params) {
  return axios1({
    url: "/adminInfo",
    method: "get",
    params,
  });
}

// 删除员工接口
export function delWorkerLists(id){
  return  axios1({
        url:"/workerInfo",
        method:'delete',
        params: { id }
    })
}

// 删除管理员
export function delAdmin(id){
  return  axios1({
        url:"/adminInfo",
        method:'delete',
        params: { id }
    })
}

// 添加员工接口
export function addWorkerLists(data){
  return  axios1({
        url:'/workerInfo',
        method:'post',
        data
    })
}
// 修改员工接口
export function changeWorkerLists(data){
  return  axios1({
        url:'/workerInfo',
        method:'put',
        data
    })
}
