<template>
    <div>
        <div class="divide-page" v-if="!is_loaded" >
            <mamiyoga-teach-header class="mamiyoga-divide-header" nextTo="/mamiyoga/course1"></mamiyoga-teach-header>
            <h3>骨盆矯正</h3>
            <mamiyoga-divide-video @handleCourseVideoUpload="handleCourseVideoUpload"></mamiyoga-divide-video>
        </div>
        <mamiyoga-assay-video @handleRetryEvent="handleRetryEvent"  @closeAssayWindow="closeAssayWindow" v-if="is_loaded" :video_result="video_result"></mamiyoga-assay-video>
        <div class="vld-parent" >
                <loading :active.sync="isLoading" 
                :can-cancel="true" 
                :is-full-page="fullPage"></loading>
        </div>
    </div>
</template>

<script>
import MamiyogaTeachHeader from '~/components/mamiyoga/MamiyogaTeachHeader.vue';
import MamiyogaDivideVideo from '~/components/mamiyoga/MamiyogaDivideVideo.vue';
import MamiyogaAssayVideo from '~/components/mamiyoga/MamiyogaAssayVideo.vue';
import axios from '~/config/axios-config';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    data:()=>({
        is_loaded: false,
        video_result: {},
        isLoading: false,
        fullPage: true,
    }),
    components:{
        MamiyogaTeachHeader,
        MamiyogaDivideVideo,
        MamiyogaAssayVideo,
        Loading,
    },
    methods:{
        async handleVideoUpload(e) {
            this.isLoading = true;
            let form = new FormData();
            form.append('file',e.target.files[0])
            form.append('pose_id','yoga_6')
            form.append('language','zh-tw')
            const res = await axios.post('/apis/video-upload',form)
            console.log(res.data)
            for(var i =0; i< res.data.reps_wrong_tags.length; i++){
              for(var j = 0; j<res.data.reps_wrong_tags[i].length; j++){
                  if(res.data.reps_wrong_tags[i][j] == "y_6_1") res.data.reps_wrong_tags[i][j] = "膝蓋彎曲";
                  else if (res.data.reps_wrong_tags[i][j] == "y_6_2") res.data.reps_wrong_tags[i][j] = "膝蓋彎曲";
                  else if (res.data.reps_wrong_tags[i][j] == "y_6_3") res.data.reps_wrong_tags[i][j] = "抬腿速度太快";
                  else if (res.data.reps_wrong_tags[i][j] == "y_6_4") res.data.reps_wrong_tags[i][j] = "抬腿速度太快";
                  else if (res.data.reps_wrong_tags[i][j] == "y_6_5") res.data.reps_wrong_tags[i][j] = "軸心不穩";
                  else if (res.data.reps_wrong_tags[i][j] == "correct") res.data.reps_wrong_tags[i][j] = "姿勢正確";
              }
            }
            this.isLoading = false;
            console.log(res.data)
            this.reps_wrong_tags = res.data.reps_wrong_tags;
            this.video_result = res.data;
            this.is_loaded = true;
        },
        handleRetryEvent(e){
            console.log("ok");
            this.is_loaded = false;
            this.handleVideoUpload(e);
        },
        closeAssayWindow(){
            this.is_loaded = false;
        },
        openVideoAssisant(){
            console.log('OK');
            this.showAssisant = true;
        },
        handleCourseVideoUpload(e) {
            this.is_loaded = false;
            console.log('OK');
            this.handleVideoUpload(e);
        }

    }
}
</script>

<style>
@media (max-width: 899px) {
    .divide-page {
        width: 100vw;
        min-height: 100vh;
        background: linear-gradient(#DCD8CF,#E4E7E3,#E4E7E3,#EEEFEA,#EEEFEA,#EEEFEA,#EEEFEA);
    }
    .divide-page h3 {
       font-size: 24px;
        color: #51636F;
        text-align: center;
        font-weight: 400; 
        margin-bottom: 2vh; 
    }
    .mamiyoga-divide-header button {
        display: none;
    }
}
</style>
