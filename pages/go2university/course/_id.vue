<template>
    <div v-if="is_data_fetched">
        <course-video v-if="course_id" :course_id="course_id" :is_payed="is_payed" :currentSubCourse.sync="currentSubCourse"/>
        <course-status :base_people.sync="base_people" :is_payed.sync="is_payed" :course_id="course_id" v-on:openModal="openModal"/>
		<practice-input-box id="practice" v-if="course_id" :is_payed="is_payed" :course_id="course_id" :currentSubCourse.sync="currentSubCourse"/>
        <div class="go2u-teachers" :class="$mq">
            <img :class="$mq" :src="`/teacher${teacher}.jpg`" alt="" v-for="teacher in courseDataSet[course_id].teachers" :key="teacher">
        </div>
        <div class="go2u-desktop" :class="$mq" v-for="img in go2uDesktop" :key="img">
            <img :src="img" alt="" v-if="img == go2uDesktop[0] || img == go2uDesktop[1]">
            <img :src="img" alt="" v-if="img == go2uDesktop[2] && $mq == 'desktop'">
            <img :src="img" alt="" v-if="img == go2uDesktop[3] && $mq == 'mobile'">
            <button v-if="!is_payed && ((img == go2uDesktop[2] && $mq == 'desktop') || (img == go2uDesktop[3] && $mq == 'mobile'))" class="buy-now-btn">
                <button class="btn-coupon" @click="openModal('coupon-input')"> 
                    購買/兌換
                </button>
            </button>
        </div>
        <div v-if="course_id == '01'" class="medical-ad"><a href="https://lihi.cc/Fif8z"><img :src="medicalAd" alt="https://lihi.cc/Fif8z"></a></div>
        <div v-if="$mq == 'mobile'" class="fixed-buy-button-container">
            <button v-if="!is_payed" class="fixed-buy-button" @click="openModal('coupon-input')">
                立即購買
            </button>
            <button v-else class="fixed-buy-button" @click="showLightBox()">
                開始上課
            </button>
        </div>
        <course-video-list-light-box :is_payed="is_payed" :course="courseDataSet[course_id]" :lightBoxShowed.sync="lightBoxShowed" v-on:changeCurrentSubCourse="changeCurrentSubCourse"></course-video-list-light-box>
        <modal name="coupon-input" :width.sync="modal_width">
            <div class="coupon-input-container">
                <h5>若已經購買，請輸入您收到的課程序號</h5>
                <div class="coupon-input-form">
                    <input type="text" name="" id="" v-model="coupon_id">
                    <button class="coupon-input-form-send" @click="checkCoupon"> 
                        購買/兌換
                    </button>
                </div>
                <div class="coupon-input-buy">
                    還沒有序號嗎？請點<router-link to="/go2university/confirm">這裡</router-link>取得
                </div>
            </div>
        </modal>
        <modal name="feedback" :width.sync="modal_width">
            <div class="coupon-input-container">
                <h5>為了不斷提升課程品質，邀請您填寫課程體驗滿意度回饋問卷</h5>
                <h5> <a href="https://www.surveycake.com/s/BLM8a"> {{ "點此給我們回饋" }}</a></h5>
            </div>
        </modal>
    </div>
    <loading 
        :active="!is_data_fetched" 
        :is-full-page="true"
        v-else ></loading>
</template>

<script>
import CourseHeader from '~/components/CourseHeader.vue'
import CourseVideo from '~/components/CourseVideo.vue'
import CourseStatus from '~/components/CourseStatus.vue'
import PracticeInputBox from '~/components/PracticeInputBox.vue'
import PracticeRecordBox from '~/components/PracticeRecordBox.vue'
import CourseVideoListLightBox from '~/components/CourseVideoListLightBox.vue'
import CourseFooter from '~/components/CourseFooter.vue'

import medicalAd from 'static/go2u-desktop/medical-ad.jpg'

// import teacher01 from 'static/teacher01.jpg';
// import teacher01 from 'static/teacher02.jpg';
// import teacher01 from 'static/teacher03.jpg';

import go2u05 from 'static/go2u-desktop/05.jpg';
import go2u07b from 'static/go2u-desktop/07-5.jpg';
import go2u08 from 'static/go2u-desktop/08.jpg';
import go2u28 from 'static/go2u-mobile/28.jpg';
import go2uBuy from 'static/go2u-desktop/buy.png';
import CourseData01 from 'static/data/course/01.js'
import CourseData02 from 'static/data/course/02.js'
import CourseData03 from 'static/data/course/03.js'
import CourseData04 from 'static/data/course/04.js'
import CourseData05 from 'static/data/course/05.js'
import CourseData06 from 'static/data/course/06.js'
import CourseData07 from 'static/data/course/07.js'
import CourseData08 from 'static/data/course/08.js'
import CourseData09 from 'static/data/course/09.js'
import CourseData10 from 'static/data/course/10.js'
import CourseData11 from 'static/data/course/11.js'


