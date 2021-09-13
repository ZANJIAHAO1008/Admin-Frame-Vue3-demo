<template>
  <el-drawer
      :before-close="close"
      :model-value="baseVisible"
      title="基本信息"
      size="800px"
      @open="getInit"
  >
    <el-form ref="baseInfoRef" :model="baseInfo" :rules="baseInfoRules" label-width="114px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="姓名：">
            <el-input v-model="baseInfo.staffName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="baseInfo.username"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="性别：">
            <el-select v-model="baseInfo.sex" placeholder="请选择性别">
              <el-option label="女" value="0"></el-option>
              <el-option label="男" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="手机号码：">
            <el-input v-model="baseInfo.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="出生日期：">
            <el-date-picker
                v-model="baseInfo.birthDate"
                placeholder="选择日期"
                type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="$store.state.user.user.username === 'admin'">
        <el-col :span="10">
          <el-form-item label="账号状态：">
            <el-select v-model="baseInfo.userState" placeholder="请选择">
              <el-option label="正常" value="0"></el-option>
              <el-option label="冻结" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="权限分配：" prop="jurisdiction">
            <el-select v-model="baseInfo.jurisdiction" multiple placeholder="请选择">
              <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.marks"
                  :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="家庭住址：">
            <el-input
                v-model="baseInfo.address">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="个人说明：">
            <el-input
                v-model="baseInfo.marks"
                :autosize="{ minRows: 4, maxRows: 6}"
                type="textarea">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <div class="baseInfo_footer">
            <el-form-item>
              <el-button size="medium" @click="close">取消</el-button>
              <el-button  size="medium"  type="primary" @click="relation">确定</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script>
import {defineComponent, reactive, ref, toRefs} from 'vue';
import {getRole, roleRelation, getUserRole} from "../../api/role";
import {modifyBaseInfo} from "../../api/user";
import {useStore} from "vuex";
import {ElMessage} from 'element-plus'
import {useRouter} from "vue-router";
import Cookies from "js-cookie";

export default defineComponent({
  name: 'baseInfo',
  props: {
    baseVisible: Boolean
  },
  emits: ['baseVisible', 'refresh'],
  setup(props, context) {
    const store = useStore(); //vuex
    const router = useRouter(); //路由
    const baseInfoRef = ref(null);  //基本信息ref
    const state = reactive({
      baseInfo: {
        username: "",
        sex: "",
        staffName: "",
        phone: "",
        marks: "",
        birthDate: "",
        address: "",
        userState: "",
        jurisdiction: "",
        image: ""
      },
      baseInfoRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        jurisdiction: [
          {required: true, message: '请至少选择一个角色', trigger: 'change'}
        ],
      },
      roleList: [] //角色列表
    })

    const close = () => {
      context.emit('update:baseVisible', false);
    };

    const getInit = () => {

      //查询角色
      getRole().then(res => {
        //查询角色列表
        state.roleList = res?.data || [];
      });

      getUserRole({
        staffId: state.baseInfo.staffId
      }).then(res => {
        //查询已经关联角色
        if (res.data) {
          state.baseInfo.jurisdiction = res.data.map(v => v.roleId);
        }
      })
    };

    const openBaseInfo = (row) => {
      context.emit('update:baseVisible', true);
      state.baseInfo = Object.assign({...row}, {});
    };

    const saveBaseInfo = () => {
      //保存用户信息
      if (state.baseInfo.resourceList) { //如果有资源列表  传参时 删除资源列表
        delete state.baseInfo.resourceList;
      }
      modifyBaseInfo(state.baseInfo).then(res => {
        if (state.baseInfo.staffId == store.state.user.user.staffId) {
          //检测是否修改登陆账号信息
          ElMessage.warning({
            message: '检测到您修改了本账号的信息，3秒后回到登陆页',
            type: 'warning'
          });
          setTimeout(() => {
            router.push({path: '/login'});
            context.emit('reFresh', false);
            Cookies.remove("token");
          }, 3000)
        } else {
          context.emit('reFresh', true);
        }
        close();
      })
    }

    const relation = () => {
      //用户关联角色
      let dataWare = {
        staffId: state.baseInfo.staffId,
        list: [...state.baseInfo.jurisdiction]
      };
      baseInfoRef.value.validate(prop => {
        if (prop) {
          roleRelation(dataWare).then(res => {
            //成功了再保存
            saveBaseInfo();
          });
        }
      })
    }

    return {
      ...toRefs(state),
      close,
      getInit,
      saveBaseInfo,
      openBaseInfo,
      relation,
      baseInfoRef
    }
  },
});
</script>
<style lang="scss" scoped>
.baseInfo_footer {
  text-align: right;

}
</style>
