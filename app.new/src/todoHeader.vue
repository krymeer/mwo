<template>
  <header>
    <a class="block" href="./">
      <h1>ToDoApp</h1>
    </a>
    <i v-show="materialIcon" class="material-icons" @click="clickIcon">{{ materialIcon }}</i>
  </header>
</template>

<script>
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
          window.location.href = "./logout.php";
        }
      }
    }
  }


</script>

<style></style>