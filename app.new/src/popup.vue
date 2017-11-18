<template>
  <div class="popup" v-show="ifShowPopup">{{ message }}</div>
</template>

<script>
  export default {
    props: {
      ifShowPopup: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style></style>
