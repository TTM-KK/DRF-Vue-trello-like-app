<template>
  <div id="overlay">
    <div id="content">
      <p>本当に削除しますか？</p>
      <button class="btn-danger" v-on:click="deleteEvent">削除</button>
      <button class="btn-secondary ml-1" v-on:click="cancelEvent">キャンセル</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "deleteModal",

    methods: {
      // perform delete
      deleteEvent: function () {
        this.$emit('from-child')
      },
      // perform cancel
      cancelEvent: function () {
        this.$emit('delete-cancel')
      }
    }
  }

</script>

<style scoped>
  #overlay {
    z-index: 5;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  #content{
  z-index:6;
  width:50%;
  padding: 1em;
  background:#fff;
}

</style>