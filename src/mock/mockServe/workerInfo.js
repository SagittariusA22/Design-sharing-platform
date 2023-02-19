import Mock from "mockjs";

// 项目数据
const { worksLists } = Mock.mock({
  "worksLists|30": [
    {
      'id': "@id()",

      'name': '@cname',

      'sex|1': ['0','1'],

      'email': '@email',
      
      'date': '@date("yyyy-MM-dd HH:mm:ss")',
      
      'phone': /^1[385][1-9]\d{8}/,

      'cardId': /^4[385][1-9]\d{12}/,

      'power|+1': ['2','2','2','2','2','1','2','2','0','1',],
        'key|+1': 1 ,
    },
  ],
});

// 根据url获取query参数
let keywordStr = [];
const getQuery = (url) => {
  const index = url.indexOf("?");
  if (index !== -1) {
    const queryStrArr = url.substr(index + 1).split("&");
    // const queryStrArrItem = queryStrArr.split(",");
    queryStrArr.forEach((item) => {
      const itemArr = item.split("=");
      keywordStr.unshift(itemArr[1]);
    });
  } else {
    keywordStr = [""];
  }
};

var searchData = [];
var adminData = [];
// 员工列表
export default {
  getData: (query) => {
    let queryUrl = decodeURIComponent(query.url);
    getQuery(queryUrl);
    searchData = worksLists.filter((item) => {
      if (
        item.name.indexOf(keywordStr[0]) !== -1 ||
        item.email.indexOf(keywordStr[0]) !== -1 ||
        item.cardId.indexOf(keywordStr[0]) !== -1 ||
        item.phone.indexOf(keywordStr[0]) !== -1 
      )
      return true;
      return false;
    });
    keywordStr = [];
    return {
      status: 200,
      message: "获取数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

// 管理员列表
getadminData: (query) => {
    let queryUrl = decodeURIComponent(query.url);
    getQuery(queryUrl);
    adminData = worksLists.filter((item) => {
      if (
        item.power === keywordStr[0] 
      )
      return true;
      return false;
    });
    keywordStr = [];
    return {
      status: 200,
      message: "获取数据成功",
      data: adminData,
      total: adminData.length,
    };
  },


  setData: (data) => {
    const newdata = JSON.parse(data.body);
    searchData.unshift(
      Mock.mock({
        id: "@id()",
        name: newdata.name,
        email: newdata.email,
        cardId: newdata.cardId,
        sex: newdata.sex,
        phone: newdata.phone,
      })
    );
    return {
      status: 200,
      msg: "添加数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

  changeData: (data) => {
    const { id, phone, name, email, cardId, sex, power, key  } =
    JSON.parse(data.body);
    searchData.forEach((item) => {
      if (item.id === id) {
        item.name = name;
        item.email = email;
        item.cardId = cardId;
        item.sex = sex;
        item.phone = phone;
        item.power = power;
        item.key = key;
      }
    });
    return {
      status: 200,
      msg: "添加数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

  // 删除员工
  delData: (query) => {
    getQuery(query.url);
    for (let i = 0; i < keywordStr.length; i++) {
      const index = searchData.findIndex((item) => item.id === keywordStr[i]);
      searchData.splice(index, 1);
    }
    keywordStr = [];
    return {
      status: 200,
      msg: "删除数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

  // 解除权限
  delAdmin: (query) => {
    getQuery(query.url);
    for (let i = 0; i < keywordStr.length; i++) {
      const index = adminData.findIndex((item) => item.id === keywordStr[i]);
      adminData.splice(index, 1);
    }
    keywordStr = [];
    return {
      status: 200,
      msg: "删除数据成功",
      data: adminData,
      total: adminData.length,
    };
  },
};
