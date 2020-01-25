<template>
  <div>
    <!--Display a modal window at delete and recheck-->
    <delete-modal
            v-if="show_delete_modal"
            v-on:from-child="deleteBoard"
            v-on:delete-cancel="show_delete_modal=false"
    ></delete-modal>
    <edit-modal
            v-if="show_edit_modal"
            v-on:edit-confirm="updateBoard({new_name: $event})"
            v-on:edit-cancel="show_edit_modal=false"
            v-bind:parent_text="before_name"
    ></edit-modal>

    <!--<button class="edit-button" v-on:click="$emit('update-board')">-->
    <button class="edit-button" v-on:click="getText({name: name})">
      <edit-icon></edit-icon>
    </button>
    <button class="delete-button" v-on:click="show_delete_modal=true">
      <delete-icon></delete-icon>
    </button>
    <router-link
            class="router"
            :to="{ name: 'board', params: { name, id } }">
      <div class="row">
        <div class="col-md-1 handle">
          <move-icon class="move-icon"></move-icon>
        </div>
        <div class="col-md-11 board-card">
          <span class="">❏ {{ name }}</span>
        </div>
      </div>
    </router-link>

  </div>
</template>

<script>
  import EditIcon from 'vue-material-design-icons/SquareEditOutline'
  import DeleteIcon from 'vue-material-design-icons/TrashCanOutline'
  import MoveIcon from 'vue-material-design-icons/CursorMove'
  import {createNamespacedHelpers} from 'vuex';

  import DeleteModal from '@/components/modals/DeleteModal'
  import EditModal from '@/components/modals/EditModal'

  const {mapActions} = createNamespacedHelpers('trello')


  export default {
    name: "BoardCard",
    components: {
      EditIcon,
      DeleteIcon,
      MoveIcon,
      DeleteModal,
      EditModal
    },
    props: {
      id: String,
      name: String
    },
    data() {
      return {
        edit_id: '',
        before_name: '',
        new_name: '',

        // for delete modal
        show_delete_modal: false,
        // for edit modal
        show_edit_modal: false
      }
    },

    methods: {
      ...mapActions([
            'updateBoardAction',
            'deleteBoardAction'
          ]
      ),
      // get and save text info
      getText({name}) {
        this.before_name = name
        this.new_name = name
        this.edit_id = this.id

        this.show_edit_modal = true
      },
      updateBoard({new_name}) {
        //  Requests are not sent unless there is a change.
        if (this.before_name !== new_name) {
          this.updateBoardAction({new_name: new_name, id: this.id})
        }
        this.edit_id = ''
        this.before_name = ''
        this.show_edit_modal = false
      },
      deleteBoard() {
        this.show_delete_modal = false
        this.deleteBoardAction({id: this.id})
      }
    }

  }
</script>

<style scoped>
  .handle {
    align-items: center;
    background-color: #CCCCCC;
    border-radius: 5px;
    text-decoration: none;
    align-self: center;
    padding-top: 32px;
    padding-bottom: 32px;
  }
  .router{
    text-decoration: none;
  }

  .move-icon {
    color: #ffffff;
  }

  .edit-button {
    position: absolute;
    right: -32px;
    top: 0px;
    text-align: center;
  }

  .delete-button {
    position: absolute;
    right: -32px;
    top: 31px;
    text-align: center;
  }

  .board-card {
    background-color: #546E7A;
    box-sizing: border-box;
    border-radius: 5px;
    color: #fafafa;
    padding: 2rem;
    text-decoration: none;
    text-align: left;
    /*transition: all 600ms ease;*/
  }
</style>