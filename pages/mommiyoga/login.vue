<template>
    <div class="signup-page">
        <div class="mamiyoga-header">
            <div class="mamiyoga-header-logo"></div>
            <div class="mamiyoga-header-login">
                <button :style="{background: is_ui_config_loaded ? ui_config.view.signup_page.submit_button.background_color : '' }"
                @click="switch_signup_and_login" class="mamiyoga-header-login-btn-switch">{{ login_or_signup === "signup" ? $t('login_btn_login') : $t('login_btn_signup') }}</button>
            </div>
        </div>
        <div class="mamiyoga-login-container">
            <div class="reg-text">{{ login_or_signup === 'signup' ? $t('login_btn_signup') : $t('login_btn_login') }}</div>
            <div class="reg-text2"> {{$t('login_text_remind')}}</div>
            <div class="third-party" v-if="is_open">
                <no-ssr ><mommiyoga-third-party-icons v-if="is_ui_config_loaded" :login_method="ui_config.view.signup_page.login_method"/></no-ssr>
            </div>
            <div class="third-party" v-if="!is_open">
                <no-ssr><mamiyoga-third-party-icons v-if="is_ui_config_loaded" :login_method="ui_config.view.signup_page.login_method"/></no-ssr>
            </div>
            <div class="hr"></div>
            <div class="text-or">or</div>
            <form class="signup-form">
                <div class="login-column">
                    <div class="login-column-label">{{$t('login_input_email')}}</div>
                    <input name="email" class="login-column-input" type="text" v-model="email" placeholder=""/>
                </div>
                <div class="login-column">
                    <div class="login-column-label">{{$t('login_input_password')}}</div>
                    <input name="password" class="login-column-input" type="password" v-model="password" placeholder=""/>
                </div>
                <div class="login-column">
                    <div v-show="login_or_signup === 'signup'">
                        <div class="login-column-label">{{$t('login_input_again')}}</div>
                        <input name="confirmPassword" class="login-column-input" type="password" v-model="confirmPassword"/>
                    </div>
                </div>
                <!-- <div class="login-column" v-if="login_or_signup === 'login'">
                    <div style="height:53 px"></div>
                </div> -->
                <div class="reg-text2" :style="{color: hint_color,width: '67vw',textAlign: 'right',maxWidth: '320px',height: '18px',}"> {{ hint }}</div>
                <div class="btn-login-and-signup-container">
                    <!-- <p class="switch-login-and-signup" @click="switch_signup_and_login">我要{{ login_or_signup === "signup" ? '登入' : '註冊' }}</p> -->
                    <button class="mamiyoga-btn-login-and-signup" type="submit" :style="{background: is_ui_config_loaded ? ui_config.view.signup_page.submit_button.background_color : '' }" @click.prevent="login_or_signup === 'signup' ? onSubmit('signup') : onSubmit('login')">{{ login_or_signup === 'signup' ? $t('login_btn_pay') : $t('login_btn_login') }}</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script >
import MamiyogaThirdPartyIcons from "~/components/mamiyoga/MamiyogaThirdPartyIcons.vue"
import MommiyogaThirdPartyIcons from "~/components/mamiyoga/MommiyogaThirdPartyIcons.vue"
import { EMAIL_REGEX } from '~/components/regex.js'

import axios from '~/config/axios-config'

