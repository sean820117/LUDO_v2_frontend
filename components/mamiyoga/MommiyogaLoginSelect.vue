<template>
    <div class="mamiyoga-select-login">
        <p>其他登录方式</p>
        <div class="mamiyoga-select-login-box">
            <div class="mamiyoga-select-login-icon">
                <img src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/intro-icon-wechat.png" alt="">
            </div>
            <div class="mamiyoga-select-login-icon">
                <img src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/intro-icon-qq.png" alt="">
            </div>
            <div class="mamiyoga-select-login-icon">
                <img src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/intro-icon-weibo.png" alt="">
            </div>
            <div class="mamiyoga-select-login-icon">
                <img src="https://ludo-beta.s3-ap-southeast-1.amazonaws.com/static/mommiyoga/intro-icon-more.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.mamiyoga-select-login {
    width: 70vw;
    height: 80px;
    /* background: red; */
    margin: 10px auto;
}
.mamiyoga-select-login p {
    font-size: 12px;
    text-align: center;
    color: #DCD8CF;
    margin-bottom: 5px;
}
.mamiyoga-select-login-box {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    /* background-color:green;  */
}
.mamiyoga-select-login-icon {
    float: left;
    /* width: 20%;
    height: 100%;
    margin: 0 2.5%; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: white; */
    cursor: pointer;
}
@media (min-width: 769px) {
    .mamiyoga-select-login {
        width: 60%;
        height: 80px;
        /* background: red; */
        margin: 10px auto;
    }
    .mamiyoga-select-login p {
        font-size: 12px;
        text-align: center;
        color: #DCD8CF;
        margin-bottom: 5px;
    }
    .mamiyoga-select-login-box {
        width: 100%;
        height: 50px;
        /* background-color:green;  */
    }
    .mamiyoga-select-login-icon {
        float: left;
        width: 20%;
        height: 100%;
        margin: 0 2.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        /* background: white; */
    }
}
</style>
