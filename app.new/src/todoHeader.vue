<template>
  <header>
    <a class="block" href="./">
      <h1>ToDoApp</h1>
    </a>
    <i v-if="materialIcon" class="material-icons" @click="clickIcon">{{ materialIcon }}</i>
  </header>
</template>

<script>
  import EventBus from './eventBus'
  export default {
    props: {
      materialIcon: {
        type: String,
        default: ''
      }
    },
    methods: {
      clickIcon: function() {
        var i_id = this._props.materialIcon;
        if (i_id === 'power_settings_new') {
          EventBus.$emit('user-logout');
        }
      }
    }
  }
</script>

<style></style>