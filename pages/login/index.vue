<template>
  <div class="body">
    <page-header></page-header>
    <main class="container">
      <section class="title">
        <h1>登入</h1>
        <p>初次使用？<router-link to="/signup">點此登入</router-link></p>
      </section>
      <div class="row">
        <section class="form col-lg-6 col-sm-12">
          <div class="form-content">
            <text-input name="email" text="Email" v-model="email" />
            <text-input name="password" text="Password" type="password" v-model="password" />
            <div class="error">{{errors}}</div>
            <div>忘記密碼?</div>
            <div @click="smsLogin()" role="button" class="action-button">登入</div>
          </div>
        </section>
        <section class="third-party col-lg-6 col-sm-12">
          <third-party-button platform="fb" />
          <!-- <third-party-button platform="google" /> -->
        </section>
      </div>
    </main>
  </div>
</template>
<script>
import axios from '../../config/axios-config'
import PageHeader from '~/components/confirm/Header.vue'
import TextInput from '~/components/TextInput.vue'
import ThirdPartyButton from '~/components/ThirdPartyButton.vue'
import { EMAIL_REGEX } from '~/components/regex.js'

export default {
  head() {
    return {
      link: [{ rel: "stylesheet", href: "/bootstrap.css" }],
      script: [
        { src: 'https://sdk.accountkit.com/en_US/sdk.js' }
      ],
    };
  },
  data() {
    return {
      errors: null,
      email: '',
      password: '',
    }
  },
  mounted() {
    this.smsInit();
  },
  methods: {
    onSubmit() {
      // @TODO
      if (this.email.length === 0 || this.password.length === 0) {
          this.errors = '請填寫所有欄位！'
          return
      }
      if (!EMAIL_REGEX.test(this.email)) {
          this.errors = '電子信箱格式錯誤'
          return
      }
      if (this.password.length < 8) {
          this.errors = '密碼需大於八個字'
          return
      }
      this.errors = null
      this.login(this.email, this.password)
    },
    async login(email,password) {
        try {
          let response = await axios.post('/login',{email:email,password:password})
          if (response.data.status == '200') {
              console.log("login success")
              console.log(response)
              let login_result = await this.$checkLogin(this.$store);
              this.goBack();
          } else {
              console.log(response)
              this.errors = response.data.message;
          }
        } 
        catch (error) {
          console.log(error)
          this.errors = "傳送失敗，請重新嘗試"
        }
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    smsInit() {
      // initialize Account Kit with CSRF protection
      // AccountKit_OnInteractive = function(){
        AccountKit.init(
          {
            appId:"1075325352502513", 
            state:"test1075325352502513", 
            version:"v1.0",
            fbAppEventsEnabled:true,
            redirect:"https://www.ludonow.com/login?akittest=true"
          }
        );
      // };
    },
    loginCallback(response) {
        if (response.status === "PARTIALLY_AUTHENTICATED") {
          var code = response.code;
          var csrf = response.state;
          // Send code to server to exchange for access token
          console.log("login success: " + code);
        }
        else if (response.status === "NOT_AUTHENTICATED") {
          // handle authentication failure
          console.log("login fail");
          console.log(response);
        }
        else if (response.status === "BAD_PARAMS") {
          // handle bad parameters
          console.log("login wrong");
          console.log(response);
        }
    },
    smsLogin() {
        // var countryCode = document.getElementById("country_code").value;
        // var phoneNumber = document.getElementById("phone_number").value;
        var loginCallback = this.loginCallback;

        AccountKit.login(
          'PHONE', 
          {countryCode: '+886', phoneNumber: '0958007503'}, // will use default values if not specified
          loginCallback
        );
    },
    emailLogin() {
        var emailAddress = document.getElementById("email").value;
        AccountKit.login(
          'EMAIL',
          {emailAddress: emailAddress},
          loginCallback
        );
    },
  },
  components: {
    PageHeader,
    TextInput,
    ThirdPartyButton,
  }
};
</script>
<style scoped>
.body {
  box-sizing: border-box;
  height: 100vh;
}
main {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title {
  margin-bottom: 5%;
}
h1 {
  color: grey;
  text-align: center;
  font-size: 30px;
  font-weight: normal;
}
.title p {
  text-align: center;
}
.title a {
  color: orange;
  text-decoration: underline;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 
}
.form-content {
  width: 80%;
}
.third-party {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.third-party .third-party-button {
  margin: 10px 0;
}
.action-button {
  max-width: 150px;
  margin: 30px auto;
  padding: 10px;
  border-radius: 10px;
  background-color: #E0185D;
  color: white;
  text-align: center;
  cursor: pointer;
}
@media (min-width: 900px) {
  h1 {
    font-size: 60px;
  }
  .action-button {
    margin: 30px 0;
  }
  .action-button:hover {
    transform: translate(0, -5%);
  }
}
</style>
