<template>
  <div class="container has-padding-vertical-2">

    <div class="card has-margin-bottom-2">
      <h1 class="title">🚴 🚣 ⛺ Adventure Cargo Calculator</h1>
      <p>
        Hey! Use this App to calculate the cargo weight for your next adventure outdoor trip! Create and manage several lists with the names and weights of different items.
        Drag and Drop items between your lists and decide what kind of cargo you really need. Enable or disable items and lists to calculate the overall weight.
        Your lists will be kept in your browsers or app storage. Your lists will not be send to servers or other services.
        You can downoad and restore your lists to save them permanently or share them with a different device or person.
        Install this app to your home screen to use it offline.
      </p>
    </div>

    <draggable v-model="lists" group="lists" class="columns is-multiline" handle=".handle-list">

      <div v-for="(list, listIndex) in lists" :key="list.id" class="column is-half-tablet is-one-third-desktop">

        <div :class="'card has-margin-bottom-2 '+(list.enabled ? '':'list-disabled')" :style="'background-color:'+list.color+'dd;'">

          <div class="columns is-mobile">
            <div class="column is-half">
              <Editable class="title" v-model="list.name" />
            </div>
            <div class="column has-text-right">
              <input type="checkbox" v-model="list.enabled">
              <input class="button" type="color" v-model="list.color">
              <span class="button handle handle-list">☰</span>
              <span class="button" @click="removeList(listIndex)">🗑</span>
            </div>
          </div>

          <div class="has-margin-bottom-2">
            <draggable v-model="list.items" group="items" handle=".handle-item">

              <div v-for="(item, itemIndex) in list.items" :key="item.id">
                <div :class="'columns is-mobile '+(item.enabled ? '':'item-disabled')">
                  <div class="column is-one-third">
                    <input type="checkbox" v-model="item.enabled">
                    <span class="button handle handle-item">☰</span>
                    <span class="button" @click="removeItem(listIndex, itemIndex)">🗑</span>
                  </div>
                  <div class="column is-one-third">
                    <Editable class="item-name" v-model="item.name" />
                  </div>
                  <div class="column has-text-right">
                    <input type="number" class="form-control input-weight" v-model="item.weight" /> <strong>{{unit}}</strong>
                  </div>
                </div>
              </div>

            </draggable>
          </div>

          <div class="columns is-mobile">
            <div class="column">
              <button class="button button-primary" @click="addItem(listIndex)">Add item</button>
            </div>
            <div class="column is-half has-text-right">
              Weight: <strong>{{calculateListWeight(listIndex)}} {{unit}}</strong>
            </div>
          </div>

        </div>
      </div>

      <div class="column is-half-tablet is-one-third-desktop">

        <div class="card has-margin-bottom-2">

          <button class="button button-primary" @click="addList()">Add new list</button>

        </div>

      </div>

    </draggable>

    <div class="card has-margin-bottom-2">

      <div class="has-margin-bottom-2">
        Overall weight: <strong>{{calculateWeight()}} {{unit}}</strong>
      </div>

      <div class="has-margin-bottom-2">
        <button class="button button-primary" @click="download">Download your lists</button>
        <span class="upload-btn-wrapper">
          <button class="button">Restore your lists</button>
          <input type="file" @change="restore">
        </span>
      </div>

      <div>
        Background-Image: <a target="_blank" href="https://pixabay.com/de/photos/schuhe-wanderschuhe-wanderstiefel-1638873/">https://pixabay.com/de/photos/schuhe-wanderschuhe-wanderstiefel-1638873/</a><br>
        <!-- https://pixabay.com/de/photos/fahrrad-1149483/
        https://pixabay.com/de/photos/peking-hutong-fahrrad-asien-china-3675892/
        http://xahlee.info/comp/unicode_tech_devices.html-->
        Imprint: <a target="_blank" href="https://steampixel.de/en/imprint/">https://steampixel.de/en/imprint/</a><br>
        Privacy: <a target="_blank" href="https://steampixel.de/en/privacy-policy/">https://steampixel.de/en/privacy-policy/</a><br>
        GitHub: <a target="_blank" href="https://github.com/steampixel/AdventureCargoCalculator">https://github.com/steampixel/AdventureCargoCalculator</a>
      </div>

    </div>

  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'
import Editable from '~/components/Editable.vue'
const uuidv1 = require('uuid/v1');

