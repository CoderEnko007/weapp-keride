<template>
<div class="container">
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
        <span class="content" @click="makePhoneCall(item.phone)">{{item.phone}}</span>
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
  </div>
</div>
</template>
<script>
  import {getContacts} from "../../utils/api";
  import global from '../../utils/global';

  export default {
    data() {
      return {
        backgroundImage: global.background,
        contacts: [],
        markers: []
      }
    },
    methods: {
      getContactList() {
        getContacts().then(res => {
          console.log(res);
          this.contacts = res.data;
          let data = res.data;
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
      makePhoneCall(number) {
        wx.makePhoneCall({
          phoneNumber: number //仅为示例，并非真实的电话号码
        })
      }
    },
    mounted() {
      this.getContactList();
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
}
</style>
