<template>
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
        v-permission="'add'"
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
        <span>已选择{{ delId.length }} / 全部{{ lists.length }} </span>
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
        :rules="rules"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit(form)">提交</el-button>
        <el-button @click="offSubmit">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommerForm from "@/components/commer/CommerForm";
import permission from "@/directives/permission";
import {
  setHistoryList,
  getHistoryList,
  removeHistoryList,
} from "@/Utils/historyList";

export default {
  name: "arcSearchMenu",
  components: { CommerForm },
  // 自定义指令
  directives: { permission },
  props: {
    delId: Array,
    lists: Array,
  },
  data() {
    return {
      placeholder: "请输入项目名称",
      // 历史记录
      showSrarchMenu: false,
      historyList: ["万科", "深圳"],

      // 搜索数据
      value: ["", "", "", "", ""],
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

      //管理员权限data
      // form表头
      state: true,
      isShow: false,
      uploadingStatus: true /* 文件上传是否显示 */,
      picLabel: "项目图片" /* 文件上传的表头 */,
      action:
        "https://api.e.360.cn/dianjing/pichouse/upload" /* 文件上传接口 */,
      rules: "",
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
          model: "date",
          label: "设计时间",
          type: "datePicker",
          width: "100%",
        },
        {
          model: "address",
          label: "项目地区",
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
      // form表单数据
      form: {
        proName: "",
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
    // 删除已选项目
    delChecklists() {
      this.delId.length
        ? this.$emit("deleteProject", this.delId)
        : this.$message("请选择要删除的项目");
    },
    // 请求数据
    getDate() {
      this.$store.commit("vipProject/setSelectValue", this.value);
      this.$emit("getProjectData", this.$store.state.vipProject.selectValue);
    },
    // select默认触发事件
    deviceSelect() {
      this.getDate();
    },
    // select清空
    reset() {
      this.value[0] = "";
      this.value[1] = "";
      this.value[2] = "";
      this.value[3] = "";
      this.getDate();
    },
    // input搜索
    searchDate(event) {
      this.getDate();
      // 给父传搜索关键字，高亮
      this.$bus.$emit("getKeyword", this.value[4]);
      // 没有搜索记录，把搜索值push进数组首位，存入本地
      if (!this.historyList.includes(this.value[4])) {
        // 记录长度不大于8
        if (this.historyList.length >= 8) {
          console.log(111);
          this.historyList.pop();
        }
        this.historyList.unshift(this.value[4]);
        setHistoryList("historyListKey", JSON.stringify(this.historyList));
      } else {
        //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
        let i = this.historyList.indexOf(this.value[4]);
        this.historyList.splice(i, 1);
        this.historyList.unshift(this.value[4]);
        setHistoryList("historyListKey", JSON.stringify(this.historyList));
      }
      // 关闭记录，失去焦点
      this.removeBlur();
      if (event) {
        event.target.blur();
      }
    },
    // 弹出记录
    getInputFocus(event) {
      // if(this.historyList.length) {
      this.showSrarchMenu = true;
      // }
    },
    // 关闭记录
    removeBlur() {
      let time = setTimeout(() => {
        this.showSrarchMenu = false;
        clearTimeout(time);
      }, 100);
    },
    // 清除记录
    clearHistoryLists() {
      this.historyList = [];
      removeHistoryList("historyListKey");
    },
    // 点击记录
    goSearchDetail(item) {
      this.value[4] = "";
      this.value[4] = item;
      this.searchDate();
    },
    // input重置
    resetInput() {
      this.value[4] = "";
      this.getDate();
      //高亮字体清空
      this.$bus.$emit("getKeyword", this.value[4]);
    },

    //管理员权限 methods
    // 新增按钮
    addProject() {
      this.isShow = true;
      // 标题为新增
      this.state = true;
    },
    // 提交按钮
    onSubmit() {
      // 信息校验
      const {
        proName,
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
          this.$confirm("确认提交保存吗?").then(() => {
            this.$emit("addProjectData", this.form);
            this.isShow = false;
          });
        } else {
          this.$confirm("确认修改项目信息吗?").then(() => {
            this.$emit("changeProjectData", this.form);
            this.isShow = false;
          });
        }
      } else {
        this.$message.error("项目信息不完整，请完善后提交");
      }
    },
    // 取消按钮
    offSubmit() {
      this.isShow = false;
    },
  },
  computed: {
    // 全选框
    checkAll: {
      // 已选数据等于数据全部，且不为 0
      get() {
        return this.delId.length === this.lists.length && this.delId.length;
      },
      set(value) {
        this.$emit("checkAllList", value);
      },
    },
  },
  watch: {
    // 关闭时清空form数据
    isShow(newValue) {
      if (!newValue) {
        // 总线，子组件form清空图片上传的缓存
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
  mounted() {
    // 父组件编辑按钮，调用form表单弹出
    this.$bus.$on("showEditProject", (val) => {
      // 图片回显
      this.$bus.$emit("showPic", val.displayImg);
      this.form = { ...val };
      this.state = false;
      this.isShow = true;
    });
    //本地存储的historyList有值，直接赋值给data中的 historyList
    if (JSON.parse(getHistoryList("historyListKey"))) {
      this.historyList = JSON.parse(getHistoryList("historyListKey"));
    }
  },
  beforeDestroy() {
    this.$bus.$off(["showEditProject"]); //解绑多个自定义事件
  },
};
</script>
<style lang="less" scoped>
.topMenu {
  background-color: rgb(255, 255, 255);
  position: fixed;
  top: 70px;
  z-index: 1;
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
.CommerForm {
  overflow: hidden;
}
// 底部按钮
.dialog-footer {
  margin-top: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-evenly;
  padding-left: 120px;
  padding-right: 120px;
}
</style>