import Mock from "mockjs";

// 项目数据
const { projectData } = Mock.mock({
  "projectData|60": [
    {
      id: "@id()",
      "proName|1": [
        "梦幻腾冲",
        "深圳蔚蓝海岸",
        "南京仁恒江湾城",
        "重庆鹭岛国际",
        "厦门海峡国际小区",
        "贵阳中铁逸都国际",
        "杭州金色海岸",
        "深圳香蜜湖水榭花都",
        "万科第五园",
        "华侨城波托菲诺",
        "北京天著春秋",
        "东莞松山湖湖岸花园",
      ],

      "projectType|1": [
        "1" ,/* 教育建筑 */
        "2" ,/* 居住建筑 */
        "3" ,/* 文化建筑 */
        "4" ,/* 体育建筑 */
        "5" ,/* 酒店建筑 */
        "6" ,/* 医疗建筑 */
        "7" ,/* 室内设计 */
      ],

      "department|1": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],

      "displayImg|+1": [
          {"url": require("@/assets/projectImg/2.jpg")},
          {"url": require("@/assets/projectImg/3.jpg")},
          {"url": require("@/assets/projectImg/4.jpg")},
          {"url": require("@/assets/projectImg/5.jpg")},
          {"url": require("@/assets/projectImg/6.jpg")},
          {"url": require("@/assets/projectImg/7.jpg")},
          {"url": require("@/assets/projectImg/8.jpg")},
          {"url": require("@/assets/projectImg/9.jpg")},
          {"url": require("@/assets/projectImg/10.jpg")},
          {"url": require("@/assets/projectImg/11.jpg")},
          {"url": require("@/assets/projectImg/12.jpg")},
          {"url": require("@/assets/projectImg/13.jpg")},
          {"url": require("@/assets/projectImg/15.jpg")},
      ],
      "materialImg|+1": [
          {"url": require("@/assets/material/2.jpg")},
          {"url": require("@/assets/material/3.jpg")},
          {"url": require("@/assets/material/4.png")},
          {"url": require("@/assets/material/5.jpg")},
          {"url": require("@/assets/material/6.jpg")},
          {"url": require("@/assets/material/7.png")},
          {"url": require("@/assets/material/8.jpg")},
          {"url": require("@/assets/material/1.png")},
      ],
      "material|+1": ["1", "2", "3", "4", "5", "6"],/* "石材", "玻璃", "金属" "涂料", "面砖", "木材"*/
      
      "materialItem|+1": [
        "大理石 | 葡萄牙米黄",
        "超白玻 | 蓝宝石 | 铝单板",
        "穿孔板 | 铝单板 | 彩釉玻璃",
        "仿石涂料 | 米白 | 玻璃砖",
        "仿石面砖 | 浅灰色",
        "古铜色木材 | 松木",
        "大理石 | 葡萄牙米黄 | 铝单板",
        "超白玻 | 玻璃砖 | 穿孔板",
        "穿孔板 | 铝单板 ",
        "米白色涂料 | 米白 | 仿石面砖",
        "陶瓷面砖 | 浅灰色",
        "浅灰色松木",
      ],
      "materialColor|+1": [
        "白色系",
        "黑色系",
        "灰色系",
        "红色系",
        "黄色系",
        "绿色系",
        "蓝色系",
        "棕色系",
        "透明",
      ],
      "materialCompany|1": [
        "中国建材集团有限公司",
        "安徽海螺集团有限责任公司",
        "北京金隅集团股份有限公司",
        "红狮控股集团有限公司",
        "华润水泥控股有限公司",
        "建华建材（中国）有限公司",
        "江苏金峰水泥集团有限公司",
        "华新水泥股份有限公司",
        "广东联塑科技实业有限公司",
        "中建西部建设股份有限公司",
        "信义玻璃控股有限公司",
        "天瑞水泥集团有限公司",
      ],
      'phone': /^1[385][1-9]\d{8}/,
      materialUrl: "@url",
      materialParagraph: "@cparagraph(10)",

      "schedule|1": [
        "1",
        "2",
        "3",
      ] /* "概念方案设计", "方案报批通过", "已建成" */,
      "detailUrl|1": ["/arcProjectIntroduce"],
      // 项目详情回跳地址
      "fromUrl|1": ["/architecture"],
      // 项目描述
      paragraph: "@cparagraph(10)",
      date: "@date('yyyy-MM-dd')",
      projectUrl: "@url",
      "address|1": ["1", "2", "3", "4", "5"],
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
      keywordStr.push(itemArr[1]);
    });
  } else {
    keywordStr = ["", "", "", "", "", "", ""];
  }
};

var searchData = [];
export default {
  getData: (query) => {
    let queryUrl = decodeURIComponent(query.url);
    getQuery(queryUrl);
    searchData = projectData.filter((item) => {
      if (
        item.department.indexOf(keywordStr[0]) !== -1 &&
        item.projectType.indexOf(keywordStr[1]) !== -1 &&
        item.schedule.indexOf(keywordStr[2]) !== -1 &&
        item.address.indexOf(keywordStr[3]) !== -1 &&
        item.proName.indexOf(keywordStr[4]) !== -1 &&
        item.material.indexOf(keywordStr[5]) !== -1 &&
        item.materialItem.indexOf(keywordStr[6]) !== -1
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

  setData: (data) => {
    const newdata = JSON.parse(data.body);
    searchData.unshift(
      Mock.mock({
        id: "@id()",
        proName: newdata.proName,
        department: newdata.department,
        projectType: newdata.projectType,
        schedule: newdata.schedule,
        detailUrl: "/projectIntroduce",
        paragraph: newdata.paragraph,
        date: newdata.date,
        projectUrl: newdata.projectUrl,
        displayImg: newdata.displayImg,
        address: newdata.address,
        material: newdata.material,
        materialCompany: newdata.materialCompany,
        materialUrl: newdata.materialUrl,
        materialParagraph: newdata.materialParagraph,
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
    const { id, proName, department, projectType, schedule, paragraph, date, projectUrl, address, displayImg, material,
      materialCompany,
      materialUrl,
      materialParagraph } =
    JSON.parse(data.body);
    searchData.forEach((item) => {
      if (item.id === id) {
        item.proName = proName;
        item.department = department;
        item.projectType = projectType;
        item.schedule = schedule;
        item.paragraph = paragraph;
        item.date = date;
        item.projectUrl = projectUrl;
        item.displayImg = displayImg;
        item.address = address;
        item.material = material;
        item.materialCompany = materialCompany;
        item.materialUrl = materialUrl;
        item.materialParagraph = materialParagraph;
      }
    });
    return {
      status: 200,
      msg: "添加数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

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
};
