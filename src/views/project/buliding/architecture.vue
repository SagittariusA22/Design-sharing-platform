<template>
  <div class="architecture">
    <!-- 顶部搜索框栏-->
    <div class="search">
      <arcSearchMenu
        @getProjectData="getProjectData"
        @checkAllList="checkAllList"
        @deleteProject="deleteProject"
        @addProjectData="addProjectData"
        @changeProjectData="changeProjectData"
        :delId="delId"
        :lists="lists"
      />
    </div>
    <!-- 引入虚拟列表插件 -->
    <VirtuaScroll
      :msg="msg"
      :loadingEndMsg="loadingEndMsg"
      :end="end"
      :blockHeight="blockHeight"
      :blockWidth="blockWidth"
      :containPaddingTop="containPaddingTop"
      :containPaddingSide="containPaddingSide"
      :lists="lists"
      :loading="loading"
      v-slot:default="acceptItem"
      @getProjectData="getProjectData"
      @getMoreProjectData="getMoreProjectData"
    >
      <!-- 作用域插槽，动态指定样式 -->
      <el-card :body-style="{ padding: '0px' }" shadow="hover">
        <div class="imgText">
          <!-- 项目详情 -->
          <div @click="toDetail(acceptItem.sendItem)">
            <div class="imgOuter">
              <img :src="acceptItem.sendItem.displayImg.url" />
            </div>
            <div class="text">
              <!-- 搜索项目名高亮 -->
              <a
                class="name"
                v-html="highlight(acceptItem.sendItem.proName)"
              ></a>
              <a class="type">{{ acceptItem.sendItem.projectType_text }}</a>
              <a class="schedule">{{ acceptItem.sendItem.schedule_text }}</a>
            </div>
            </div>
          <div class="adminHandle">
            <el-button
              class="editProject"
              v-permission="'edit'"
              type="primary"
              @click="editProject(acceptItem.sendItem)"
              size="mini"
              plain
              style="padding: 4px 6px"
              >编辑</el-button
            >
            <el-button
              class="deleteProject"
              v-permission="'delete'"
              type="danger"
              @click="deleteProject(acceptItem.sendItem.id)"
              size="mini"
              plain
              style="padding: 4px 6px"
              >删除</el-button
            >
            <input
              v-permission="'edit'"
              type="checkbox"
              class="delCheckItem"
              :value="acceptItem.sendItem.id"
              v-model="delId"
            />
          </div>
        </div>
      </el-card>
    </VirtuaScroll>
    
  </div>
</template>

<script>
import {
  getVipProject,
  delVipProject,
  addVipProject,
  changeVipProject,
} from "@/api/api.js";
import arcSearchMenu from "@/components/project/arcSearchMenu";
// 按钮权限
import permission from "@/directives/permission";

