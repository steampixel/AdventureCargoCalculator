import Vue from 'vue'
import draggable from 'vuedraggable'

const plugin = {

  install(Vue, options) {

    Vue.component('draggable', draggable)

  }

};

Vue.use(plugin);

export default plugin;
