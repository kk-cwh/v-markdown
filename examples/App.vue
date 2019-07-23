<template>
  <div id="app">
    <img alt="Vue logo"
         src="./assets/logo.png">
    <v-markdown :mdText="mdDefault"
                :theme="theme"
                width="1200px"
                height="800px"
                fontSize="16px"
                @md-change="mdChange"
                @html-change="htmlChange"
                @html-hljs-change="htmlHljsChange" />
  </div>
</template>

<script>


export default {
  name: 'app',
  components: {

  },
  data () {
    return {
      mdDefault: '```\nhello world\n```',
      theme: 'far',
      options:{
         sanitize: false,
         sanitizer:function(value){
           return value;
         }
      }
    }

  },
  methods: {
    mdChange (value) {
      // 获取md文本 
      // console.log(value)
      //```
      //hello world
      //``` 
    },
    htmlChange (value) {
      // 获取 marked处理过后生成的html
      // console.log(value) // <pre><code>hello world</code></pre>
    },
    htmlHljsChange (value) {
      // 获取 highlight.js处理过的html 主要给代码code 添加了 hljs 等css类 ， 如果把 此处的html 保存为html 文件 需要引用 highlight.js相关style文件 才能呈现出效果
      // console.log(value) // <pre><code class="hljs ebnf"><span class="hljs-attribute">hello world</span></code></pre>
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

</style>
