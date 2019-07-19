
// 导入单个组件
import VMarkdown from './v-markdown/index'

// 以数组的结构保存组件，便于遍历
const components = [
    VMarkdown
]

// 定义 install 方法
const install = function (Vue) {
    if (install.installed) return
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    // 导出的对象必须具备一个 install 方法
    install,
    // 组件
    VMarkdown
}