<template>
  <div class="zan-header">
    <div class="collapse-btn" @click="switchCollapse">
      <i v-if="collapse" class="fa fa-indent"></i>
      <i v-else class="fa fa-dedent"></i>
    </div>
    <div class="collapse-right">
      <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
        <i class="fa fa-arrows-alt" @click="requestFullScreen('body')"></i>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="消息中心" placement="bottom">
        <i class="fa fa-bell-o" @click="toGetMessage"></i>
      </el-tooltip>
      <!-- 用户头像 -->
      <div class="user-avatar">
        <img src="../../assets/image/img.jpg"/>
      </div>
      <!-- 用户名下拉菜单 -->
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item divided command="signOut">退出登录</el-dropdown-item>
            <el-dropdown-item command="checkPass" divided>修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <checkPass v-model:passVisible="passVisible"></checkPass>
  </div>
</template>
<script>
import {defineComponent, getCurrentInstance, toRefs, reactive, ref, computed, watch, provide, shallowRef} from 'vue'
import {useStore} from 'vuex';
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'
import checkPass from "../Setting/checkPass.vue";
import Cookies from "js-cookie";
export default defineComponent({
  name: "zan-header",
  components: {
    checkPass
  },
  setup() {
    const store = useStore(); //vuex
    const router = useRouter(); //路由
    const state = reactive({
      collapse: computed(() => store.state.collapse),
      username: computed(() => store.state.user.staffName),
      passVisible: false, //修改密码弹框
    });


    const requestFullScreen = (element) => {  //进入全屏 退出全屏
      const isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement; //判断窗口是否全屏
      let ele = document.querySelector(element) || document.documentElement; //获取元素
      if (!isFullScreen) {
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        }
      } else {
        if (document.exitFullScreen) {
          document.exitFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (element.msExitFullscreen) {
          element.msExitFullscreen();
        }
      }
    }

    const switchCollapse = () => {   //菜单栏展开关闭
      setTimeout(() => {
        store.commit('switchCollapse', !state.collapse)
      }, 0)
    };

    const handleCommand = (command) => {  //用户下拉菜单
      if (command == "signOut") {
        Cookies.remove("token"); //清空token 1秒后回到登录页
        router.push("/login");
        ElMessage.success("登出成功");
      } else if (command == 'checkPass') {
        state.passVisible = true;
      }
    };

    const toGetMessage = () => {  //进入消息中心
      router.push("/messageCenter");
    }

    return {
      ...toRefs(state),
      switchCollapse,
      handleCommand,
      toGetMessage,
      requestFullScreen,
    }
  }
})
</script>
<style lang="less" scoped>
.zan-header {
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #616161;
  background: #FFF;

  .collapse-btn {
    float: left;
    padding: 0px 15px 0 30px;
    cursor: pointer;
    line-height: 70px;
  }


  .el-icon-s-fold, .el-icon-s-unfold {
    font-size: 25px;
    cursor: pointer;
  }

  .collapse-right {
    float: right;
    padding-right: 65px;
    height: 70px;
    display: flex;
    align-items: center;

    i {
      padding-right: 18px;
      cursor: pointer;
    }
  }

  .user-avatar {
    margin: 0 20px 0 5px;
  }

  img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
