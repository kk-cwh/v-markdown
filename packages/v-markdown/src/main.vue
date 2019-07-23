<template>
  <div class="v-editor"
       :style="{width,height,fontSize}">
    <div class="editor-flex">
      <div class="editor-content">
        <textarea @keydown.tab.exact.prevent="insertTab"
                  @keydown.ctrl.49.prevent="addH(1)"
                  @keydown.ctrl.50.prevent="addH(2)"
                  @keydown.ctrl.51.prevent="addH(3)"
                  @keydown.ctrl.52.prevent="addH(4)"
                  @keydown.ctrl.53.prevent="addH(5)"
                  @keydown.ctrl.76.prevent="addLink"
                  @keydown.ctrl.71.prevent="addImg"
                  @keydown.ctrl.75.prevent="addCode"
                  @keydown.ctrl.66.prevent="addBold"
                  @keydown.ctrl.73.prevent="addItalic"
                  ref="textarea_for_md"
                  class="markdown-area"
                  :style="{fontSize}"
                  v-model="mdString"
                  placeholder="输入..." />
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
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '800px'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    theme: {
      type: String,
      default: "atom-one-dark"
    },
    options: {
      type: Object,
      default: () => {
        return {
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
  data () {
    return {
      mdString: "",
      htmlString: ""
    };
  },
  watch: {
    theme (value) {
      this.addOrUpdateCssLink(value);
    },
    mdString (value) {
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
  mounted () {
    this.mdString = this.mdText;
    this.addOrUpdateCssLink(this.theme);
  },
  methods: {
    addOrUpdateCssLink (value) {
      var themeUrl = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/" + value + ".min.css"

      var link = document.getElementById("highlight_style");
      if (link) {
        link.href = themeUrl;
      } else {
        link = document.createElement("link");
        link.href = themeUrl;
        link.id = "highlight_style";
        link.rel = "stylesheet";
        document.head.append(link);
      }
    },
    insertTab () {
      var start = this.$refs.textarea_for_md.selectionStart;
      var end = this.$refs.textarea_for_md.selectionEnd;
      if (start === end) {
        document.execCommand('insertText', false, "    ");
      } else {
        let strBefore = this.$refs.textarea_for_md.value.slice(0, start);
        let curLineStart = strBefore.includes('\n') ? strBefore.lastIndexOf('\n') + 1 : 0;
        let strBetween = this.$refs.textarea_for_md.value.slice(curLineStart, end + 1);
        let newStr = "  " + strBetween.replace(/\n/g, '\n  ');
        let lineBreakCount = strBetween.split('\n').length;
        let newStart = start + 2;
        let newEnd = end + (lineBreakCount + 1) * 2;

        this.$refs.textarea_for_md.setSelectionRange(curLineStart, end);
        document.execCommand("insertText", false, newStr);
        this.$refs.textarea_for_md.setSelectionRange(newStart, newEnd);
      }

    },
    addH (i) {
      var hstrs = { 1: '#', 2: '##', 3: '###', 4: '####', 5: '#####' }
      var start = this.$refs.textarea_for_md.selectionStart;
      //  var end = this.$refs.textarea_for_md.selectionEnd;
      let strBefore = this.$refs.textarea_for_md.value.slice(0, start);
      let curLineStart = strBefore.includes('\n') ? strBefore.lastIndexOf('\n') + 1 : 0;
      let lineEndIndex = this.$refs.textarea_for_md.value.slice(curLineStart).indexOf('\n')
      let lineStr = lineEndIndex == -1 ? this.$refs.textarea_for_md.value.slice(curLineStart) :
        this.$refs.textarea_for_md.value.slice(curLineStart, lineEndIndex + curLineStart)
      let endIndex = curLineStart;
      if (lineStr.startsWith('# ')) {
        if (i != 1) {
          endIndex = curLineStart + 2
        } else {
          return
        }
      }
      if (lineStr.startsWith('## ')) {
        if (i !== 2) {
          endIndex = curLineStart + 3
        } else {
          return
        }
      }
      if (lineStr.startsWith('### ')) {
        if (i !== 3) {
          endIndex = curLineStart + 4
        } else {
          return
        }
      }
      if (lineStr.startsWith('#### ')) {
        if (i !== 4) {
          endIndex = curLineStart + 5
        } else {
          return
        }
      }
      if (lineStr.startsWith('##### ')) {
        if (i !== 5) {
          endIndex = curLineStart + 6
        } else {
          return
        }
      }

      this.$refs.textarea_for_md.setSelectionRange(curLineStart, endIndex);
      document.execCommand("insertText", false, hstrs[i] + ' ');
    },
    addLink () {
      var start = this.$refs.textarea_for_md.selectionStart;
      //  var end = this.$refs.textarea_for_md.selectionEnd;
      this.$refs.textarea_for_md.setSelectionRange(start, start);
      document.execCommand("insertText", false, '[描述](http://example.com)');
      this.$refs.textarea_for_md.setSelectionRange(start + 3, start + 3);

    },
    addImg () {
      var start = this.$refs.textarea_for_md.selectionStart;
      //  var end = this.$refs.textarea_for_md.selectionEnd;
      this.$refs.textarea_for_md.setSelectionRange(start, start);
      document.execCommand("insertText", false, '![图片描述](http://example.com/demo.png)');
      this.$refs.textarea_for_md.setSelectionRange(start + 6, start + 6);
    },
    addCode () {
      var start = this.$refs.textarea_for_md.selectionStart;
      var end = this.$refs.textarea_for_md.selectionEnd;
      var str = this.$refs.textarea_for_md.value.slice(start, end + 1)
      this.$refs.textarea_for_md.setSelectionRange(start, end);
      document.execCommand("insertText", false, '```\n' + str + '\n```');
      this.$refs.textarea_for_md.setSelectionRange(start + 4, end + 4);
    },
    addBold () {
      var start = this.$refs.textarea_for_md.selectionStart;
      var end = this.$refs.textarea_for_md.selectionEnd;
      var str = this.$refs.textarea_for_md.value.slice(start, end)
      this.$refs.textarea_for_md.setSelectionRange(start, end);
      if (start === end) {
        str = 'strong txt';
        end = end + 12
      } else {
        end = end + 2
      }
      start = start + 2;
      document.execCommand("insertText", false, '**' + str + '**');
      this.$refs.textarea_for_md.setSelectionRange(start, end);
    },
    addItalic () {
      var start = this.$refs.textarea_for_md.selectionStart;
      var end = this.$refs.textarea_for_md.selectionEnd;
      var str = this.$refs.textarea_for_md.value.slice(start, end)
      this.$refs.textarea_for_md.setSelectionRange(start, end);

      if (start === end) {
        str = 'italic txt';
        end = end + 11
      } else {
        end = end + 1
      }
      start = start + 1;
      document.execCommand("insertText", false, '*' + str + '*');
      this.$refs.textarea_for_md.setSelectionRange(start, end);
    },

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

