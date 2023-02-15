<script setup>
import { onMounted, ref } from "vue";
import FileUploader from "../components/FileUploader.vue";
import { test } from "../api/file";

const { VITE_UPLOAD_PATH, VITE_TARGET_PATH } = import.meta.env;

const uploadPath = ref(VITE_UPLOAD_PATH ?? "");
const targetPath = ref(VITE_TARGET_PATH ?? "");

function connectTest() {
  test().then(({ data }) => {
    console.log(data);
  });
}

onMounted(() => {
  connectTest();
});
</script>

<template>
  <div class="view">
    <div class="tools-input">
      <input
        v-model="uploadPath"
        class="input-path"
        placeholder="临时文件保存位置，默认为上传文件夹"
      />
      <input
        v-model="targetPath"
        class="input-path"
        placeholder="文件最终保存位置，默认为上传文件夹"
      />
    </div>
    <FileUploader :upload-path="uploadPath" :target-path="targetPath" />
  </div>
</template>

<style scoped>
.tools-input {
  width: 100%;
  display: flex;
}
.input-path {
  flex-grow: 1;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  text-align: center;
  padding: 5px 10px;
  box-sizing: border-box;
}
</style>
