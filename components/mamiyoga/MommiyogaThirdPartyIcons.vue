<template>
    <div class="third-party-login">
        <!-- <a href="/"><img v-if="login_method.FB" src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/login-icon-facebook.svg" @click.prevent="handleFBClick" /></a>
        <a href="/"><img v-if="login_method.google" src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/login-icon-google.svg" @click.prevent="handleGoogleClick"/></a>
        <a href="/"><img v-if="login_method.line" src="/icon-line.svg" /></a> -->
        <a href=""><img v-if="login_method.FB" src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/mommiyoga-login-page-wechat.png"/></a>
        <a href=""><img v-if="login_method.google" src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/mommiyoga-login-page-qq.png"/></a>
        <a href="/"><img v-if="login_method.line" src="/icon-line.svg" /></a>
    </div>
</template>

<script>
export default {
    props: {
        login_method:Object,
    },
    methods: {
        handleFBClick() {
            
            if (this.$route.path == "/victor/signup") {
                console.log("/victor/signup");
                this.$gtag('event', 'conversion', {
                    'send_to': 'AW-744113367/TiSjCLOMw54BENeJ6eIC',
                    'event_callback': function () {},
                });
                this.$fbq("track","CompleteRegistration");
            }
            
            window.location.href = 'https://api.ludonow.com/auth/facebook?from=' + this.$route.path;
        },
        handleGoogleClick() {
            window.location.href = 'https://api.ludonow.com/auth/google?from=' + this.$route.path;
        }
    }
}
</script>

<style>
.third-party-login{
    margin: auto;
}
.third-party-login img{
    margin: 0px 10px;
}
</style>