export default {
    layout: 'mommiyoga',
    data() {
        return {
            errors: null,
            email: '',
            password: '',
            confirmPassword: '',
            ui_config: Object,
            hint:'请填写',
            hint_color:'transparent',
            is_ui_config_loaded:false,
            login_or_signup:'login',
            is_open: false,
        }
    },
    props: {
        // ui_config: Object,
    },
    async mounted() {
        if (process.client) {
            if(this.$i18n.locale == 'zh-CN') {
                this.is_open = true
            } else {
                this.is_open = false
            }
            this.ui_config = await require('~/config/mamiyoga-config')
            this.is_ui_config_loaded = true;
            localStorage.redirect = '/mommiyoga/menu';

            let login_or_not = await this.$checkLogin(this.$store);
            if (login_or_not) {
                if(this.$i18n.locale == 'zh-CN') {
                    window.alert('你已经登入了')
                    this.$router.push('/zh-CN/mommiyoga/menu')
                } else {
                    window.alert('你已經登入了')
                    this.$router.push('/mommiyoga/menu')
                }
                
            }
            //ga
            // let gtag_config = {}
            // gtag_config.page_title = 'login';
            // gtag_config.page_path = this.$route.path;
            // this.$gtag('js', new Date());
            // this.$gtag('config', 'AW-739537538');
            // this.$gtag('config', 'UA-123332732-3', gtag_config);
            // this.$fbq("init",this.ui_config.fbq_id);
            // this.$fbq("track","PageView");
        }
    },
    components: {
        MamiyogaThirdPartyIcons,
        MommiyogaThirdPartyIcons,
    },
    methods: {
        onSubmit(type) {
            if(this.$i18n.locale == 'zh-CN') {
                if (this.email.length === 0 || this.password.length === 0) {
                    this.hint = '请填写所有栏位！'
                    this.hint_color = "red"
                    return
                }
                if (!EMAIL_REGEX.test(this.email)) {
                    this.hint = '电子信箱格式错误'
                    this.hint_color = "red"
                    return
                }
                if (this.password.length < 8) {
                    this.hint = '密码过短'
                    this.hint_color = "red"
                    return
                }
                if (this.password !== this.confirmPassword && type === "signup") {
                    this.hint = '密码需大于八个字'
                    this.hint_color = "red"
                    return
                }
            } else {
                if (this.email.length === 0 || this.password.length === 0) {
                    this.hint = '請填寫所有欄位！'
                    this.hint_color = "red"
                    return
                }
                if (!EMAIL_REGEX.test(this.email)) {
                    this.hint = '電子信箱格式錯誤'
                    this.hint_color = "red"
                    return
                }
                if (this.password.length < 8) {
                    this.hint = '密碼過短'
                    this.hint_color = "red"
                    return
                }
                if (this.password !== this.confirmPassword && type === "signup") {
                    this.hint = '密碼需大於八個字'
                    this.hint_color = "red"
                    return
                }
            }

            this.hint = null
            this.hint_color = ""

            if (type === "signup") {
                this.signup(this.email, this.password, this.confirmPassword)    
            } else {
                this.login(this.email, this.password)
            }
        },
        async signup(email,password,repeated_password) {
            console.log("go sign up")
            try {
              let response = await axios.post('/signup',{email:email,password:password,repeated_password:repeated_password,from:this.ui_config.project_name})
              if (response.data.status == '200') {
                  console.log("signup success")
                  let login_result = await this.$checkLogin(this.$store);
                  this.$router.push('/login-redirect')
              } else {
                  if(this.$i18n.locale == 'zh-CN') {
                      this.hint = '注册失败 - ' + response.data.message;
                  } else {
                      this.hint = '註冊失敗 - ' + response.data.message;
                  }
                  this.hint_color = "red"
                  console.log(response)
              }
            } catch (error) {
              if(this.$i18n.locale == 'zh-CN') {
                  this.hint = '注册失败'
              } else {
                  this.hint = '註冊失敗'
              }
              this.hint_color = "red"
              console.log(error)
            }
        },
        async login(email,password) {
            try {
                let response = await axios.post('/login',{email:email,password:password})
                if (response.data.status == '200') {
                    console.log("login success")
                    console.log(response)
                    let login_result = await this.$checkLogin(this.$store);
                    this.$router.push('/login-redirect')
                } else {
                    console.log(response)
                    this.hint = response.data.message;
                    this.hint_color = "red"
                }
            } 
            catch (error) {
                console.log(error)
                if(this.$i18n.locale == 'zh-CN') {
                    this.hint = "传送失败，请重新尝试"
                } else {
                    this.hint = "傳送失敗，請重新嘗試"
                }
                this.hint_color = "red"
            }
        },
        switch_signup_and_login() {
            if (this.login_or_signup === "signup") {
                this.login_or_signup = "login"
            } else {
                this.login_or_signup = "signup"
            }
        },
    }
}
</script>

<style>

/* html, body, #__nuxt, #__layout, #__layout > div{
    height: 100vh;
    background: white;
} */
textarea:focus, input:focus{
    outline: none;
}
.signup-page{
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.signup-page .mamiyoga-header {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
}
.signup-page .mamiyoga-header-logo {
    width: 30px;
    height: 30px;
}

.signup-page .mamiyoga-header .mamiyoga-header-login-btn-switch {
    color: #FFF;
    width: 55px;
    height: 25px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 12px;
    text-align: center;
    border-style: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
    cursor: pointer;
}
.mamiyoga-login-container {
    height: 80vh;
}
.reg-text{
    /* padding-top: 80px; */
    font-size: 21px;
}
.reg-text2{
    margin-top: 11px;
    font-size: 13px;
    color: #8F8F8F;
}
.third-party{
    margin-top: 8vh;
}
.mamiyoga-login-container .hr{
    width: 63%;
    height: 1px;
    background: #D4D4D4;
    margin:23px auto 0;
    max-width: 320px;
}
.text-or{
    font-size: 14px;
    font-weight: 100;
    margin-top: 10px;
}
.signup-form{
    text-align: left;
    width: 100vw;
    max-width: 475px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.signup-form input[type=text]{
    padding:0px 10px;
}
.signup-form input[type=password]{
    padding:0px 10px;
}
.signup-form .login-column{
    margin-top: 11px;
    width: 67%;
    height: 53px;
}
.login-column-label{
    text-align: left;
    color: #707070;
    font-size: 11px;
    line-height: 20px;
    margin-bottom: 6px; 
    padding-left: 5px;
}
.login-column-input{
    height: 27px;
    width: 100%;
    border-radius: 8px;
    border: none;
    background: #F3F3F3;
}
.btn-login-and-signup-container {
    display: flex;
    margin-top: 3vh;
    justify-content: flex-end;
    width: 67%;
    /* margin-left: 16.5vw; */
}
.switch-login-and-signup {
    font-size: 13px;
    color: #8F8F8F;
    margin-top: 10px;
}
.mamiyoga-btn-login-and-signup{
    width: 90px;
    height: 36px;
    line-height: 36px;
    /* background: #1785db; */
    color: #fff;
    font-size: 14px;
    /* margin-left: 60%; */
    /* margin-top: 6vh; */
    border: none;
    border-radius: 15px;
    padding: unset;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
    cursor: pointer;
}
@media (min-width: 769px) {
    .signup-page {
        background-color: white; 
    }
    .signup-page .mamiyoga-header {
        width: 450px;
    }
    .btn-login-and-signup-container {
        padding-bottom: 15vh;
    }
}
@media (max-width: 830px) and (min-width: 768px) and (orientation:landscape) {
    .signup-form {
        width: 450px;
        background-color:white; 
    }
    .btn-login-and-signup-container {
        padding-bottom: 15vh;
    }
}
@media (max-width: 769px) and  (orientation:landscape) {
    .signup-page {
        min-height: 100vh;
    }
    .btn-login-and-signup-container {
        padding-bottom: 15vh;
    }
}
</style>