export default {
  components: {
    Editable
    // Logo
  },
  data: function() {
    return {
      unit: 'g',
      lists: []
    }
  },
  mounted: function () {
    var component = this
    this.$nextTick(function () {
      if (localStorage.getItem('cargo') !== null) {
        var data = JSON.parse(localStorage.getItem('cargo'))
        // console.log(data)
        component.$set(this, 'lists', data)
      }else{
        component.$set(this, 'lists', [
          {
            id: '1',
            name: 'Night and sleep',
            color: '#ffcccc',
            enabled: true,
            items: [
              {
                id: '1',
                name: 'tent',
                weight: '1800',
                enabled: true
              },
              {
                id: '2',
                name: 'sleeping bag',
                weight: '1000',
                enabled: true
              },
              {
                id: '3',
                name: 'sleeping pad',
                weight: '500',
                enabled: true
              }
            ]
          },
          {
            id: '2',
            name: 'Cooking',
            color: '#ccffcc',
            enabled: true,
            items: [
              {
                id: '4',
                name: 'pots',
                weight: '1800',
                enabled: true
              },
              {
                id: '5',
                name: 'gas cooker',
                weight: '3000',
                enabled: true
              }
            ]
          },
          {
            id: '3',
            name: 'Nice to have',
            color: '#ccccff',
            enabled: false,
            items: [
              {
                id: '45vg784g',
                name: 'My favorite book',
                weight: '900',
                enabled: true
              },
              {
                id: 'v34z636z57uvv',
                name: 'Extra boots',
                weight: '3000',
                enabled: true
              }
            ]
          }
        ])
      }
    })
  },
  watch: {
    lists: {
      handler() {
        localStorage.setItem('cargo', JSON.stringify(this.lists))
      },
      deep: true,
    },
  },
  methods: {
    addList (){
      this.lists.push({
        id: uuidv1(),
        name: 'New list',
        color: this.getRandomColor(),
        enabled: true,
        items: [

        ]
      })
      this.addItem(this.lists.length-1)
      this.addItem(this.lists.length-1)
      this.addItem(this.lists.length-1)
    },
    removeList(listIndex){
      this.lists.splice(listIndex, 1)
    },
    setListValue (listIndex, key, value) {
      this.lists[listIndex][key] = value
    },
    addItem (listIndex){
      this.lists[listIndex].items.push({
        id: uuidv1(),
        name: 'New item '+(this.lists[listIndex].items.length+1),
        weight: 0,
        enabled: true
      })
    },
    removeItem(listIndex, itemIndex){
      this.lists[listIndex].items.splice(itemIndex, 1)
    },
    getRandomColor() {
      var letters = 'BCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
    calculateListWeight(listIndex){
      var weight = 0
      for(var item of this.lists[listIndex].items){
        if(item.enabled){
          weight = weight + Number(item.weight)
        }
      }
      return weight
    },
    calculateWeight(){
      var weight = 0
      for(var listIndex in this.lists){
        if(this.lists[listIndex].enabled){
          weight = weight + this.calculateListWeight(listIndex)
        }
      }
      return weight
    },
    download(){
      let data = JSON.stringify({
        unit: this.unit,
        lists: this.lists
      }, null, 2);

      // Trigger download
      var element = document.createElement('a');
      element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', 'cargo.json');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);
    },
    restore: function(ev){
      var component = this;
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = event => {
        var data = JSON.parse(event.target.result)
        component.$set(this, 'unit', data.unit)
        component.$set(this, 'lists', data.lists)
      };

      reader.readAsText(file);
    }
  }
}
</script>

<style>

body {
  background-image: url(/backgrounds/shoes-1638873_1920.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment:fixed;
}

.card {
  background-color:#ffffffdd;
  border-radius: 0px;
  padding:16px;
}

.has-margin-bottom-2 {
  margin-bottom:16px;
}

.has-padding-vertical-2 {
  padding-top:16px;
  padding-bottom: 16px;
}

.handle {
  cursor: move;
}

.input-weight {
  background-color:transparent;
  border:0;
  width:70px;
  font-weight:bold;
  text-align:right;
}

.list-disabled {
  opacity: 0.7;
}
.list-disabled .title {
  text-decoration:line-through;
}

.item-disabled {
  opacity: 0.5;
}
.item-disabled .item-name {
  text-decoration:line-through;
}

/* upload button */
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
  cursor:pointer;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor:pointer;
}

</style>
