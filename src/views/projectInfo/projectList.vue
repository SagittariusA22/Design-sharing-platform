<template>
  <div class="projectList">
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
              v-model="value[4]"
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
            v-model="value[index]"
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
          >新增项目</el-button
        >
        <div class="verticalLine"></div>
        <el-button
          type="danger"
          size="mini"
          class="delButton"
          @click="delChecklists"
          plain
        >
          删除已选项目</el-button
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
        style="margin-top: -50px;"
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

    <!-- label 数据列表 -->
    <div class="label">
      <CommerTabel
        :tableLabel="tableLabel"
        :tableData="projectLists"
        :total="total"
      >
        <!-- 删除选择框 -->
        <template slot="top">
        <!-- 操作框 -->
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button
              class="edit"
              type="primary"
              size="mini"
              @click="projectDatile(scope.row)"
              style="padding: 5px 6px"
              >简介
              <i class="el-icon-caret-right el-icon--right" style="margin-left: -5px">
                </i></el-button
            >
            <el-button
              class="edit"
              type="primary"
              style="padding: 5px 6px"
              size="mini"
              @click="changeItem(scope.row)"
              v-permission="'edit'"
              >编辑
              <i class="el-icon-edit el-icon--right" style="margin-left: 0px">
                </i></el-button
            >
            <el-button
              @click="delItem(scope.row.id)"
              style="padding: 5px 6px"
              type="danger"
              size="mini"
              v-permission="'delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
        </template>

        <!-- 具名插槽，项目名称,这里不需要子组件传数据过来 -->
        <template slot="top">
          <el-table-column
            prop="proName"
            label="项目名称"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <span v-html="highlight(scope.row.proName)"></span>
            </template>
          </el-table-column>
        </template>
 
        <el-table-column  width="80" align="center" label="多选" >
          <template slot-scope="scope" >
            <input
              type="checkbox"
              class="delCheckItem"
              :value="scope.row.id"
              v-model="delId"
            />
          </template>
        </el-table-column>
      </CommerTabel>
      <!-- 加载图标 -->
      <div class="loading">
        <a class="fa fa-spinner" v-show="loading"></a>
        <span v-show="loading">{{ msg }}</span>
      </div>
      <div class="end">
        <a class="fa fa-exclamation-circle" v-show="end"></a>
        <span v-show="end">{{ loadingEndMsg }}</span>
      </div>

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
            <span>{{ detailInfo.proName }}</span>
            <a>Architectural scheme planning and design</a>
          </div>
          <div class="line"></div>
          <div class="info">
            <div>
              <div class="text">
                <a>项目类型 Architectural Design Type </a>
                <span>{{ detailInfo.projectType_text }}</span>
              </div>
              <div class="text">
                <a>项目地区 address</a>
                <span>{{ detailInfo.address_text }}</span>
              </div>
              <div class="text">
                <a>服务范围/建设情况 SERVICE & Building</a>
                <span>{{ detailInfo.schedule_text }}</span>
              </div>
              <div class="text">
                <a>设计团队 TEAM</a>
                <span>{{ detailInfo.department_text }}</span>
              </div>
              <div class="text">
                <a>设计完成时间 DESIGN COMPLETION</a>
                <span>{{ detailInfo.date }}</span>
              </div>
              <div class="text">
                <a>
                  项目服务器地址 server address
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="复制项目链接"
                    placement="right-end"
                  >
                    <span
                      class="fa fa-copy"
                      id="copy"
                      :data-clipboard-text="detailInfo.projectUrl"
                      data-clipboard-action="copy"
                      @click="copyUrl"
                    ></span>
                  </el-tooltip>
                </a>
                <span id="url">{{ detailInfo.projectUrl }}</span>
              </div>
              <div class="text">
                <a> 项目业主 server address</a>
                <span>{{ detailInfo.owner }}</span>
              </div>
            </div>
            <div class="introduction">
              <a>项目简介 Project Description</a>
              <span>{{ detailInfo.paragraph }}</span>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    <el-footer>
      <footerMsg />
    </el-footer>
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
import CommerTabel from "@/components/commer/CommerTabel";
import { projects, delProject, addProject, changProject } from "@/api/api";
import Clipboard from "clipboard";
import footerMsg from "@/components/footerMsg";

