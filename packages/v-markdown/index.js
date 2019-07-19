
// 导入组件，组件必须声明 name
import VMarkdown from './src/main.vue'

// 为组件添加 install 方法，用于按需引入
VMarkdown.install = function (Vue) {
    Vue.component(VMarkdown.name, VMarkdown)
}

export default VMarkdown