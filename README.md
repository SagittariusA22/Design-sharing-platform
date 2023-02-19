## 柏涛设计知识管理系统

### 一、技术栈

- Vue2
- Vue-router
- Vuex
- Axios
- Mockjs
- Js-cooike
- Echarts
- Element-ui

### 二、技术思路

#### 登录及权限

- **效果**：只有指定的用户账号才可以登录；账号不同，登录以后权限不同；管理员可进行项目资料及人员权限的管理

- **解决思路：**

  1.利用mockjs拦截登录请求，并对不同登录账号进行校验，以此判断是否有权登录，及对不同的账号返回不同的路由，并且返回token

  2.将token存到 localStorage，封装axios，请求拦截及响应拦截

  3.全局路由守卫，访问不存在的路径跳转404页，

#### 动态路由

- 解决思路：

  1.拿到mockjs返回的路由，利用vuex，存到state中，为防止页面刷新丢失数据，一并在cookie中存一份

  2.将state中的路由添加到router中，另外menu菜单列表的渲染也拿此数据

#### 项目信息的增删改查

- 解决思路：

  1.封装api，所有数据利用mockjs返回拿到，

  2.查找数据较为麻烦，get请求，Mock中先需要获取url中的query参数，再将数据与query参数进行匹配，最后将符合要求的数据全部返回（总感觉这个有点麻烦，不知道是否有更好的方法）

  3.前端分页与后端分页

​      



下面的不用看，是平时的一点笔记

----------------------------------------------------------------->

1.按需引入太大 `element-ui ` 单独到  plugins 文件中的  element-ui.js 文件下，

2.面包屑

- 直接利用 ` this.$route.matched`  中的 `meta` 对象，遍历得到面包屑所需的 title ，同时还可以拿到 path 来提供路由的跳转

- 面包屑字体颜色的设置

  ```vue
  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      font-weight: normal;
      color: rgb(185, 185, 185);
      /* &.is-link {
        color: rgb(248, 0, 0);
      }
    }
    &:last-child {
      .el-breadcrumb__inner {
        color: #fff;
      }
    }
  }
  ```



3.复点击同一个路由会报错

```js
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
```



4.路由

- 懒加载

```js
 component: () => import("@/views/Main"),
```

- 父级路由不要给 name，给 path

5. element-ui 的 message，main.js中 *单独引入*

   ```js
   import { Message } from 'element-ui';
   Vue.prototype.$message = Message;
   ```

6. 登录 验证规则的封装 validate

7. getToken 的封装

8. axios的封装,请求拦截-加token，响应拦截

9. api接口封装

10. 404页设计,路由放入动态路由的最后

11. mockjs 拦截请求，传回token，存localStorage，避免刷新页面被清空，存vuex中也会被清空，或者存cookie中

12. 动态添加路由，mockjs拦截，根据用户名返回不同路由，给路由添加component的路径，遍历，添加到路由中

    ```js
    menuConvert.forEach(item => {
        router.addRoute(item)
    }) 
    ```

    

13. *刷新后空白页，因为vuex中的动态路由被清空，在构造前加载一次动态路由*

    ```js
      created(){
      console.log(store);
      store.commit('menuRouter/addMenu', router)//开启了命名空间
     }
    ```


14.form表单二次封装
     input，textselect、datePicker、switch、checkbox、radio、textarea、uploading的封装；
     uploading使用与否需要指定，其中文件缩略图数据的清空的方法需要在父组件调用，使用全局事件总线
     其他的根据传入的数据动态生成，

15.按钮权限，
通过`vuex`定义一个`buttomPermission`权限状态对象，然后再创建一个`permissions`指令，通过对每个`buttom`按钮使用`permissions`指令，并且绑定该按钮特定意义的值。然后在`permission.js`文件中，获取当前`value`值，从`buttomPermission`中得到当前按钮是否有权限，没有则直接删除掉当前按钮节点。