export default {
  name: "studentsList",
  components: { CommerTabel, CommerForm, footerMsg },
  // 自定义指令
  directives: { permission },
  data() {
    return {
      total: 0,
      // 项目列表表头//
      tableLabel: [
        {
          prop: "owner",
          label: "项目业主",
        },
        {
          prop: "department_text",
          label: "设计部门",
        },
        {
          prop: "date",
          label: "设计时间",
          sortable: "custom",
        },
        {
          prop: "projectType_text",
          label: "项目类型",
        },
        {
          prop: "schedule_text",
          label: "项目进度",
        },
        {
          prop: "address_text",
          label: "项目区位",
        },
      ],
      // 项目数据//
      projectLists: [],
      // 搜索栏数据//
      placeholder: "请输入项目名称或开发商",
      // 历史记录//
      showSrarchMenu: false,
      historyList: ["万科", "华侨城"],

      msg: "正在加载中",
      loadingEndMsg: "无更多数据",
      //  无更多数据
      end: false,
      // 请求状态
      loading: true,
      // 搜索数据
      value: ["", "", "", "", ""],
      //下拉框
      options: [
        {
          label: "设计团队",
          optionItem: [
            {
              value: "1",
              label: "建筑设计一部",
            },
            {
              value: "2",
              label: "建筑设计三部",
            },
            {
              value: "3",
              label: "建筑设计四部",
            },
            {
              value: "4",
              label: "建筑设计五部",
            },
            {
              value: "5",
              label: "建筑设计六部",
            },
            {
              value: "6",
              label: "建筑设计九部",
            },
            {
              value: "7",
              label: "建筑设计十部",
            },
            {
              value: "8",
              label: "事业一部",
            },
            {
              value: "9",
              label: "事业二部",
            },
          ],
        },
        {
          label: "项目类型",
          optionItem: [
            {
              value: "1",
              label: "教育建筑",
            },
            {
              value: "2",
              label: "居住建筑",
            },
            {
              value: "3",
              label: "文化建筑",
            },
            {
              value: "4",
              label: "体育建筑",
            },
            {
              value: "5",
              label: "酒店建筑",
            },
            {
              value: "6",
              label: "医疗建筑",
            },
            {
              value: "7",
              label: "室内设计",
            },
          ],
        },
        {
          label: "项目进展",
          optionItem: [
            {
              value: "1",
              label: "概念方案设计",
            },
            {
              value: "2",
              label: "方案报批通过",
            },
            {
              value: "3",
              label: "已建成",
            },
          ],
        },
        {
          label: "地区",
          optionItem: [
            {
              value: "1",
              label: "华南地区",
            },
            {
              value: "2",
              label: "华东地区",
            },
            {
              value: "3",
              label: "华北地区",
            },
            {
              value: "4",
              label: "中部地区",
            },
            {
              value: "5",
              label: "西部地区",
            },
          ],
        },
      ],
      // 项目简介
      drawer: false,
      // drawer: false,
      detailInfo: {},

      //管理员权限data
      // form表头
      state: true,
      isShow: false,
      uploadingStatus: true /* 文件上传是否显示 */,
      picLabel: "项目图片" /* 文件上传的表头 */,
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
          model: "department",
          label: "设计部门",
          type: "select",
          opts: [
            {
              label: "建筑设计一部",
              value: "1",
            },
            {
              label: "建筑设计三部",
              value: "2",
            },
            {
              label: "建筑设计四部",
              value: "3",
            },
            {
              label: "建筑设计五部",
              value: "4",
            },
            {
              label: "建筑设计六部",
              value: "5",
            },
            {
              label: "建筑设计九部",
              value: "6",
            },
            {
              label: "建筑设计十部",
              value: "7",
            },
            {
              label: "事业一部",
              value: "8",
            },
            {
              label: "事业二部",
              value: "9",
            },
          ],
        },
        {
          model: "owner",
          label: "项目业主",
          type: "input",
        },
        {
          model: "date",
          label: "设计时间",
          type: "datePicker",
          width: "100%",
        },
        {
          model: "address",
          label: "项目区位",
          type: "select",
          opts: [
            {
              label: "华南地区",
              value: "1",
            },
            {
              label: "华东地区",
              value: "2",
            },
            {
              label: "华北地区",
              value: "3",
            },
            {
              label: "中部地区",
              value: "4",
            },
            {
              label: "西部地区",
              value: "5",
            },
          ],
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
          model: "schedule",
          label: "项目进展",
          type: "radio",
          opts: [
            {
              label: "概念方案设计",
              value: "1",
            },
            {
              label: "方案报批通过",
              value: "2",
            },
            {
              label: "已建成",
              value: "3",
            },
          ],
        },
        {
          model: "projectUrl",
          label: "项目服务器地址",
          type: "input",
        },
        {
          model: "paragraph",
          label: "项目简介",
          type: "textarea",
        },
      ],
      // 收集form表单数据
      form: {
        proName: "",
        owner: "",
        department: "",
        date: "",
        projectType: "",
        schedule: "",
        projectUrl: "",
        paragraph: "",
        address: "",
        // 图片上传成功返回来的地址
        displayImg: [],
      },

    };
  },
  methods: {
    // 数据排序的比较函数
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
      this.loading = true;
      this.$store.commit("vipProject/setSelectValue", this.value);
      projects(this.$store.state.vipProject.selectValue).then((res) => {
        this.projectLists = res.data.data;
        // 初始数据排序
        this.projectLists.sort(this.compare("date", "descending"));
        this.total = res.data.total;
        this.projectLists.forEach((item) => {
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
    // 删除数据//
    delItem(val) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", { type: "warning" })
        .then(() => {
          delProject(val).then((res) => {
            this.delId = [];
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.projectLists = res.data.data;
              this.total = res.data.total;
              this.projectLists.forEach((item) => {
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
        owner,
        department,
        date,
        projectType,
        schedule,
        projectUrl,
        paragraph,
        address,
      } = this.form;
      if (
        proName !== "" &&
        owner !== "" &&
        department !== "" &&
        date !== "" &&
        projectType !== "" &&
        schedule !== "" &&
        projectUrl !== "" &&
        paragraph !== "" &&
        address !== ""
      ) {
        // 判断是新增还是修改
        if (this.state) {
          this.$confirm("确认上传项目信息吗?").then(() => {
            addProject(this.form).then((res) => {
              if (res.data.status === 200) {
                this.getProjectData();
                this.isShow = false;
              }
            });
          });
        } else {
          this.$confirm("确认修改项目信息吗?").then(() => {
            changProject(this.form).then((res) => {
              if (res.data.status === 200) {
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
      this.value[0] = "";
      this.value[1] = "";
      this.value[2] = "";
      this.value[3] = "";
      this.getProjectData();
    },

    // input搜索//
    searchDate(event) {
      this.getProjectData();
      // 没有搜索记录，把搜索值push进数组首位，存入本地
      if (!this.historyList.includes(this.value[4])) {
        // 记录长度不大于8
        if (this.historyList.length >= 8) {
          this.historyList.pop();
        }
        this.historyList.unshift(this.value[4]);
        setHistoryAllList(
          "historyAllListKey",
          JSON.stringify(this.historyList)
        );
      } else {
        //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
        let i = this.historyList.indexOf(this.value[4]);
        this.historyList.splice(i, 1);
        this.historyList.unshift(this.value[4]);
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
      this.value[4] = "";
      this.value[4] = item;
      this.searchDate();
    },
    // input重置//
    resetInput() {
      this.value[4] = "";
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
    projectDatile(val) {
      this.drawer = true;
      this.detailInfo = val;
      this.detailInfo.imgUrl = this.detailInfo.displayImg.url;
    },
    // 编辑按钮//
    changeItem(row) {
      this.$bus.$emit("showPic", row.displayImg);
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
      const highlightStr = `<span style="color:#ff5134">${this.value[4]}</span>`;
      const reg = new RegExp(this.value[4], "gi");
      return text.replace(reg, highlightStr);
    },
    // 复制项目名称
    copyUrl() {
      let clipboard = new Clipboard("#copy");
      clipboard.on("success", (e) => {
        this.$message.success("已复制至剪切板"); // 利用Element组件给予成功提示
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
    // 关闭时清空form数据//
    isShow(newValue) {
      if (!newValue) {
        // 子组件form清空图片上传的缓存
        this.$bus.$emit("resetPics");
        this.form = {
          proName: "",
          owner: "",
          department: "",
          date: "",
          projectType: "",
          schedule: "",
          projectUrl: "",
          paragraph: "",
          address: "",
          displayImg: [],
        };
      }
    },
  },
  created() {
    this.getProjectData();
  },
  mounted() {
    //本地存储的historyList有值，直接赋值给data中的 historyList
    if (JSON.parse(getHistoryAllList("historyAllListKey"))) {
      this.historyList = JSON.parse(getHistoryAllList("historyAllListKey"));
    }
  },
};
</script>

<style lang="less" scoped>
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
.projectList {
  height: 100%;
  width: 100%;
}
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
// table表头
.edit {
  color: #fff;
  background-color:#9DA5FE;
  border-color: #9DA5FE;
}

.label {
  margin: 0 40px;
  margin-top: 200px;
  z-index: 0;
}
.loading {
  line-height: 50px;
  margin-left: 50%;
  margin-bottom: 10px;
  position: relative;
  right: 50px;
  span {
    margin-left: 8px;
    font-size: 16px;
    text-align: center;
  }
  a {
    animation: loading 1s linear infinite;
  }
  // 加载滚动
  @keyframes loading {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.end {
  line-height: 50px;
  margin-left: 50%;
  margin-bottom: 10px;
  position: relative;
  right: 50px;
  span {
    margin-left: 8px;
    font-size: 16px;
    text-align: center;
  }
}
// 隐藏table滚动条
/deep/.el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
}
.el-footer {
  min-width: 1280px;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 0;
}
/deep/ .el-dialog {
  
    width: 700px;
    height: 900px;
  position: relative;
  border-radius: 10px;
}
.dialog-footer {
  position: absolute;
  bottom: 30px;
  right: 56px;
}
</style>