import axios from '~/config/axios-config';
import { mapMutations, mapGetters } from 'vuex';
import Vuex from 'vuex';
import Vue from 'vue'
import VueMq from 'vue-mq'
import VModal from 'vue-js-modal'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';


Vue.use(VModal,{ dynamic: true})
Vue.use(VueMq, {
  breakpoints: {
    // small: 400,
    mobile: 992,
    desktop: Infinity,
  }
});

export default {
    layout: 'go2university',
    head () {
        return {
            link: [
                { rel: 'stylesheet', href: '/bootstrap.css' }
            ]
        } 
    },
    computed: mapGetters({
        user : 'user/getData',
    }),
	async created(){
        if (this.$mq == "mobile") {
            this.modal_width = "100%";
            console.log("mobile")
        } else {
            this.modal_width = "100%";
        }
    },
    async mounted(){
        /* init params */
        if (!process.server) {
            this.course_id = this.$route.params.id;
            let store = this.$store;
            let login_status = await this.$checkLogin(store);
            
            this.currentSubCourse = this.courseDataSet[this.course_id].sub_course[7];
            if (!this.courseDataSet[this.course_id]) {
            window.alert('網址錯誤');
            this.$router.go(-1);
            } else {
            this.product_name = this.courseDataSet[this.course_id].product_name;
            }  
            if(login_status) {
                await this.checkIsPayed();
            } else {
                this.is_payed = false;
            }
            this.base_people = this.courseDataSet[this.course_id].base_people;
            console.log(this.base_people);
            this.is_data_fetched = true;
            
            if (this.is_payed && this.is_data_fetched) {
                const openModal = this.openModal;
                var feedback_timeout = setTimeout(function (){
                    openModal('feedback')
                }
                ,3000);
                console.log('feedback');
            }
        }
      },
    components: {
		CourseHeader,
		CourseVideo,
		CourseStatus,
        PracticeInputBox,
        PracticeRecordBox,
        CourseVideoListLightBox,
        CourseFooter,
        Loading,
    },
    data:() => ({
        is_data_fetched:false,
        course_id:"",
        is_payed:false,
        currentSubCourse:Object,
        base_people:0,
        medicalAd,
        coupon_id:"",
        courseDataSet: {
            "01": CourseData01,
            "02": CourseData02,
            "03": CourseData03,
            "04": CourseData04,
            "05": CourseData05,
            "06": CourseData06,
            "07": CourseData07,
            "08": CourseData08,
            "09": CourseData09,
            "10": CourseData10,
            "11": CourseData11,
        },
        go2uDesktop:[
            go2u05,
            go2u07b,
            go2u08,
            go2u28,
        ],
        go2uBuy,
        modal_width:'100%',
        lightBoxShowed:false,
    }),
    methods: {
        async checkIsPayed() {  
            const user_id = this.user.user_id;
            const product_id = this.course_id;
            try {
                let response = await axios.post('/apis/check-is-payed',{product_id:product_id,user_id:user_id})
                let response2 = await axios.post('/apis/check-is-payed',{product_id:"12",user_id:user_id})
                if (response.data.status == '200' && response2.data.status == '200') {
                    console.log("check-is-payed success")
                    if(response.data.result == 1 || response2.data.result == 1) {
                        this.is_payed = true;
                        return true;
                    } else {
                        this.is_payed = false;
                        return false;
                    }
                } else {
                    console.log(response)
                    this.is_payed = false;
                    return false;
                }
            } catch(error) {
                console.log(error)
                this.is_payed = false;
                return false;
            }
        },
        openModal (name) {
            // TODO: auto size for device not finished
            if (this.$mq == "mobile") {
                this.modal_width = "100%";
                console.log("mobile")
            } else {
                this.modal_width = 600;
            }
            this.$modal.show(name, {
                coupon_id: this.coupon_id,
            },)
        },
        hideModal (name) {
            this.$modal.hide(name);
        },
        async checkCoupon() {
            const coupon = this.coupon_id;
            console.log("check coupon")
            console.log(coupon)
            try {
                let is_login = await this.$forceLogin(this.$store);
                if (!is_login) {
                    window.alert("需要登入才能兌換課程喔～");
                    this.$route.push("/login")
                    return false;
                } else if(coupon.length <= 5) {
                    window.alert("請輸入完整序號");
                    return false;
                }
                this.is_data_fetched = false;
                let response = await axios.post('/apis/use-coupon',{coupon_id:coupon,activity_id:"1"})

                if (response.data.status == '200') {
                    console.log(response.data.result);
                    if(response.data.result == "1") {
                        console.log("coupon check success")
                        let res2 = await axios.post('/apis/coupon-pay',{coupon_id:coupon,product_id:this.course_id,cash_flow:"coupon",user_id:this.user.user_id,price:0})
                        if (res2.status == 200) {
                            console.log("coupon pay success")
                            await this.checkIsPayed();
                            if (this.is_payed) {
                                window.alert("兌換此課程成功！");
                                this.hideModal('coupon-input')
                            } else {
                                window.alert("兌換失敗，請重新嘗試或聯絡我們");
                            }
                            this.is_data_fetched = true;
                        } else {
                            window.alert("兌換失敗，請重新嘗試或聯絡我們");
                            this.is_data_fetched = true;
                        }
                    }
                } else {
                    window.alert("此組序號已經使用過囉～");
                    this.is_data_fetched = true;
                }
            } catch (error) {
                console.log(error)
                this.is_data_fetched = true;
            }
        },
        changeCurrentSubCourse(item) {
            if (this.is_payed || item.id == 2 || item.id == 8) {
                this.currentSubCourse = item;
                console.log("change current sub")
            } else {
                window.alert("購買後即可觀看");
            }
        },
        showLightBox() {
            this.lightBoxShowed = true;
        },
        hideLightBox() {
            this.lightBoxShowed = false;
        },
    }
}
</script>

