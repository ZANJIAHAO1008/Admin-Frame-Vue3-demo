<template>
  <div>
    <div class="zan-nav">
      <el-form label-position="right" label-width="84px" :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item  label="用户姓名：" >
          <el-input
              clearable
              @keyup.enter="getInfo"
              v-model.trim="queryParams.staffName"
              placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户工号：">
          <el-input
              clearable
              @keyup.enter="getInfo"
              v-model.trim="queryParams.staffId"
              placeholder="请输入工号/ID"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  icon="el-icon-search" @click="getInfo">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="zan-table">
      <el-table
          :data="userList"
          height="calc(100vh - 320px)"
          style="width: 100%">
        <el-table-column
            prop="staffName"
            label="用户姓名"
        >
        </el-table-column>
        <el-table-column
            prop="staffId"
            label="用户ID"
        >
        </el-table-column>
        <el-table-column
            prop="username"
            label="账号名称"
        >
        </el-table-column>
        <el-table-column
            prop="sex"
            label="性别">
          <template  #default="scope">{{$filters.Gender(scope.row.sex)}}</template>
        </el-table-column>
        <el-table-column
            prop="phone"
            label="手机号码">
        </el-table-column>
        <el-table-column
            prop="address"
            label="用户住址">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="注册时间">
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
           >
          <template #default="scope">
            <el-button   type="text">授权</el-button>
            <el-button  type="text" style="color: red;"
                       @click="deleteUser(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <component :is="components.pagination" class="zan-pagination" @change="getInfo"></component>
<!--      <Pagination/>-->
    </div>
  </div>
</template>
<script>
import {defineComponent, reactive, toRefs, onMounted,shallowRef,provide} from "vue";
import {getAll, delUser} from "../../api/user";
import {ElMessageBox} from 'element-plus';
import Pagination from "../../components/Pagination/index.vue";
export default defineComponent({
  name:"userList",
  components:{
    Pagination
  },
  setup() {
    const state = reactive({
      userList: [], //存储用户信息
      queryParams: {
        staffName: "",
        staffId: "",
      },
      pagination:{
        total:1,
        page:1
      }
    });

    provide("pagination", state.pagination); //父子传参

    const components = shallowRef({ //子组件注册
      pagination:Pagination
    })

    const getInfo = (val) => {  //查询
      let dataWare = {
        ...state.queryParams,
        pageSize:val&&val.pageSize || 10,
        page:val&&val.page || 1
      };
      getAll(dataWare).then((res) => {
        state.userList = res?.data?.list || []; //表格数据
        state.pagination.total =  res?.data?.total || 1; //总条数
        state.pagination.page =  res?.data?.page || 1; //当前页
      });
    };


    const deleteUser = (row)=>{  //删除用户
      ElMessageBox.confirm('此操作将注销该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        delUser({
          id:row.id
        }).then(() => {
          getInfo();
        });

        }).catch(() => {

        });
    }

    onMounted(() => {
      getInfo();
    });

    return {
      ...toRefs(state),
      components,
      getInfo,
      deleteUser
    };
  },
});
</script>
