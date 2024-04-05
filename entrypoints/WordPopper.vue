<script setup lang="ts">
defineOptions({ name: 'WordPopper' })
</script>

<template>
  <div class="webui-popover translate-content">
    <div class="webui-arrow" />
    <div class="webui-popover-inner">
      <a href="#" class="close" />
      <h3 class="webui-popover-title" />
      <div class="webui-popover-content" style="min-width: 360px;">
        <i class="icon-refresh" /> <p>&nbsp;</p>
      </div>
    </div>
  </div>
</template>
