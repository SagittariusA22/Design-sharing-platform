<template>
  <div class="case">
    <!-- 顶部查询功能 -->
    <div class="topMenu">
      <!-- input -->
      <div class="inputMenu">
        <div class="searchWord">
          <span>关键词搜索</span>
        </div>
        <div class="searchInput">
          <div class="outerbox">
            <el-input
              class="input"
              ref="input"
              v-model="value[6]"
              :placeholder="placeholder"
              size="mini"
              @keyup.enter.native="searchDate($event)"
              @focus="getInputFocus($event)"
              @blur="removeBlur()"
            >
            </el-input>
            <span
              class="fa fa-search searchIcon"
              @click="clearHistoryLists"
            ></span>
          </div>
          <div class="historyMenu" v-show="showSrarchMenu">
            <div class="title">
              <span>历史搜索</span>
              <span
                class="fa fa-trash deleteIcon"
                @click="clearHistoryLists"
              ></span>
            </div>
            <ul class="historyLists">
              <li
                class="historyListsItem"
                v-for="(item, index) in historyList"
                :key="index"
                @click="goSearchDetail(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <el-button
          type="primary"
          size="mini"
          class="searchButton"
          @click="resetInput"
          plain
        >
          重置</el-button
        >
      </div>
      <!-- selectMenu -->
      <div class="selectMenu">
        <div class="selectWord">
          <span>基础信息</span>
        </div>
        <div v-for="(item, index) in options" :key="index" class="selectInfo">
          <el-select
            v-model="value[5]"
            clearable
            :placeholder="item.label"
            filterable
            @change="deviceSelect($event)"
            size="mini"
            style="width: 120px"
          >
            <el-option
              v-for="item in item.optionItem"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="select">
          <el-button
            type="primary"
            size="mini"
            class="searchButton"
            @click="reset"
            plain
            >清空</el-button
          >
        </div>
      </div>
      <!-- handelLists -->
      <div class="handelLists" v-permission="'add'">
        <div class="handelWord">
          <span>基本操作</span>
        </div>
        <!-- 新增项目 -->
        <el-button
          type="primary"
          @click="addProject"
          size="mini"
          class="addProject"
          plain
          >新增案例</el-button
        >
        <div class="verticalLine"></div>
        <el-button
          type="danger"
          size="mini"
          class="delButton"
          @click="delChecklists"
          plain
        >
          删除已选</el-button
        >
        <div class="selectText">
          <span>全选</span>
          <input type="checkbox" v-model="checkAll" />
          <div class="verticalLine"></div>
          <span>已选择 {{ delId.length }} / 全部 {{ projectLists.length }} </span>
        </div>
      </div>
      <div class="line"></div>
      <!-- dialog、form表单 -->
      <el-dialog
        :title="state ? '新增项目信息' : '修改项目信息'"
        :visible.sync="isShow"
        :modal-append-to-body="false"
        append-to-body
        :close-on-click-modal="false"
      >
        <CommerForm
          class="CommerForm"
          ref="form"
          :form="form"
          :formLabel="formLabel"
          :picLabel="picLabel"
          :uploadingStatus="uploadingStatus"
          :action="action"
          :backPic="backPic"
        />
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onSubmit(form)">提交</el-button>
          <el-button @click="offSubmit">取消</el-button>
        </div>
      </el-dialog>
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
      :lists="projectLists"
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
              <img :src="acceptItem.sendItem.materialImg.url" />
            </div>
            <div class="text">
              <!-- 搜索项目名高亮 -->
              <a
                class="name"
                v-html="highlight(acceptItem.sendItem.proName)"
              ></a>
              <a class="materialType">{{
                acceptItem.sendItem.material_text
              }}</a>
              <a class="date">{{ acceptItem.sendItem.date }}</a>
              <a
                class="materialItem"
                v-html="highlight(acceptItem.sendItem.materialItem)"
              ></a>
              <div class="line"></div>
              <a class="materialCompany"
                >材料商：{{ acceptItem.sendItem.materialCompany }}</a
              >
            </div>
          </div>
          <div class="adminHandle">
            <el-button
              class="editProject"
              v-permission="'edit'"
              type="primary"
              @click="changeItem(acceptItem.sendItem)"
              size="mini"
              plain
              style="padding: 4px 6px"
              >编辑</el-button
            >
            <el-button
              class="deleteProject"
              v-permission="'delete'"
              type="danger"
              @click="delItem(acceptItem.sendItem.id)"
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
    <!-- 项目简介弹窗 -->
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      size="35%"
      class="drawer"
    >
      <div class="detail">
        <div class="img">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <img :src="detailInfo.imgUrl" />
          </el-card>
        </div>
        <div class="title text">
          <span>{{ detailInfo.material_text }}</span>
          <a>{{ detailInfo.materialItem }}</a>
          <a>Main material types</a>
        </div>
        <div class="line"></div>
        <div class="info">
          <div>
            <div class="text">
              <a>项目名称 project </a>
              <span>{{ detailInfo.proName }}</span>
            </div>
            <div class="text">
              <a>项目类型 Architectural Design Type </a>
              <span>{{ detailInfo.projectType_text }}</span>
            </div>
            <div class="text">
              <a>项目地区 address</a>
              <span>{{ detailInfo.address_text }}</span>
            </div>
            <div class="text">
              <a>设计完成时间 DESIGN COMPLETION</a>
              <span>{{ detailInfo.date }}</span>
            </div>
            <div class="text">
              <a>材料商 Material manufacturers</a>
              <span>{{ detailInfo.materialCompany }}</span>
            </div>
            <div class="text">
              <a>
                材料服务器地址 server address
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="复制材料文件地址"
                  placement="right-end"
                >
                  <span
                    class="fa fa-copy"
                    id="copy"
                    :data-clipboard-text="detailInfo.materialUrl"
                    data-clipboard-action="copy"
                    @click="copyUrl"
                  ></span>
                </el-tooltip>
              </a>
              <span id="url">{{ detailInfo.materialUrl }}</span>
            </div>
          </div>
          <div class="introduction">
            <a>材料介绍 Project Description</a>
            <span>{{ detailInfo.paragraph }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import CommerForm from "@/components/commer/CommerForm";
import permission from "@/directives/permission";
import {
  setHistoryAllList,
  getHistoryAllList,
  removeHistoryAllList,
} from "@/Utils/historyList";
import {
  getVipProject,
  delVipProject,
  addVipProject,
  changeVipProject,
} from "@/api/api";
import Clipboard from "clipboard";

export default {
  name: "case",
  components: { CommerForm },
  // 自定义指令
  directives: { permission },
  data() {
    return {
      // 项目数据//
      projectLists: [],
      // 搜索栏数据//
      placeholder: "请输入材料名称",
      // 历史记录//
      showSrarchMenu: false,
      historyList: ["超白玻", "铝"],

      msg: "正在加载中",
      loadingEndMsg: "无更多数据",
      //  无更多数据
      end: false,
      // 请求状态
      loading: true,
      // 搜索数据
      value: ["", "", "", "", "", "", ""],
      //下拉框
      options: [
        {
          label: "材料类型",
          optionItem: [
            {
              value: "1",
              label: "石材",
            },
            {
              value: "2",
              label: "玻璃",
            },
            {
              value: "3",
              label: "金属",
            },
            {
              value: "4",
              label: "涂料",
            },
            {
              value: "5",
              label: "面砖",
            },
            {
              value: "6",
              label: "木材",
            },
          ],
        },
      ],

      //管理员权限data
      // form表头
      state: true,
      isShow: false,
      uploadingStatus: true /* 文件上传是否显示 */,
      picLabel: "材料图片" /* 文件上传的表头 */,
      delId: [],
      backPic: {},
      action:
        "https://api.e.360.cn/dianjing/pichouse/upload" /* 文件上传接口 */,
      // form表单表头
      formLabel: [
        {
          model: "proName",
          label: "项目名称",
          type: "input",
        },
        {
          model: "projectType",
          label: "项目类型",
          type: "select",
          opts: [
            {
              label: "教育建筑",
              value: "1",
            },
            {
              label: "居住建筑",
              value: "2",
            },
            {
              label: "文化建筑",
              value: "3",
            },
            {
              label: "体育建筑",
              value: "4",
            },
            {
              label: "酒店建筑",
              value: "5",
            },
            {
              label: "医疗建筑",
              value: "6",
            },
            {
              label: "室内设计",
              value: "7",
            },
          ],
        },
        {
          model: "date",
          label: "设计时间",
          type: "datePicker",
          width: "100%",
        },
        {
          model: "material",
          label: "材料类型",
          type: "select",
          opts: [
            {
              label: "石材",
              value: "1",
            },
            {
              label: "玻璃",
              value: "2",
            },
            {
              label: "金属",
              value: "3",
            },
            {
              label: "涂料",
              value: "4",
            },
            {
              label: "面砖",
              value: "5",
            },
            {
              label: "木材",
              value: "6",
            },
          ],
        },
        {
          model: "materialCompany",
          label: "材料商",
          type: "input",
        },
        {
          model: "materialUrl",
          label: "材料服务器地址",
          type: "input",
        },
        {
          model: "materialParagraph",
          label: "材料简介",
          type: "textarea",
        },
      ],
      // 收集form表单数据
      form: {
        proName: "",
        projectType: "",
        date: "",
        material: "",
        materialCompany: "",
        materialUrl: "",
        materialParagraph: "",
        // 图片上传成功返回来的地址
        displayImg: [],
      },
      // 项目简介
      drawer: false,
      // drawer: false,
      detailInfo: {},

      // 虚拟滚动数据
      // 单行数据高度，含行距
      blockHeight: 422,
      // 单列数据宽度
      blockWidth: 350,
      // 容器顶部距离可视窗口顶部
      containPaddingTop: 70,
      // 容器左右被遮盖区域
      containPaddingSide: 80,
    };
  },
  methods: {
    // 数据排序的比较函数//
    compare(property, type) {
      return function (obj1, obj2) {
        // 去除 - 比较大小
        var value1 = obj1[property].replace(/-/g, "");
        var value2 = obj2[property].replace(/-/g, "");
        if (type === "descending") {
          return value2 - value1; // 降序
        } else if (type === "ascending") {
          return value1 - value2; // 升序
        }
      };
    },
    // 请求数据//
    getProjectData() {
      this.end = false;
      this.loading = true;
      this.$store.commit("vipProject/setSelectValue", this.value);
      getVipProject(this.$store.state.vipProject.selectValue).then((res) => {
        this.projectLists = res.data.data;
        // 初始数据排序
        this.projectLists.sort(this.compare("date", "descending"));
        this.projectLists.forEach((item) => {
          // 不要修改原数据
          item.material === "1"
            ? (item.material_text = "石材")
            : item.material === "2"
            ? (item.material_text = "玻璃")
            : item.material === "3"
            ? (item.material_text = "金属")
            : item.material === "4"
            ? (item.material_text = "涂料")
            : item.material === "5"
            ? (item.material_text = "面砖")
            : (item.material_text = "木材");
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
        });
        this.loading = false;
        if (!res.data.data.length) this.end = true;
      });
    },
    // 滚动到底请求更多数据//
    getMoreProjectData() {
      this.loading = true;
      getVipProject(this.$store.state.vipProject.selectValue).then((res) => {
        this.projectLists = [...this.projectLists, ...res.data.data];
        if (this.projectLists.length < 20) {
          this.getMoreProjectData();
        }
        this.projectLists.forEach((item) => {
          // 不要修改原数据
          item.material === "1"
            ? (item.material_text = "石材")
            : item.material === "2"
            ? (item.material_text = "玻璃")
            : item.material === "3"
            ? (item.material_text = "金属")
            : item.material === "4"
            ? (item.material_text = "涂料")
            : item.material === "5"
            ? (item.material_text = "面砖")
            : (item.material_text = "木材");
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
        });
        this.loading = false;
      });
    },
    // 删除数据//
    delItem(val) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", { type: "warning" })
        .then(() => {
          delVipProject(val).then((res) => {
            this.delId = [];
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.projectLists = res.data.data;
              this.projectLists.forEach((item) => {
                // 不要修改原数据
                item.material === "1"
                  ? (item.material_text = "石材")
                  : item.material === "2"
                  ? (item.material_text = "玻璃")
                  : item.material === "3"
                  ? (item.material_text = "金属")
                  : item.material === "4"
                  ? (item.material_text = "涂料")
                  : item.material === "5"
                  ? (item.material_text = "面砖")
                  : (item.material_text = "木材");
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 提交按钮,新增和修改数据//
    onSubmit() {
      // 信息校验
      const {
        proName,
        projectType,
        date,
        material,
        materialCompany,
        materialUrl,
        materialParagraph,
      } = this.form;
      if (
        proName !== "" &&
        projectType !== "" &&
        date !== "" &&
        material !== "" &&
        materialCompany !== "" &&
        materialUrl !== "" &&
        materialParagraph !== ""
      ) {
        // 判断是新增还是修改
        if (this.state) {
          this.$confirm("确认上传材料信息吗?").then(() => {
            addVipProject(this.form).then((res) => {
              if (res.data.status === 200) {
                this.getProjectData();
                this.isShow = false;
              }
            });
          });
        } else {
          this.$confirm("确认修改材料信息吗?").then(() => {
            changeVipProject(this.form).then((res) => {
              if (res.data.status === 200) {
                this.$message.success("材料信息修改成功");
                this.getProjectData();
                this.isShow = false;
              }
            });
          });
        }
      } else {
        this.$message.error("项目信息不完整，请完善后提交");
      }
    },

    // select默认触发事件//
    deviceSelect() {
      this.getProjectData();
    },
    // select清空//
    reset() {
      this.value[5] = "";
      this.getProjectData();
    },

    // input搜索//
    searchDate(event) {
      this.getProjectData();
      // 没有搜索记录，把搜索值push进数组首位，存入本地
      if (!this.historyList.includes(this.value[6])) {
        // 记录长度不大于8
        if (this.historyList.length >= 8) {
          this.historyList.pop();
        }
        this.historyList.unshift(this.value[6]);
        setHistoryAllList(
          "historyAllListKey",
          JSON.stringify(this.historyList)
        );
      } else {
        //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
        let i = this.historyList.indexOf(this.value[6]);
        this.historyList.splice(i, 1);
        this.historyList.unshift(this.value[6]);
        setHistoryAllList(
          "historyAllListKey",
          JSON.stringify(this.historyList)
        );
      }
      // 关闭记录，失去焦点
      this.removeBlur();
      if (event) {
        event.target.blur();
      }
    },
    // 弹出记录//
    getInputFocus(event) {
      this.showSrarchMenu = true;
    },
    // 关闭记录//
    removeBlur() {
      let time = setTimeout(() => {
        this.showSrarchMenu = false;
        clearTimeout(time);
      }, 200);
    },
    // 清除记录//
    clearHistoryLists() {
      this.historyList = [];
      removeHistoryAllList("historyAllListKey");
    },
    // 点击历史记录//
    goSearchDetail(item) {
      this.value[6] = "";
      this.value[6] = item;
      this.searchDate();
    },
    // input重置//
    resetInput() {
      this.value[6] = "";
      this.getProjectData();
    },

    //管理员权限 methods
    // 新增按钮//
    addProject() {
      this.isShow = true;
      // 标题为新增
      this.state = true;
    },
    // 项目简介
    toDetail(val) {
      this.drawer = true;
      this.detailInfo = val;
      this.detailInfo.imgUrl = this.detailInfo.materialImg.url;
    },
    // 编辑按钮//
    changeItem(row) {
      this.$bus.$emit("showPic", row.materialImg);
      this.state = false;
      this.form = { ...row };
      this.isShow = true;
    },
    // 删除已选项目//
    delChecklists() {
      this.delId.length
        ? this.delItem(this.delId)
        : this.$message("请选择要删除的项目");
    },
    // 取消按钮//
    offSubmit() {
      this.isShow = false;
    },
    // 搜索项目文字高亮//
    highlight(text) {
      const highlightStr = `<span style="color:#ff5134">${this.value[6]}</span>`;
      const reg = new RegExp(this.value[6], "gi");
      return text.replace(reg, highlightStr);
    },
    // 复制项目名称
    copyUrl() {
      let clipboard = new Clipboard("#copy");
      clipboard.on("success", (e) => {
        this.$message.success("复制成功"); // 利用Element组件给予成功提示
        clipboard.destroy(); // 释放内存
      });
      clipboard.on("error", (e) => {
        this.$message.error("该浏览器不支持自动复制"); // 给予错误提示信息
        clipboard.destroy(); // 释放内存
      });
    },
  },
  computed: {
    // 全选框//
    checkAll: {
      // 已选数据等于数据全部，且不为 0
      get() {
        return (
          this.delId.length === this.projectLists.length && this.delId.length
        );
      },
      // value为checkbox点击的状态
      set(value) {
        if (value) {
          this.delId = [];
          this.projectLists.forEach((item) => {
            this.delId.push(item.id);
          });
        } else {
          this.delId = [];
        }
      },
    },
  },
  watch: {
    // 关闭时清空form数据
    isShow(newValue) {
      if (!newValue) {
        // 子组件form清空图片上传的缓存
        this.$bus.$emit("resetPics");
        this.form = {
          proName: "",
          projectType: "",
          date: "",
          material: "",
          materialCompany: "",
          materialUrl: "",
          materialParagraph: "",
          displayImg: [],
        };
      }
    },
  },
  created() {
    this.getProjectData();
  },
   beforeMount(){
    // 先调用form，再关闭，解决第一次回显失败问题，但是页面有抖动，待优化
    // this.isShow = true;
  },
  mounted() {
    // 先调用form，再关闭，解决第一次回显失败问题，但是页面有抖动，待优化
    // this.isShow = true;

    //本地存储的historyList有值，直接赋值给data中的 historyList
    if (JSON.parse(getHistoryAllList("historyAllListKey"))) {
      this.historyList = JSON.parse(getHistoryAllList("historyAllListKey"));
    }
  },

};
</script>

<style lang="less" scoped>
.topMenu {
  background-color: rgb(255, 255, 255);
  position: fixed;
  top: 70px;
  z-index: 2;
  width: 100%;
  padding: 20px 40px 14px 40px;
  min-width: 1280px;
  .inputMenu {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .searchWord {
      width: 100px;
      span {
        margin-right: 20px;
        color: rgb(116, 116, 116);
        font-size: 14px;
      }
    }
    .searchInput {
      position: relative;
      display: flex;
      .outerbox {
        z-index: 5;
        height: 26px;
        border: 1px solid #dbdfe6;
        border-radius: 4px;
        z-index: 5;
        .el-input {
          width: 215px;
        }
        /deep/.el-input__inner {
          background-color: transparent !important;
          border: 0;
        }
        .searchIcon {
          line-height: 26px;
          padding: 0 15px;
          font-size: 14px;
          color: #bbbbbb;
          background-color: #fff;
          cursor: pointer;
        }
        // /deep/ .input .el-input__inner:focus{
        //   border-color: rgb(255, 255, 255);
        // }
      }
      .outerbox:focus-within {
        border-color: rgb(255, 255, 255);
      }
      .historyMenu {
        width: 100%;
        z-index: 4;
        top: 0;
        padding-top: 50px;
        position: absolute;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 0 6px 4px rgb(245, 245, 245);
        font-size: 14px;
        color: rgb(116, 116, 116);
        .title {
          margin: 0px 16px;
          display: flex;
          justify-content: space-between;
          .deleteIcon {
            font-size: 16px;
            cursor: pointer;
          }
          .deleteIcon:hover {
            color: #ff6263;
          }
        }
        .historyLists {
          line-height: 24px;
          padding: 12px 0px;
        }
        .historyListsItem {
          padding: 0 17px;
        }
        .historyListsItem:hover {
          background-color: #eeeeee;
        }
      }
    }
    .searchButton {
      margin: 0 20px;
    }
  }
  .selectMenu {
    width: 100%;
    display: flex;
    height: 28px;
    margin-bottom: 20px;
    .selectWord {
      width: 100px;
      span {
        line-height: 28px;
        color: rgb(116, 116, 116);
        font-size: 14px;
        margin-right: 20px;
      }
    }
    .selectInfo {
      margin-right: 20px;
    }
  }
  .handelLists {
    width: 100%;
    display: flex;
    height: 28px;
    position: relative;
    .handelWord {
      width: 100px;
      span {
        line-height: 28px;
        color: rgb(116, 116, 116);
        font-size: 14px;
        margin-right: 20px;
      }
    }
    .delButton {
      margin-right: 20px;
    }
    .selectText {
      display: flex;
        align-items: center;
      span {
        line-height: 28px;
        color: rgb(116, 116, 116);
        font-size: 14px;
      }
    }
    .verticalLine {
      width: 1px;
      background-color: rgba(78, 78, 78, 0.2);
      margin: 4px 20px;
      height: 20px;
    }
  }
  .line {
    height: 1px;
    background-color: rgba(78, 78, 78, 0.2);
    margin-top: 20px;
    margin-right: 80px;
  }
  .el-dialog__wrapper {
    z-index: 99;
  }
}
/deep/ .el-dialog {
    width: 700px;
    height: 780px;
  position: relative;
  border-radius: 10px;
}
.dialog-footer {
  position: absolute;
  bottom: 30px;
  right: 56px;
}
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
    width: 90%;
    height: 100%;
    color: #101820;
    margin: 0 auto;
    .materialType {
      position: absolute;
      background-color: rgba(0, 101, 155, 0.7);
      color: #fff;
      font-size: 14px;
      padding: 8px 12px;
      top: 10px;
      right: 0;
    }
    .name {
      font-size: 18px;
      font-weight: 600;
    }
    .date {
      font-size: 14px;
      margin: 6px 0 15px 0;
      color: #4b4b4b;
    }
    .materialItem {
      margin-bottom: 14px;
      font-size: 14px;
    }
    .line {
      height: 1px;
      background-color: rgba(78, 78, 78, 0.2);
      margin-bottom: 20px;
      padding-right: 5px;
    }
    .materialCompany {
      margin-bottom: 14px;
      font-size: 14px;
    }
  }
}
.adminHandle {
  position: absolute;
  bottom: 94px;
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
.drawer {
  .detail {
    margin: 20px auto;
    width: 90%;
    height: 90%;
    .img {
      width: 100%;
      margin-bottom: 20px;
      .el-card {
        border-radius: 20px;
        width: 100%;
        height: 300px;
        img {
          border-radius: 20px;
          width: 100%;
          height: 300px;
          object-fit: cover;
        }
      }
    }
    .title {
      margin-bottom: 15px;
      font-weight: bold;
      span {
        font-size: 20px;
        color: rgb(37, 37, 37);
        margin-bottom: 6px;
        display: block;
      }
      a {
        margin-bottom: 12px;
        font-size: 14px;
      }
    }
    .line {
      height: 1px;
      background-color: rgba(78, 78, 78, 0.2);
      margin-bottom: 20px;
    }
    .info {
      display: flex;
      justify-content: space-between;
      .text {
        padding-bottom: 18px;
        a {
          font-size: 12px;
          color: rgb(116, 116, 116);
          text-transform: uppercase;
          display: block;
          margin-bottom: 7px;
          span {
            color: #4b4b4b;
            font-size: 14px;
            font-weight: bold;
            margin-left: 8px;
            cursor: pointer;
          }
        }
        span {
          font-size: 15px;
          color: rgb(37, 37, 37);
          text-transform: uppercase;
        }
      }
      .introduction {
        width: 40%;
        a {
          display: block;
          font-size: 12px;
          color: rgb(116, 116, 116);
          margin-bottom: 7px;
          text-transform: uppercase;
        }
        span {
          font-size: 15px;
          color: rgb(37, 37, 37);
          line-height: 20px;
        }
      }
    }
  }
}
</style>