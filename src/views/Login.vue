<template>
  <div class="login-container">
    <div class="login-body">
      <div class="l-title">ZAN-ADMIN</div>
      <div v-show="loginStatus">
        <el-form   @submit.native.prevent   hide-required-asterisk ref="loginRef" :model="param" :rules="loginRules">
          <el-form-item  prop="username">
            <el-input clearable prefix-icon="fa fa-user-o"   v-model.trim="param.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input clearable prefix-icon="fa fa-lock"   @keyup.enter="submitForm" placeholder="请输入密码" v-model.trim="param.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  style="width: 100% " :loading="loading" @click="submitForm()">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="other-content">
          <el-button type="text" disabled>其它登录方式</el-button>
          <el-button type="text" @click="loginStatus = false;">注册账户</el-button>
        </div>
      </div>
      <div v-show="!loginStatus">
        <el-form   @submit.native.prevent   hide-required-asterisk ref="registerRef" :model="register" :rules="registerRules">
          <el-form-item  prop="username">
            <el-input clearable prefix-icon="fa fa-user-o"   v-model.trim="register.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input clearable prefix-icon="fa fa-lock" autocomplete="off"   placeholder="至少6位密码" v-model.trim="register.password" ></el-input>
          </el-form-item>
          <el-form-item  prop="checkPass">
            <el-input clearable prefix-icon="fa fa-lock" type="password"   placeholder="再次输入密码" v-model.trim="register.checkPass" ></el-input>
          </el-form-item>
          <el-form-item  prop="staffName">
            <el-input clearable prefix-icon="fa fa-user-o"   v-model.trim="register.staffName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="register.sex">
              <el-radio label="0" >男</el-radio>
              <el-radio label="1" >女</el-radio>
            </el-radio-group>
          </el-form-item>
<!--          <el-form-item  prop="phone">-->
<!--            <el-input clearable prefix-icon="fa fa-user-o"   v-model.trim="register.phone" placeholder="请输入手机号"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item  prop="address">-->
<!--            <el-input clearable prefix-icon="fa fa-user-o"   v-model.trim="register.address" placeholder="请输入家庭地址"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary"  style="width: 100% "  @click="registerForm()">注册</el-button>
          </el-form-item>
        </el-form>
        <div class="other-content">
          <el-button type="text" @click="loginStatus = true;" style="width: 100% " >使用已有账号登陆</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {defineComponent, getCurrentInstance, toRefs, reactive, ref} from 'vue'
import { useRouter} from 'vue-router'
import { login,register } from '../api/user.js'
import Cookies from "js-cookie";
export default defineComponent({
  setup() {
    let {proxy} = getCurrentInstance(); // vue原型
    const loginRef = ref(null);  //登录ref
    const registerRef = ref(null);  //注册ref
    const router = useRouter(); //路由

    const validatePass = (rule, value, callback) => { //密码验证
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (state.register.checkPass !== '') {
          registerRef.value.validateField('checkPass');
        }
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {  //重复密码验证
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== state.register.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    const state = reactive({
      param: {
        username: "",
        password: ""
      }, //登录账号
      loginStatus:true,//登陆or注册 true  false
      register:{
        username:"",
        password:"",
        checkPass:"",
        sex:'0',
        staffName:"",
      },
      loginRules: { //登陆验证
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"}
        ]
      },
      registerRules:{  //注册验证
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateCheckPass, trigger: 'blur' }
        ],
      },
      loading: false //缓冲
    })


    const submitForm = () => {
      loginRef.value.validate(valid => {
        if (valid) {
          state.loading = true;
            login(
                {
                  ...state.param
                }
            ).then(res=>{
              if(res.data){
                Cookies.set("token",res.data);
                router.push({path: '/homePage'})
              }
              state.loading = false;
            })
        }
      });
    }

    const registerForm = () => {
      registerRef.value.validate(valid => {
        if (valid) {
          register({
            ...state.register
          }).then(()=>{

          })
        }
      });
    }

    return {
      ...toRefs(state),
      loginRef,
      registerRef,
      submitForm,
      registerForm
    }
  }
})
</script>
<style lang="less" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: 100%;
  background-image: url(../assets/image/background.jpg);

  .login-body {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    background: #ffffff;
    overflow: hidden;
    padding:  30px 26px 24px 26px;
    box-sizing: border-box;
    margin-left: -198px;
    margin-top: -230px;
    opacity: 0.85;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    .l-title {
      padding: 8px 0 24px 0;
      font-size: 20px;
      color: #121212;
      font-weight: 550;
      text-align: center;
    }
  }
  .other-content{
    display:flex;
    justify-content: space-between;
  }
}
</style>