<style lang="postcss">
*{
	position: relative;
}
html, body{
	padding: 0;
	margin: 0;
    height: 100%;
    font-family: arial, "Microsoft JhengHei", "微軟正黑體";
}
.btn-coupon {
    width: 300px;
    /* margin-left: 10vw; */
    height: 50px;
    background-color: #E0185D;
    border-radius: 20px;

    display: inline-block;
    text-decoration: none;
    text-align: center;
    
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    color: white;
}
.medical-ad {
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
    padding-top: 50px;
}
.medical-ad img {
    width: 50vw;
    height: 14vw;
}
.go2u-teachers {
  /* width: 80vw;
  margin-left: 10vw; */
  margin-bottom: 2%;

  &.desktop { 
      display: flex;
      justify-content: center;
   }
  &.mobile { width: 90vw; margin-left: 5vw; }
}
.go2u-teachers img {
    &.desktop {
        width: 50vw;
        height: 20vw;
    }
  /* max-width: 60vw; */
  &.mobile { width: 100%;}
}
.go2u-desktop {
  width: 80vw;
  margin-left: 10vw;
  margin-bottom: 5%;

  &.mobile { width: 90vw; margin-left: 5vw; }
}
.go2u-desktop img {
  width: 100%;
}
.buy-now-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  border: none;
}
.coupon-input-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.coupon-input-container h5 {
    padding: 0 5vw 0 5vw;
    text-align: center;
}
.coupon-input-form{
    margin-bottom: 10px;

}
.coupon-input-form input {
    height: 50px;
    font-size: 20px;
    border: none;
    border-bottom: 2px gray solid;
    width: 200px;
}
.coupon-input-form-send {
    /* width: 200px; */
    /* margin-left: 10vw; */
    padding: 0 20px 0 20px;
    height: 50px;
    background-color: #E0185D;
    border-radius: 20px;

    display: inline-block;
    text-decoration: none;
    text-align: center;
    
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    color: white;
    margin-left: 10px;
}
.coupon-input-buy {
    font-size: 20px;
    margin-top: 10px;
    color: gray;
    font-weight: 500px;
}
.coupon-input-buy a {
    color: #E0185D;
}
.fixed-buy-button-container {
    display: flex;
    position: fixed;
    bottom: 0px;
    width: 100vw;
    height: 70px;
    background: white;
    box-shadow: -1px 0px 20px 1px lightgrey;
    justify-content: center;
    align-items: center;
}
.fixed-buy-button {
    border: none;
    background: #E0185D;
    color: white;
    font-size: 20px;
    border-radius: 20px;
    padding: 5px 50px;
    text-decoration: none;
}
.fixed-buy-button:active {
    color: white;
}
.fixed-buy-button:hover {
    color: white;
}
</style>
