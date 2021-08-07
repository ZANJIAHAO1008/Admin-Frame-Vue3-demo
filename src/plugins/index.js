import {createApp} from 'vue'

export function loadAllPlugins(app) {
    // 获取当前目录下所哟.ts文件
    const files = require.context('.', true, /\.js$/)
    // 遍历，过滤并加载插件
    files.keys().forEach(key => {
        if (typeof files(key).default === 'function') {
            if (key !== './index.js') files(key).default(app)
        }
    })
}
