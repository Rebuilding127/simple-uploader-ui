<template>
  <div class="component">
    <uploader
      ref="uploader"
      class="uploader"
      :options="options"
      :auto-start="autoStartUpload"
      :file-status-text="statusText"
      @file-success="handleUploadFileSuccess"
      @file-complete="handleUploadFileComplete"
      @complete="handleUploadComplete"
    >
      <uploader-unsupport />
      <uploader-drop>
        <p>拖拽文件到此区域上传</p>
        <div class="uploader-actions">
          <uploader-btn>上传文件</uploader-btn>
          <uploader-btn :directory="true">上传文件夹</uploader-btn>
        </div>
      </uploader-drop>
      <uploader-list />
    </uploader>
    <div class="settings">
      <div class="setting-item">
        <label for="setting-chunk-size" class="label">文件块大小</label>
        <input
          v-model="setting.chunkSize"
          id="setting-chunk-size"
          type="number"
          class="value"
        />
        <span class="suffix">MB</span>
      </div>
      <div class="setting-item">
        <label for="setting-simultaneous" class="label">并发数</label>
        <input
          v-model="setting.simultaneous"
          id="setting-simultaneous"
          type="number"
          class="value"
        />
      </div>
      <div class="setting-item">
        <button class="setting-action" @click="handleSubmitSetting">
          应用
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FILE_UPLOAD_URL, merge } from "../api/file";

export default {
  name: "FileUploader",
  props: {
    uploadPath: {
      type: String,
      required: false,
    },
    targetPath: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      options: {
        target: FILE_UPLOAD_URL,
        query: (file, chunk) => {
          console.log("文件上传附带参数：", file, chunk);
          return { path: this.uploadPath };
        },
        chunkSize: 20 * 1024 * 1024,
        forceChunkSize: true,
        simultaneousUploads: 6,
        testChunks: true,
        checkChunkUploadedByResponse: (chunk, result) => {
          console.log("文件块上传校验结果", chunk);
          try {
            const resultObj = JSON.parse(result);
            const uploadedChunkList = resultObj?.data ?? [];
            return uploadedChunkList.includes(chunk.offset + 1);
          } catch (e) {
            return false;
          }
        },
        parseTimeRemaining: (timeRemaining, parsedTimeRemaining) => {
          return parsedTimeRemaining
            .replace(/\syears?/, "年")
            .replace(/\days?/, "天")
            .replace(/\shours?/, "小时")
            .replace(/\sminutes?/, "分钟")
            .replace(/\sseconds?/, "秒");
        },
      },
      autoStartUpload: true,
      statusText: {
        success: "上传完毕",
        error: "出错了！",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中",
      },
      setting: {
        chunkSize: 20,
        simultaneous: 6,
      },
    };
  },
  computed: {},
  mounted() {},
  unmounted() {},
  methods: {
    handleUploadFileSuccess(rootFile, file, result, chunk) {
      console.log("一个文件上传成功，请求合并", rootFile, file, result, chunk);
      merge({ ...file, targetPath: this.targetPath }).then(() => {
        console.log("文件合并完成");
      });
    },
    handleUploadFileComplete(rootFile) {
      console.log("文件（文件夹）上传完毕", rootFile);
    },
    handleUploadComplete() {
      console.log("全部上传完毕");
    },
    handlePauseOrResume() {
      const uploaderInstance = this.$refs.uploader.uploader;
      if (uploaderInstance.isUploading()) {
        uploaderInstance.pause();
      } else {
        uploaderInstance.resume();
      }
    },
    handleSubmitSetting() {
      console.log("应用设置", this.setting);
      const { chunkSize, simultaneous } = this.setting;
      this.options.chunkSize = chunkSize * 1024 * 1024;
      this.options.simultaneousUploads = simultaneous;
    },
  },
  setup() {},
};
</script>

<style scoped>
.component {
  display: flex;
}
.uploader {
  flex-grow: 1;
  text-align: center;
}
.uploader-actions {
  display: inline-flex;
}
.settings {
  display: inline-flex;
  flex-direction: column;
  width: 220px;
  padding: 4px 8px;
}
.settings .setting-item {
  display: inline-flex;
}
.settings .setting-item + .setting-item {
  margin-top: 8px;
}
.settings .label {
  display: inline-block;
  width: 100px;
}
.settings .value {
  /* flex-grow: 1; */
  width: 60px;
  min-width: 30px;
}
.settings .suffix {
  margin-left: 6px;
}
.settings .setting-action {
  width: 100%;
}

@media (prefers-color-scheme: dark) {
  .uploader-drop {
    color: black;
  }
  .uploader-list {
    color: black;
  }
}
</style>
