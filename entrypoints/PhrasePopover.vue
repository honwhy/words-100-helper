<script setup lang="ts">
defineOptions({ name: 'PhrasePopper' })
defineProps<Props>()
interface Props {
  data: string
}
</script>

<template>
  <div class="webui-popover translate-content">
    <div class="webui-popover-inner">
      <a href="#" class="close" />
      <!-- <h3 class="webui-popover-title" /> -->
      <div class="webui-popover-content" style="min-width: 360px;">
        <p>{{ data }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url('./webui-popper.scss');
.translate-content {
  min-width: 240px;
}

.title {
  margin-bottom: 0px;
}
</style>
