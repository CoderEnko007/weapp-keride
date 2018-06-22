<template>
<div class="container" v-show="show">
  <div class="header">
    <img :src="backgroundImage" mode="aspectFill">
    <div class="hTitle">联系我们</div>
  </div>
  <div class="contactList">
    <div class="contact-item" v-for="(item, index) in contacts" :key="index">
      <h2 class="name">{{item.name}}</h2>
      <map id="map" :longitude="item.longitude"  :latitude="item.latitude" :markers="markers[index]"></map>
      <div class="cell">
        <span class="label">地址</span>
        <span class="content" @click="openMap(item)">{{item.address}}</span>
      </div>
      <div class="cell">
        <span class="label">邮编</span>
        <span class="content" @click="copyText(item.zipcode)">{{item.zipcode}}</span>
      </div>
      <div class="cell">
        <span class="label">电话</span>
        <span class="content" @click="handlePhoneCall(item.phone)">{{item.phone}}</span>
      </div>
      <div class="cell">
        <span class="label">传真</span>
        <span class="content" @click="copyText(item.fax)">{{item.fax}}</span>
      </div>
      <div class="cell">
        <span class="label">邮箱</span>
        <span class="content" @click="copyText(item.email)">{{item.email}}</span>
      </div>
    </div>
    <!--<button @click="upload">测试</button>-->
    <button open-type="contact" class="contact zan-btn--primary">联系客服</button>
  </div>
  <floatBtnGroup></floatBtnGroup>
</div>
</template>
<script>
  import {getContacts} from "../../utils/api";
  import global from '../../utils/global';
  import floatBtnGroup from '@/components/floatBtnGroup';

  export default {
    components: {
      floatBtnGroup
    },
    data() {
      return {
        show: false,
        backgroundImage: global.background,
        contacts: [],
        markers: []
      }
    },
    methods: {
      getContactList() {
        getContacts().then(res => {
          this.show = true;
          this.contacts = res;
          let data = res;
          for (let i in data) {
            if (data.hasOwnProperty(i)) {
              this.markers[i] = [{
                  iconPath: "/static/img/location.png",
                  id: data[i].id,
                  latitude: data[i].latitude,
                  longitude: data[i].longitude,
                  width: 20,
                  height: 20,
                  callout: {
                    content: '  '+data[i].name+'  ',
                    color: '#fff',
                    fontSize: 10,
                    padding: 2,
                    bgColor: '#000',
                    borderRadius: 15,
                    display: 'ALWAYS',
                    textAlign: 'center',
                  },
              }]
            }
          }
        })
      },
      openMap(v) {
        wx.openLocation({
          latitude: Number(v.latitude),
          longitude: Number(v.longitude),
          name: v.name,
          address: v.address
        })
      },
      copyText(text) {
        wx.setClipboardData({
          data: text,
          success: function(res) {
            wx.getClipboardData({
              success: function(res) {
                console.log(res.data) // data
              }
            })
          }
        })
      },
      handlePhoneCall(number) {
        wx.makePhoneCall({
          phoneNumber: number
        })
      },
      upload() {
        wx.chooseImage({
          success: function(res) {
            var tempFilePaths = res.tempFilePaths
            let url = `${global.host}/api/upload1`;
            wx.uploadFile({
              url: url, //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'file',
              formData:{
                'user': 'test'
              },
              success: function(res){
                var data = res.data
                console.log(data)
                //do something
              }
            })
          }
        })
      }
    },
    mounted() {
      this.getContactList();
    },
    onShareAppMessage(res) {
      return {
        title: '联系我们',
        path: `/pages/Contact/main`
      }
    }
  }
</script>
<style lang="scss" scoped>
.contactList {
  margin: 20px;
  .contact-item {
    margin-top: 20px;
    #map {
      width: 100%;
      margin: 5px auto 10px;
    }
    .name {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .cell {
      position: relative;
      height: 90rpx;
      font-size: 14px;
      border-bottom: 1px solid #ddd;
      .label {
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: bold;
      }
      .content {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        color: #555;
        max-width: 500rpx;
        text-align: right;
      }
    }
  }
  .contact {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
