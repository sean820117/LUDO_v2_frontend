<template>
    <div>
        <!--video用於顯示媒體裝置的視訊流，自動播放-->
        <video id="video" autoplay style="width: 480px;height: 320px"></video>
        <!--拍照按鈕-->
        <div>
            <button id="capture">拍照</button>
        </div>
        <!--描繪video截圖-->
        <canvas id="canvas" width="480" height="320"></canvas>
    </div>
</template>

<script>
export default {
    // mounted() {
    //     if (process.client) {
    //         function getUserMedia(constrains,success,error){
    //             if(navigator.mediaDevices.getUserMedia){
    //             //最新標準API
    //             navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
    //             } else if (navigator.webkitGetUserMedia){
    //             //webkit核心瀏覽器
    //             navigator.webkitGetUserMedia(constrains).then(success).catch(error);
    //             } else if (navigator.mozGetUserMedia){
    //             //Firefox瀏覽器
    //             navagator.mozGetUserMedia(constrains).then(success).catch(error);
    //             } else if (navigator.getUserMedia){
    //             //舊版API
    //             navigator.getUserMedia(constrains).then(success).catch(error);
    //             }
    //         }
    //         var video = document.getElementById("video");
    //         var canvas = document.getElementById("canvas");
    //         var context = canvas.getContext("2d");
    //         //成功的回撥函式
    //         function success(stream){
    //             //相容webkit核心瀏覽器
    //             var CompatibleURL = window.URL || window.webkitURL;
    //             //將視訊流設定為video元素的源
    //             // video.src = CompatibleURL.createObjectURL(stream);
    //             video.srcObject=stream;
    //             //播放視訊
    //             video.play();
    //         }
    //         //異常的回撥函式
    //         function error(error){
    //             console.log("訪問使用者媒體裝置失敗：",error.name,error.message);
    //         }
    //         if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia){
    //             //呼叫使用者媒體裝置，訪問攝像頭
    //             getUserMedia({
    //                 video:{width:480,height:320}
    //             },success,error);
    //         } else {
    //             alert("你的瀏覽器不支援訪問使用者媒體裝置");
    //         }
    //         //註冊拍照按鈕的單擊事件
    //         document.getElementById("capture").addEventListener("click",function(){
    //             //繪製畫面
    //             context.drawImage(video,0,0,480,320);
    //         });
    //     }
    // },
}
</script>

<style>

</style>
