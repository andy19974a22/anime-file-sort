<template>
  <div>
  <v-timeline
    align-top
    dense
    fill-dot
  >
    <div v-for="(item,index) in list">
      <v-timeline-item
        class="mb-6"
        align-top
        hide-dot
      >
        <span>{{item.year}}</span>
      </v-timeline-item>

      <v-timeline-item
        color="teal lighten-3"
        small
        v-for="(item2,index2) in item.list"
      >
        <template v-slot:opposite>
          <span> {{item2.month}}</span>
        </template>
        <div class="py-4">
          <h2 class="headline font-weight-light mb-4 cyan--text"> {{item2.month}}月新番</h2>
          <div>
            <v-container fluid class="box">
              <v-layout row wrap>
                <v-flex xs4 lg2 v-for="(item4,index4) in item2.list" pa-1 @click="open(item4.name)" style="cursor: pointer">
                  <v-img
                    :src="'./api/getCollectionImg?name=' + item4.name"
                    height="160"
                    class="grey darken-4"
                  ></v-img>

                  <span v-if="item4.roll === item4.end">🎈🎈</span>{{item4.name}} - <span v-if="item4.season">(第{{item4.season}}期) </span><span
                  class="cyan--text">{{item4.roll}}</span><span v-if="item4.roll === item4.end">🎈🎈</span>
                  <span v-if="item4.end && item4.roll !== item4.end"><br>End - <span
                    class="purple--text">{{item4.end}}</span></span>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </div>
      </v-timeline-item>
    </div>
  </v-timeline>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Open
      </v-card-title>

      <v-card-text>
        <v-list-tile
          v-for="(item, index) in folderList"
          :key="item"
          avatar
          @click=""
        >
          <v-list-tile-content @click="open(selectedName,index)">
            <v-list-tile-title>{{item}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-card-text>

      <v-divider></v-divider>

    </v-card>
  </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "app-collection-page",
    props: ['searchText'],
    data() {
      return {
        sourceList: [],
        list: [],
        nameList: [],
        dialog:false,
        folderList:[],
        selectedName:""
      }
    },
    methods: {
      load() {
        let _this = this;
        fetch(this.$g.hostName + "/getCollection").then(
          function (response) {
            return response.json();
          }
        ).then((json) => {
          _this.sourceList = json;
          _this.filter();
        });
      },
      filter() {
        this.list = [];
        this.nameList = [];
        for (let i = 0; i < this.sourceList.length; i++) {

          let yearItems = this.sourceList[i];
          let tmp = {year: yearItems.year, list: []};

          for (let j = 0; j < yearItems.list.length; j++) {
            let monthItems = yearItems.list[j];
            let listArray = [];

            for (let k = 0; k < monthItems.list.length; k++) {
              let item = monthItems.list[k];
              if (this.searchText === "" || item.name.includes(this.searchText)) {
                listArray.push(item);
                this.nameList.push(item.name)

              }
            }

            if (listArray.length > 0) {
              tmp.list.push({month: monthItems.month, list: listArray})
            }
          }

          if (tmp.list.length > 0) {
            this.list.push(tmp);
          }
        }
        console.log(JSON.stringify(this.nameList.sort()));
      },
      keyName(obj) {
        return Object.keys(obj)[0]
      },
      open(name,index = ""){
        this.dialog = false;
        let _this = this;
        fetch(this.$g.hostName + "/openImgFolder?name=" + name + "&index=" + index).then(
          function (response) {
            return response.json();
          }
        ).then((json) => {
          _this.folderList = [];
          if(json.length > 0){
            for (let i = 0; i < json.length; i++) {
              _this.folderList.push(json[i])
            }
              _this.selectedName = name;
              _this.dialog = true;
          }
        });
      }
    }, created() {
      let _this = this;
      this.$g.mode('collectionMode');
      this.$g.loadCollection = function () {_this.load()};
      this.load();
    },
    watch: {
      searchText(d) {
        this.filter();
      }
    }
  }
</script>

