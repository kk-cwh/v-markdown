<template>
  <div class="v-editor" :style="{width,height,fontSize}">
    <div class="editor-flex">
      <div class="editor-content">
        <textarea class="markdown-area" :style="{fontSize}" v-model="mdString" />
      </div>
      <div
        class="editor-preview"
        v-html="htmlString"
        ref="editor_preview_box"
      ></div>
    </div>
  </div>
</template>

<script>
import emojione from "emojione";
import marked from "marked";
// import "highlight.js/styles/github.css";
import hljs from "highlight.js";
export default {
  name: 'VMarkdown',
    props: {
    mdText: {
      type: String,
      default: ""
    },
    width:{
        type:String,
        default:'100%'
    },
    height:{
        type:String,
        default:'800px'
    },
    fontSize:{
         type:String,
         default:'14px'
    },
    themeUrl: {
      type: String,
      default:
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/atom-one-dark.min.css"
    },
    options: {
      type: Object,
      default: () => {
        return {
          renderer: new marked.Renderer(),
          gfm: true,
          tables: true,
          breaks: true,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false
        };
      }
    }
  },
  data() {
    return {
      mdString: "",
      htmlString: ""
    };
  },
  watch: {
    themeUrl(value) {
      this.addOrUpdateCssLink(value);
    },
    mdString(value) {
      this.$emit("md-change", value);
      marked.setOptions(this.options);
    
      this.htmlString = emojione.toImage(marked(value));
      this.$emit("html-change", this.htmlString);
      this.$nextTick().then(() => {
        document.querySelectorAll(".editor-preview pre code").forEach(block => {
          hljs.highlightBlock(block);
        });
        this.$emit("html-hljs-change", this.$refs.editor_preview_box.innerHTML);
      });
    }
  },
  mounted() {
    this.mdString = this.mdText;
    this.addOrUpdateCssLink(this.themeUrl);
  },
  methods: {
    addOrUpdateCssLink(value) {
      var link = document.getElementById("highlight_style");
      if (link) {
        link.href = value;
      } else {
        link = document.createElement("link");
        link.href = value;
        link.id = "highlight_style";
        link.rel = "stylesheet";
        document.head.append(link);
      }
    }
  }
}
</script>

<style scoped lang="less">
.v-editor {
  margin: 10px auto;
  .editor-flex {
    width: 100%;
    height: 100%;
    text-align: left;
    display: flex;
    .editor-content {
      flex: 1;
      background-color: #f8f8f9;
      border: 1px solid #dcdee2;
      .markdown-area {
        width: 100%;
        height: 100%;
        padding: 15px;
        overflow: auto;
        box-sizing: border-box;
        resize: none;
        outline: none;
        border: none;
        background-color: transparent;
        color: #17233d;
        line-height: 1.6em;
      }
    }
    .editor-preview {
      flex: 1;
      border: 1px solid #dcdee2;
      padding: 15px;
      overflow: auto;
      word-wrap: break-word;
      line-height: 1.6em;
    }
  }
}
</style>

