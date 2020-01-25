<template>
  <div id="overlay">
    <div id="content">
      <p>変更内容を入力してください！</p>
      <input
                type="text"
                v-model="text"/>
      <button v-on:click ="$emit('edit-confirm', text)" class="btn-primary">保存</button>
      <button v-on:click="$emit('edit-cancel')" class="btn-secondary ml-1">キャンセル</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "EditModal",
    props:{
      parent_text: String
    },
    data() {
      return {
        text: ''
      }
    },
    mounted(){
      this.text = this.parent_text
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