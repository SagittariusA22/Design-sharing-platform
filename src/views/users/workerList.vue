
<template>
  <div class="workerList">
    <div class="lists">
      <div class="graphics">
        <div class="icon fa fa-user-plus"></div>
        <span>员工列表</span>
      </div>
      <div class="btn">
        <el-upload
          v-if="upload"
          class="upload"
          action
          :on-change="handleLoading"
          accept=".xlsx, xls"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button class="inLists" size="mini">导入</el-button>
        </el-upload>
        <el-button
          v-if="sendData"
          class="loadingWorkerList"
          size="mini"
          @click="sendWorkerList()"
          type="primary"
          >提交新增人员名单至服务器</el-button
        >
        <el-button class="loadingWorkerList" size="mini" @click="loadingWorkerList()"
          >导出</el-button
        >
        <el-button
          @click="addProject"
          type="primary"
          size="mini"
          class="addProject"
          plain
          >创建成员</el-button
        >
      </div>
    </div>
    <!-- input -->
    <div class="inputMenu">
      <div class="search">
        <div class="searchInput">
          <div class="outerbox">
            <el-input
              class="input"
              ref="input"
              v-model="keyword"
              :placeholder="placeholder"
              size="mini"
              @keyup.enter.native="searchDate($event)"
              @focus="getInputFocus($event)"
              @blur="removeBlur()"
            >
            </el-input>
            <span class="fa fa-search searchIcon" @click="searchDate"></span>
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
      <!-- handelLists -->
      <div class="handelLists" v-permission="'add'">
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
          <span>已选择 {{ checkedId.length }} / 全部 {{ workerLists.length }} </span>
        </div>
      </div>
    </div>
    <div class="inputFixed">
      <div class="workerLists">
        <div class="loading">
          <a class="fa fa-spinner" v-show="loading"></a>
          <span v-show="loading">{{ msg }}</span>
        </div>
        <div class="end">
          <a class="fa fa-exclamation-circle" v-show="end"></a>
          <span v-show="end">{{ loadingEndMsg }}</span>
        </div>
        <div v-if="listShwo">
          <div class="info" v-for="item in workerLists" :key="item.cardId">
            <input
              type="checkbox"
              class="delCheckItem"
              v-model="checkedId"
              :value="item"
            />
            <div>
              <span class="workerImg">US</span>
            </div>
            <div class="materailText name">
              <a class="workerTitle">姓名</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.name) || '-'"
              ></a>
            </div>
            <div class="materailText sex">
              <a class="workerTitle">性别</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.sex_text) || '-'"
              ></a>
            </div>
            <div class="materailText phone">
              <a class="workerTitle">联系方式</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.phone) || '-'"
              ></a>
            </div>
            <div class="materailText email">
              <a class="workerTitle">邮箱</a>
              <a class="workerTitleInfo">{{ item.email || "-" }}</a>
            </div>
            <div class="materailText cardId">
              <a class="workerTitle">身份证</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.cardId) || '-'"
              ></a>
            </div>
            <div class="materailText timer">
              <a class="workerTitle">上次登录时间</a>
              <a class="workerTitleInfo">{{ item.date || "-" }}</a>
            </div>
            <el-button
              class="edit"
              type="primary"
              style="padding: 5px 6px"
              plain
              size="mini"
              @click="changeItem(item)"
              v-permission="'edit'"
              >编辑 <i style="margin-left: 0px"> </i
            ></el-button>
            <el-button
              class="deleteBtn"
              @click="delItem(item.id)"
              style="padding: 5px 6px"
              type="danger"
              plain
              size="mini"
              v-permission="'delete'"
              >删除</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- dialog、form表单 -->
    <el-dialog
      :title="state ? '新增员工信息' : '修改员工信息'"
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
        :uploadingStatus="uploadingStatus"
      />
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="onSubmit(form)" size="mini">提交</el-button>
        <el-button @click="offSubmit" size="mini">取消</el-button>
      </div>
    </el-dialog>
    <el-footer>
      <footerMsg />
    </el-footer>
  </div>
</template>
<script>
import * as xlsx from "xlsx/xlsx.mjs";
import { delay, readFile, character } from "@/Utils/upLoadFile.js";
import CommerForm from "@/components/commer/CommerForm";
import footerMsg from "@/components/footerMsg";
import permission from "@/directives/permission";
import {
  setHistoryAllList,
  getHistoryAllList,
  removeHistoryAllList,
} from "@/Utils/historyList";
import {
  getWorkerLists,
  delWorkerLists,
  addWorkerLists,
  changeWorkerLists,
} from "@/api/api";