export default {
  name: "architecture",
  components: { arcSearchMenu },
  // 自定义指令
  directives: { permission },

  data() {
    return {
      lists: [],
      msg: "正在加载中",
      loadingEndMsg: "无更多数据",
      //  无更多数据
      end: false,
      // 单行数据高度，含行距
      blockHeight: 372,
      // 单列数据宽度
      blockWidth: 350,
      // 容器顶部距离可视窗口顶部
      containPaddingTop: 70,
      // 容器左右被遮盖区域
      containPaddingSide: 80,
      // 请求状态
      loading: true,

      delId: [],
      // 获取搜索关键字,高亮
      keyword: "",
    };
  },
  methods: {
    // 滚动到底请求更多数据
    getMoreProjectData() {
      this.loading = true;
      getVipProject(this.$store.state.vipProject.selectValue).then((res) => {
        this.lists = [...this.lists, ...res.data.data];
        if (this.lists.length < 30) {
          this.getMoreProjectData();
        }
        this.lists.forEach((item) => {
          // 不要修改原数据
          item.department === "1"
            ? (item.department_text = "建筑设计一部")
            : item.department === "2"
            ? (item.department_text = "建筑设计三部")
            : item.department === "3"
            ? (item.department_text = "建筑设计四部")
            : item.department === "4"
            ? (item.department_text = "建筑设计五部")
            : item.department === "5"
            ? (item.department_text = "建筑设计六部")
            : item.department === "6"
            ? (item.department_text = "建筑设计九部")
            : item.department === "7"
            ? (item.department_text = "建筑设计十部")
            : item.department === "8"
            ? (item.department_text = "事业一部")
            : (item.department_text = "事业二部");
          item.projectType === "1"
            ? (item.projectType_text = "教育建筑")
            : item.projectType === "2"
            ? (item.projectType_text = "居住建筑")
            : item.projectType === "3"
            ? (item.projectType_text = "文化建筑")
            : item.projectType === "4"
            ? (item.projectType_text = "体育建筑")
            : item.projectType === "5"
            ? (item.projectType_text = "酒店建筑")
            : item.projectType === "6"
            ? (item.projectType_text = "医疗建筑")
            : (item.projectType_text = "室内设计");
          item.address === "1"
            ? (item.address_text = "华南地区")
            : item.address === "2"
            ? (item.address_text = "华东地区")
            : item.address === "3"
            ? (item.address_text = "华北地区")
            : item.address === "4"
            ? (item.address_text = "中部地区")
            : (item.address_text = "西部地区");
          item.schedule === "1"
            ? (item.schedule_text = "概念方案设计")
            : item.schedule === "2"
            ? (item.schedule_text = "方案报批通过")
            : (item.schedule_text = "已建成");
        });
        this.loading = false;
      });
    },
    // 请求数据
    getProjectData(val) {
      this.end = false;
      this.loading = true;
      getVipProject(val).then((res) => {
        this.lists = res.data.data;
        this.lists.forEach((item) => {
          // 不要修改原数据
          item.department === "1"
            ? (item.department_text = "建筑设计一部")
            : item.department === "2"
            ? (item.department_text = "建筑设计三部")
            : item.department === "3"
            ? (item.department_text = "建筑设计四部")
            : item.department === "4"
            ? (item.department_text = "建筑设计五部")
            : item.department === "5"
            ? (item.department_text = "建筑设计六部")
            : item.department === "6"
            ? (item.department_text = "建筑设计九部")
            : item.department === "7"
            ? (item.department_text = "建筑设计十部")
            : item.department === "8"
            ? (item.department_text = "事业一部")
            : (item.department_text = "事业二部");
          item.projectType === "1"
            ? (item.projectType_text = "教育建筑")
            : item.projectType === "2"
            ? (item.projectType_text = "居住建筑")
            : item.projectType === "3"
            ? (item.projectType_text = "文化建筑")
            : item.projectType === "4"
            ? (item.projectType_text = "体育建筑")
            : item.projectType === "5"
            ? (item.projectType_text = "酒店建筑")
            : item.projectType === "6"
            ? (item.projectType_text = "医疗建筑")
            : (item.projectType_text = "室内设计");
          item.address === "1"
            ? (item.address_text = "华南地区")
            : item.address === "2"
            ? (item.address_text = "华东地区")
            : item.address === "3"
            ? (item.address_text = "华北地区")
            : item.address === "4"
            ? (item.address_text = "中部地区")
            : (item.address_text = "西部地区");
          item.schedule === "1"
            ? (item.schedule_text = "概念方案设计")
            : item.schedule === "2"
            ? (item.schedule_text = "方案报批通过")
            : (item.schedule_text = "已建成");
        });
        this.loading = false;
        if (!res.data.data.length) this.end = true;
      });
    },
    // 新增数据
    addProjectData(val) {
      this.end = false;
      this.loading = true;
      addVipProject(val).then((res) => {
        if (res.data.status === 200) {
          this.$message.success("项目新增成功");
          this.lists = res.data.data;
          this.lists.forEach((item) => {
            // 不要修改原数据
            item.department === "1"
              ? (item.department_text = "建筑设计一部")
              : item.department === "2"
              ? (item.department_text = "建筑设计三部")
              : item.department === "3"
              ? (item.department_text = "建筑设计四部")
              : item.department === "4"
              ? (item.department_text = "建筑设计五部")
              : item.department === "5"
              ? (item.department_text = "建筑设计六部")
              : item.department === "6"
              ? (item.department_text = "建筑设计九部")
              : item.department === "7"
              ? (item.department_text = "建筑设计十部")
              : item.department === "8"
              ? (item.department_text = "事业一部")
              : (item.department_text = "事业二部");
            item.projectType === "1"
              ? (item.projectType_text = "教育建筑")
              : item.projectType === "2"
              ? (item.projectType_text = "居住建筑")
              : item.projectType === "3"
              ? (item.projectType_text = "文化建筑")
              : item.projectType === "4"
              ? (item.projectType_text = "体育建筑")
              : item.projectType === "5"
              ? (item.projectType_text = "酒店建筑")
              : item.projectType === "6"
              ? (item.projectType_text = "医疗建筑")
              : (item.projectType_text = "室内设计");
            item.address === "1"
              ? (item.address_text = "华南地区")
              : item.address === "2"
              ? (item.address_text = "华东地区")
              : item.address === "3"
              ? (item.address_text = "华北地区")
              : item.address === "4"
              ? (item.address_text = "中部地区")
              : (item.address_text = "西部地区");
            item.schedule === "1"
              ? (item.schedule_text = "概念方案设计")
              : item.schedule === "2"
              ? (item.schedule_text = "方案报批通过")
              : (item.schedule_text = "已建成");
          });
          this.loading = false;
        }
      });
    },
    // 修改数据
    changeProjectData(val) {
      this.end = false;
      this.loading = true;
      changeVipProject(val).then((res) => {
        this.lists = res.data.data;
        this.lists.forEach((item) => {
          // 不要修改原数据
          item.department === "1"
            ? (item.department_text = "建筑设计一部")
            : item.department === "2"
            ? (item.department_text = "建筑设计三部")
            : item.department === "3"
            ? (item.department_text = "建筑设计四部")
            : item.department === "4"
            ? (item.department_text = "建筑设计五部")
            : item.department === "5"
            ? (item.department_text = "建筑设计六部")
            : item.department === "6"
            ? (item.department_text = "建筑设计九部")
            : item.department === "7"
            ? (item.department_text = "建筑设计十部")
            : item.department === "8"
            ? (item.department_text = "事业一部")
            : (item.department_text = "事业二部");
          item.projectType === "1"
            ? (item.projectType_text = "教育建筑")
            : item.projectType === "2"
            ? (item.projectType_text = "居住建筑")
            : item.projectType === "3"
            ? (item.projectType_text = "文化建筑")
            : item.projectType === "4"
            ? (item.projectType_text = "体育建筑")
            : item.projectType === "5"
            ? (item.projectType_text = "酒店建筑")
            : item.projectType === "6"
            ? (item.projectType_text = "医疗建筑")
            : (item.projectType_text = "室内设计");
          item.address === "1"
            ? (item.address_text = "华南地区")
            : item.address === "2"
            ? (item.address_text = "华东地区")
            : item.address === "3"
            ? (item.address_text = "华北地区")
            : item.address === "4"
            ? (item.address_text = "中部地区")
            : (item.address_text = "西部地区");
          item.schedule === "1"
            ? (item.schedule_text = "概念方案设计")
            : item.schedule === "2"
            ? (item.schedule_text = "方案报批通过")
            : (item.schedule_text = "已建成");
        });
        this.loading = false;
      });
    },
      //项目详情
    toDetail(val){
      this.$router.push({
        path:val.detailUrl,
        query: {
          from: val.fromUrl,
          imgUrl: val.displayImg.url,
          proName: val.proName,
          projectType: val.projectType_text,
          schedule: val.schedule_text,
          department: val.department_text,
          paragraph: val.paragraph,
          date: val.date,
          projectUrl: val.projectUrl,
          address:val.address_text,
        },
      });
    },
    // 编辑项目
    editProject(val) {
      this.$bus.$emit("showEditProject", val);
    },
    // 子组件全选项目
    checkAllList(value) {
      if (value) {
        this.delId = [];
        this.lists.forEach((item) => {
          this.delId.push(item.id);
        });
      } else {
        this.delId = [];
      }
    },
    // 删除项目
    deleteProject(val) {
      this.$confirm("确认删除项目吗?",{type: "warning"}).then(() => {
        delVipProject(val).then((res) => {
          this.lists = res.data.data;
          this.lists.forEach((item) => {
            // 不要修改原数据
            item.department === "1"
              ? (item.department_text = "建筑设计一部")
              : item.department === "2"
              ? (item.department_text = "建筑设计三部")
              : item.department === "3"
              ? (item.department_text = "建筑设计四部")
              : item.department === "4"
              ? (item.department_text = "建筑设计五部")
              : item.department === "5"
              ? (item.department_text = "建筑设计六部")
              : item.department === "6"
              ? (item.department_text = "建筑设计九部")
              : item.department === "7"
              ? (item.department_text = "建筑设计十部")
              : item.department === "8"
              ? (item.department_text = "事业一部")
              : (item.department_text = "事业二部");
            item.projectType === "1"
              ? (item.projectType_text = "教育建筑")
              : item.projectType === "2"
              ? (item.projectType_text = "居住建筑")
              : item.projectType === "3"
              ? (item.projectType_text = "文化建筑")
              : item.projectType === "4"
              ? (item.projectType_text = "体育建筑")
              : item.projectType === "5"
              ? (item.projectType_text = "酒店建筑")
              : item.projectType === "6"
              ? (item.projectType_text = "医疗建筑")
              : (item.projectType_text = "室内设计");
            item.address === "1"
              ? (item.address_text = "华南地区")
              : item.address === "2"
              ? (item.address_text = "华东地区")
              : item.address === "3"
              ? (item.address_text = "华北地区")
              : item.address === "4"
              ? (item.address_text = "中部地区")
              : (item.address_text = "西部地区");
            item.schedule === "1"
              ? (item.schedule_text = "概念方案设计")
              : item.schedule === "2"
              ? (item.schedule_text = "方案报批通过")
              : (item.schedule_text = "已建成");
          });
        });
        this.$message.success("项目删除成功");
        this.delId = [];
      });
    },
    // 搜索项目文字高亮
    highlight(text) {
      const highlightStr = `<span class="active">${this.keyword}</span>`;
      const reg = new RegExp(this.keyword, "gi");
      return text.replace(reg, highlightStr);
    },
  },
  mounted() {
    // 获取搜索关键字,高亮
    this.$bus.$on("getKeyword", (val) => {
      this.keyword = val;
    });
  },
  beforeDestroy() {
    this.$bus.$off(["getKeyword"]); //解绑多个事件
  },
};
</script>

<style lang="less" scoped>
.architecture {
  width: 100%;
  height: 100%;
  // z-index: 0;
  // overflow: auto;
  // overflow-y: auto;

  .imgText {
    position: relative;
    .imgOuter {
      width: 340px;
      height: 230px;
      overflow: hidden;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        transition: 1.5s;
        object-fit: cover;
      }
      img:hover {
        transform: scale(1.05);
      }
    }
    .text {
      width: 100%;
      height: 100%;
      color: #101820;
      margin-left: 10px;
      .name {
        font-size: 18px;
        font-weight: 600;
      }
      .type {
        font-size: 14px;
        margin: 10px 0;
      }
      .schedule {
        margin-bottom: 14px;
        font-size: 14px;
      }
    }
  }
  .adminHandle {
    position: absolute;
    bottom: 0px;
    right: 10px;
    .delCheckItem {
      position: relative;
      zoom: 112%;
      margin-left: 10px;
      top: 3px;
    }
  }
  a {
    display: block;
    text-decoration: none;
  }
  // 字体高亮
  ::v-deep .active {
    color: #ff5134;
  }
}
</style>