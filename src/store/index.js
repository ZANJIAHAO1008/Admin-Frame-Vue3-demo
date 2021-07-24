import {createStore} from 'vuex'

export default createStore({
    state: {
        tagsList: [], //tag标签存储
        collapse: false, //侧边栏展开关闭
        user: {} //用户信息
    },
    mutations: {
        setTags(state, data) { //选中在tagsList添加菜单
            state.tagsList.push(data)
        },
        delTags(state, data) { //如果标签到10个再选择就将最初的删除
            state.tagsList.splice(data.index, 1);
        },
        // 侧边栏折叠
        switchCollapse(state, data) {
            state.collapse = data;
        },
        //存储user数据
        SET_USER_INFO(state, data) {
            state.user = data;
        }
    },
    actions: {},
    modules: {}
})