export default {
  name: "workerList",
  components: { footerMsg, CommerForm },
  // 自定义指令
  directives: { permission },
  data() {
    return {
      //人员数据
      workerLists: [],
      addWorkerLists: [],
      // 请求状态
      msg: "正在加载中",
      loading: true,
      loadingEndMsg: "无更多数据",
      //  无更多数据
      end: false,
      // 删除数据
      checkedId: [],
      // 列表展示
      listShwo: true,
      // 上传员工数据至服务器
      sendData: false,
      // 导入员工数据
      upload: true,
      keyword: "",
      // 搜索栏数据//
      placeholder: "用户ID / 请输入姓名 / 手机号码 / 地址",
      // 历史记录//
      showSrarchMenu: false,
      historyList: [],

      //管理员权限data
      // form表头
      state: true,
      isShow: false,
      uploadingStatus: false /* 文件上传是否显示 */,
      // form表单表头
      formLabel: [
        {
          model: "name",
          label: "员工姓名",
          type: "input",
        },
        {
          model: "sex",
          label: "性别",
          type: "select",
          opts: [
            {
              label: "男",
              value: "0",
            },
            {
              label: "女",
              value: "1",
            },
          ],
        },
        {
          model: "phone",
          label: "联系方式",
          type: "input",
        },
        {
          model: "cardId",
          label: "身份证",
          type: "input",
        },
        {
          model: "email",
          label: "邮箱",
          type: "input",
        },
      ],
      // 收集form表单数据
      form: {
        name: "",
        cardId: "",
        email: "",
        phone: "",
        sex: "",
      },
    };
  },

  created() {
    // 请求人员数据//
    this.getProjectData();
  },

  methods: {
    // 导入excel
    async handleLoading(ev) {
      let file = ev.raw;
      if (!file) return;

      this.loading = true;
      this.listShwo = false;
      // 异步转二进制，数据转json
      let data = await readFile(file);
      let workbook = xlsx.read(data, { type: "binary" }),
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = xlsx.utils.sheet_to_json(worksheet);

      //数据转换，调用异步
      let arr = [];
      data.forEach((item) => {
        let obj = {};
        for (let key in character) {
          if (!character.hasOwnProperty(key)) break;
          let v = character[key],
            text = v.text,
            type = v.type;
          v = item[text] || "";
          type === "string" ? (v = String(v)) : null;
          type === "number" ? (v = Number(v)) : null;
          obj[key] = v;
        }
        arr.push(obj);
      });
      arr.forEach((item) => {
        item.sex === "男" ? (item.sex_text = "男") : (item.sex_text = "女");
      });

      await delay(100);
      this.workerLists = [...arr, ...this.workerLists];
      this.addWorkerLists = arr;
      this.loading = false;
      this.listShwo = true;
      this.$message.success("导入成功，确认后请将数据提交至服务器");
      console.log(this.workerLists);
    },
    // 提交新增人员数据
    sendWorkerList() {
      this.$confirm("确认上传新增人员名单吗?").then(() => {
        addWorkerLists(this.addWorkerLists).then((res) => {
          if (res.data.status === 200) {
            this.$message({
              type: "success",
              message: "数据提交成功!",
            });
            this.addWorkerLists = [];
          }
        });
      });
    },
    // 导出人员数据
    loadingWorkerList(){
      if(!this.checkedId.length){
        this.$message.warning("请选择要导出的人员名单!");
        return
      }

      let arr = this.checkedId.map(item => {
        return {
          姓名: item.name,
          联系方式: item.phone,
          邮箱: item.email,
          身份证: item.cardId,
          性别: item.sex_text,
        };
      });

      let sheet = xlsx.utils.json_to_sheet(arr),
        book = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(book, sheet, "sheet1");
      xlsx.writeFile(book, `user${new Date().getTime()}.xls`);

      this.checkedId = [];
      
    },
    // 请求人员数据//
    getProjectData(val) {
      this.end = false;
      this.loading = true;
      this.listShwo = false;
      getWorkerLists(val).then((res) => {
        this.loading = false;
        if (res.data.data.length === 0) {
          this.end = true;
          return;
        }
        this.workerLists = res.data.data;
        this.listShwo = true;
        this.workerLists.forEach((item) => {
          // 不要修改原数据
          item.sex === "0" ? (item.sex_text = "男") : (item.sex_text = "女");
        });
      });
    },
    // 删除人员数据//
    delItem(val) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", { type: "warning" })
        .then(() => {
          delWorkerLists(val).then((res) => {
            this.checkedId = [];
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              if (res.data.data.length === 0) {
                this.end = true;
              }
              this.workerLists = res.data.data;
              this.workerLists.forEach((item) => {
                // 不要修改原数据
                item.sex === "0"
                  ? (item.sex_text = "男")
                  : (item.sex_text = "女");
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
    // 提交按钮,新增和修改人员数据//
    onSubmit() {
      // 信息校验
      const { name, sex, email, phone, cardId } = this.form;
      if (
        name !== "" &&
        sex !== "" &&
        email !== "" &&
        phone !== "" &&
        cardId !== ""
      ) {
        // 判断是新增还是修改
        if (this.state) {
          this.$confirm("确认上传项目信息吗?").then(() => {
            addWorkerLists(this.form).then((res) => {
              if (res.data.status === 200) {
                this.isShow = false;
                this.$message({
                  type: "success",
                  message: "新增成功!",
                });
                this.getProjectData();
              }
            });
          });
        } else {
          this.$confirm("确认修改项目信息吗?").then(() => {
            changeWorkerLists(this.form).then((res) => {
              if (res.data.status === 200) {
                this.isShow = false;
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.workerLists = res.data.data;
                this.workerLists.forEach((item) => {
                  // 不要修改原数据
                  item.sex === "0"
                    ? (item.sex_text = "男")
                    : (item.sex_text = "女");
                });
              }
            });
          });
        }
      } else {
        this.$message.error("项目信息不完整，请完善后提交");
      }
    },

    // input搜索//
    searchDate(event) {
      this.getProjectData(this.keyword);
      // 没有搜索记录，把搜索值push进数组首位，存入本地
      if (!this.historyList.includes(this.keyword)) {
        // 记录长度不大于8
        if (this.historyList.length >= 8) {
          this.historyList.pop();
        }
        this.historyList.unshift(this.keyword);
        setHistoryAllList(
          "historyAllListKey",
          JSON.stringify(this.historyList)
        );
      } else {
        //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
        let i = this.historyList.indexOf(this.keyword);
        this.historyList.splice(i, 1);
        this.historyList.unshift(this.keyword);
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
      this.keyword = "";
      this.keyword = item;
      this.searchDate();
    },
    // input重置//
    resetInput() {
      this.keyword = "";
      this.getProjectData();
    },

    //管理员权限 methods
    // 新增按钮//
    addProject() {
      this.isShow = true;
      // 标题为新增
      this.state = true;
    },
    // 编辑按钮//
    changeItem(row) {
      this.state = false;
      this.form = { ...row };
      this.isShow = true;
    },
    // 删除已选项目//
    delChecklists() {
     if(!this.checkedId.length){
      this.$message.warning("请选择要删除的项目");
      return;
     }else{
       let arr = []
       this.checkedId.forEach(item => {
          arr.push(item.id);
        });
       this.delItem(arr)
     } 
    },
    // 取消按钮//
    offSubmit() {
      this.isShow = false;
    },
    // 搜索项目文字高亮//
    highlight(text) {
      const highlightStr = `<span style="color:#ff5134">${this.keyword}</span>`;
      const reg = new RegExp(this.keyword, "gi");
      return text.replace(reg, highlightStr);
    },
  },
  watch: {
    // 关闭时清空form数据
    isShow(newValue) {
      if (!newValue) {
        this.form = {
          name: "",
          cardId: "",
          email: "",
          phone: "",
          sex: "",
        };
      }
    },
    // 导入、提交按钮
    addWorkerLists(newValue) {
      if (!this.addWorkerLists.length) {
        this.sendData = false;
        this.upload = true;
      }else{
        this.sendData = true;
        this.upload = false;
      };
    },
  },
  computed: {
    // 全选框//
    checkAll: {
      // 已选数据等于数据全部，且不为 0
      get() {
        return (
          this.checkedId.length === this.workerLists.length && this.checkedId.length
        );
      },
      // value为checkbox点击的状态
      set(value) {
        if (value) {
          this.checkedId = [];
          this.checkedId = this.workerLists;
        } else {
          this.checkedId = [];
        }
      },
    },
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
.workerList {
  overflow: hidden;
  .lists {
    width: 1286px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    margin: 0 auto;
    padding: 30px 0 30px 0;
    border: 1px rgb(230, 230, 230) solid;
    margin-bottom: 20px;
    transition: all 1s;
    margin-top: 30px;
    .graphics {
      .icon {
        color: #006bf7;
        padding: 28px;
        font-size: 28px;
        border-radius: 8px;
        background-color: rgba(0, 107, 247, 0.1);
        margin: 0 30px 0 40px;
      }
      span {
        font-size: 24px;
        font-weight: 600;
      }
    }
    .btn {
      display: flex;
      margin-right: 42px;
      .loadingWorkerList {
        margin-left: 10px;
      }
    }
  }
  .workerLists::-webkit-scrollbar {
    height: 0;
    width: 0;
    color: transparent;
  }
  .inputMenu {
    width: 1286px;
    position: relative;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
    margin: 0 auto;
    padding: 25px 0 25px 0;
    border: 1px rgb(230, 230, 230) solid;
    transition: all 1s;
    margin-bottom: 20px;
    .search {
      display: flex;
      .searchWord {
        width: 100px;
        span {
          margin-right: 20px;
          color: rgb(116, 116, 116);
          font-size: 14px;
        }
      }
      .searchInput {
        margin-left: 12px;
        position: relative;
        display: flex;
        .outerbox {
          height: 26px;
          border: 1px solid #dbdfe6;
          border-radius: 4px;
          z-index: 2;
          .el-input {
            width: 280px;
          }
          /deep/.el-input__inner {
            background-color: transparent !important;
            border: 0;
          }
          .searchIcon {
            border-radius: 4px;
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
          z-index: 1;
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
    .handelLists {
      display: flex;
      height: 28px;
      position: absolute;
      // margin-right: 42px;
      left: 940px;
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
  }
  .inputFixed {
    position: relative;
    .workerLists {
      overflow: auto;
      transition: all 1s;
      height: 580px;
      width: 1286px;
      margin: 0 auto;
      border-radius: 6px;
      border: 1px rgb(230, 230, 230) solid;
      padding: 20px 0 20px 0;
      margin-bottom: 10px;
      .info {
        display: flex;
        align-items: center;
        width: 1260px;
        height: 70px;
        border: 1px rgb(230, 230, 230) solid;
        border-radius: 6px;
        margin: 0 auto;
        margin-bottom: 16px;
        .delCheckItem {
          margin: 0 24px;
        }
        .workerImg {
          margin-right: 50px;
          padding: 10px;
          background-color: #6b50d9;
          border-radius: 50%;
          color: #fff;
        }
        .workerId,
        .email,
        .cardId,
        .timer {
          width: 340px;
        }
        .name,
        .sex {
          width: 150px;
          //   background-color: #ff6263;
        }
        .phone {
          width: 250px;
          //   background-color: #8f1b1b;
        }
        .workerTitle {
          display: block;
          font-size: 12px;
          color: rgb(167, 167, 167);
          line-height: 26px;
        }
        .workerTitleInfo {
          line-height: 26px;
          font-size: 14px;
          color: rgb(53, 53, 53);
        }
        .deleteBtn {
          margin-right: 30px;
        }
      }
    }
  }
  .el-footer {
    min-width: 1280px;
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 0;
  }
  .loading {
    line-height: 50px;
    margin-left: 50%;
    margin-bottom: 10px;
    position: relative;
    right: 50px;
    span {
      color: rgb(116, 116, 116);
      margin-left: 8px;
      font-size: 16px;
      text-align: center;
    }
    a {
      color: rgb(116, 116, 116);
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
    a {
      color: rgb(116, 116, 116);
    }
    span {
      color: rgb(116, 116, 116);
      margin-left: 8px;
      font-size: 16px;
      text-align: center;
    }
  }
  .lists:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
  .inputMenu:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
  .workerLists:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
}
  /deep/ .el-dialog {
    width: 600px;
    height: 500px;
  position: relative;
  border-radius: 10px;
}
.dialog-footer {
  position: absolute;
  bottom: 30px;
  right: 50px;
}
</style>