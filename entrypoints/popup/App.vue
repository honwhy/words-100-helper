<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<template>
  <div class="container popup-body">
    <div class="input-group mb-3">
      <input id="searchInput" type="text" class="form-control" tabindex="0" placeholder="请输入要查询的中文或英文">
      <span id="searchButton" class="input-group-text">
        <img src="./assets/images/svgs/search.svg">
      </span>
    </div>
  </div>
  <HelloWorld msg="WXT + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #54bc4ae0);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
