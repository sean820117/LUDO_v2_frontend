<template>
    <div class="mamiyoga-header">
        <router-link to="/mamiyoga">
        <div class="mamiyoga-header-logo">
            <img src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/header-logo.png" alt="瑜伽課程">
        </div>
        </router-link>
        <!-- <router-link :to="{path:loginTo}" style="text-decoration:none;"> -->
        <div class="mamiyoga-header-login">
            <!-- <button :style="{backgroundColor:bgColor,color:ftColor}" class="mamiyoga-header-login-btn">{{is_login === false ? '登入':'登出'}}</button> -->
            <!-- <button :style="{backgroundColor:bgColor,color:ftColor}" class="mamiyoga-header-login-btn" v-if="!is_login" @click="$router.push('/mamiyoga/login')">{{$t('header_login')}}</button> -->
            <button :style="{backgroundColor:bgColor,color:ftColor}" class="mamiyoga-header-login-btn" v-if="!is_login" @click="openRemindBox">{{$t('header_login')}}</button>
            <!-- <button :style="{backgroundColor:bgColor,color:ftColor}" class="mamiyoga-header-login-btn" @click="$router.push('/logout')" v-else >登出</button> -->
        </div>
        <!-- </router-link> -->
    </div>
</template>

<script>
import MamiyogaSmallBtn from '~/components/mamiyoga/MamiyogaSmallBtn.vue';
export default {
    data:()=>({
        is_login:false,
    }),
    props: {
        bgColor: String,
        ftColor: String,
        btnText: String,
        loginTo: String,
    },
    components: {
        MamiyogaSmallBtn,
    },
    // async mounted() {
    //     if (process.client) {
    //         this.is_login = await this.$checkLogin(this.$store);
    //     }
    // },
    methods:{
        openRemindBox(){
            this.$emit('openRemindBox');
        }
    }
}
</script>

<style>
.mamiyoga-header {
    position: relative;
    width: 100%;
    height: 60px;
    /* background: red; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.mamiyoga-header-logo {
    width: 30px;
    height: 30px;
    /* background: white; */
    /* position: absolute;
    top: 2vh;
    left: 7vw; */
}
.mamiyoga-header-logo img {
    display: block;
    width: 30px;
}
.mamiyoga-header-login {
    /* background: white; */
    /* position: absolute;
    top: 3vh;
    right: 6vw; */
}
.mamiyoga-header-login-btn {
    width: 80px;
    height: 25px;
    border-radius:20px;
    font-weight: 500;
    font-size: 12px;
    text-align: center;
    border-style: none;
    box-shadow: 0px 2px 4px rgba(0,0,0,.3);
    cursor: pointer;
}
@media (min-width: 769px) {
    .mamiyoga-header {
        position: relative;
        width: 100%;
        height: 60px;
        /* background: red; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }
    .mamiyoga-header-logo {
        width: 30px;
        height: 30px;
        /* background: white; */
        /* position: absolute;
        top: 2vh;
        left: 7vw; */
    }
    .mamiyoga-header-logo img {
        display: block;
        width: 30px;
    }
    .mamiyoga-header-login {
        /* background: white; */
        /* position: absolute;
        top: 3vh;
        right: 6vw; */
    }
    .mamiyoga-header-login-btn {
        width: 63px;
        height: 25px;
        border-radius:20px;
        font-weight: 500;
        font-size: 12px;
        text-align: center;
        border-style: none;
        box-shadow: 0px 2px 4px rgba(0,0,0,.3);
    }
}

    

</style>
