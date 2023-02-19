import Mock from "mockjs";

// 项目数据
const { materailData } = Mock.mock({
  "materailData|300": [
    {
      id: "@id()",
      "proName|1": [
        "梦幻腾冲",
        "深圳蔚蓝海岸",
        "南京仁恒江湾城",
        "成都鹭岛国际",
        "厦门海峡国际小区",
        "贵阳中铁逸都国际",
        "杭州金色海岸",
        "深圳香蜜湖水榭花都",
        "万科第五园",
        "华侨城波托菲诺",
        "北京天著春秋",
        "东莞松山湖湖岸花园",
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
        "大理石",
        "超白玻",
        "穿孔板",
        "仿石涂料",
        "仿石面砖",
        "松木",
        "麻石",
        "玻璃砖",
        "铝单板 ",
        "金属氟碳涂料",
        "陶瓷面砖",
        "浅灰色松木",
        "水磨石",
        "夹胶玻璃",
        "镜面不锈钢 ",
        "乳胶漆",
        "地面砖",
        "红木",
        "花岗岩",
        "LOE-E玻璃",
        "钢 ",
        "硅藻泥",
        "玻化砖",
        "杉木",


      ],
      "materialItems|+1": [
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
      "materialSize|1": [
        "600mm * 600mm * 20mm",
        "400mm * 600mm * 20mm",
        "800mm * 800mm * 30mm",
        "200mm * 200mm * 20mm",
        "200mm * 100mm * 10mm",
        "1200mm * 900mm * 40mm",
        "900mm * 900mm * 30mm",
      ],
      'phone': /^1[385][1-9]\d{8}/,
      materialUrl: "@url",
      materialParagraph: "@cparagraph(10)",

      "detailUrl|1": ["/arcProjectIntroduce"],
      // 项目详情回跳地址
      "fromUrl|1": ["/architecture"],
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
export default {
  getData: (query) => {
    let queryUrl = decodeURIComponent(query.url);
    getQuery(queryUrl);
    searchData = materailData.filter((item) => {
      if (
        item.material.indexOf(keywordStr[0]) !== -1 ||
        item.materialItem.indexOf(keywordStr[0]) !== -1 ||
        item.materialColor.indexOf(keywordStr[0]) !== -1 ||
        item.materialCompany.indexOf(keywordStr[0]) !== -1 
      )
      return true;
      return false;
    });
    keywordStr = [""];
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
        material: newdata.material,
        materialItem: newdata.materialItem,
        materialColor: newdata.materialColor,
        materialCompany: newdata.materialCompany,
        materialSize: newdata.materialSize,
        phone: newdata.phone,
        materialItem: {"url": ''},
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
    const { id, material, materialItem, materialColor, materialCompany, materialSize, phone, 
      } =
    JSON.parse(data.body);
    searchData.forEach((item) => {
      if (item.id === id) {
        item.material = material;
        item.materialItem = materialItem;
        item.materialColor = materialColor;
        item.materialCompany = materialCompany;
        item.materialSize = materialSize;
        item.phone = phone;
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
