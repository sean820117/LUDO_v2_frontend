import axios from 'axios';

var pose_axios = axios.create({
    // baseURL: 'https://pose.ludonow.com:8787',
    baseURL: 'http://52.156.42.134:8787',
    withCredentials: 'true',
    timeout: 2000000,
});

var api_axios = axios.create({
    baseURL: 'https://api.ludonow.com',
    withCredentials: 'true',
    timeout: 2000000,
});

function newLudoRTC (options = {}) {
    if (process.client) {
        if (options.dev) {
            pose_axios = axios.create({
                baseURL: 'https://pose-dev2.ludonow.com',
                // baseURL: 'https://pose-dev.ludonow.com:8787',
                withCredentials: 'true',
                timeout: 2000000,
            });
        }
        return new LudoRTC(options);
    } else {
        return null;
    }
}

class LudoRTC {
    constructor(config = {}) {
        this.negotiate = this.negotiate.bind(this);
        this.createPeerConnection = this.createPeerConnection.bind(this);
        this.waitForICE = this.waitForICE.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.getResult = this.getResult.bind(this);
        this.getFinalConnectionStatus = this.getFinalConnectionStatus.bind(this);
        this.dc = null;
        this.pc = null;
        this.video_list = [];
        this.default_width = 640;
        this.width = this.default_width;
        this.aspectRatio = 1.778;
        this.orientation = 'landscape';
        // let default_height = 480;
        
        let default_config = {
            sdpSemantics: 'unified-plan',
            iceServers : [{urls: ['stun:stun.l.google.com:19302']}],
            constraints : {
                audio: false,
                video: {
                    width:this.default_width,
                    // height:default_height,
                    aspectRatio: this.aspectRatio,
                    frameRate: 30,
                    // facingMode: { exact: "environment" },
                    facingMode: "environment",
                }
            },
            video_element_id:'#video',
            post_info : {
                pose_id: "yoga_27",
                user_id: "guest",
                language: 'zh-tw',
            },
            should_be_rotated: true,
        };
        this.final_config = Object.assign(default_config,config);
    }

    async getFinalConnectionStatus() {
        for (let index = 0; index < 30; index++) {
            if (this.pc.iceConnectionState != "checking") {
                break
            }
            await this.delay(1000)
        }
        console.log("test : " + this.pc.iceConnectionState)
        return this.pc.iceConnectionState == "connected" || false
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    async openCamera() {
        let constraints = this.final_config.constraints;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('無法開啟相機，請使用瀏覽器開啟此頁面！');
            // console.log(error);
        }
        try {
            let stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.stream = stream;
            let video_element = document.querySelector(this.final_config.video_element_id);
            if ('srcObject' in video_element) {
                video_element.srcObject = stream
            } else {
                video_element.src = window.URL.createObjectURL(stream)
            }
            video_element.play();
            return true;
        } catch (error) {
            // this.$errorLogger('ludoRTC','openCamera',error.toString());
            alert('無法開啟相機，請複製網址後貼上瀏覽器開啟此頁面');
            console.log(error);
            return false;
        }
        
    }

    async startRecording(post_info = {}) {
        if (post_info) {
            this.final_config.post_info = post_info;
        }
        let mal = window.matchMedia('(orientation: portrait)')
        if(!mal.matches){
            this.orientation = 'landscape';
        } else {
            if (this.final_config.should_be_rotated == true) {
                this.orientation = 'portrait';
            } else {
                this.orientation = 'landscape';
                this.width = parseInt(this.width/this.aspectRatio)+1;
                this.aspectRatio = 1 / this.aspectRatio;
            }
        }
        // console.log('orientation : ',post_info.orientation)
        console.log(this.final_config);
        this.pc = this.createPeerConnection(this.final_config);
        let pc = this.pc;
        // data channel        
        let dc = pc.createDataChannel('chat', {ordered:true});
        this.dc = dc;
        let video_list = this.video_list;

        dc.onclose = function() {
        };
        dc.onopen = function() {
            dc.send('get_video_name');
        };
        dc.onmessage = function(evt) {
            video_list.push(evt.data);
            console.log(video_list);
        };

        let stream = this.stream;
        stream.getTracks().forEach(function(track) {
            console.log('add track to pc')
            pc.addTrack(track, stream);
        });
        await this.negotiate();
    }

    createPeerConnection() {
        let pc = new RTCPeerConnection(this.final_config);
        
        // register some listeners to help debugging
        pc.addEventListener('icegatheringstatechange', function() {
            console.log('pc.iceGatheringState' + pc.iceGatheringState);
        }, false);
    
        pc.addEventListener('iceconnectionstatechange', function() {
            console.log('pc.iceConnectionState' + pc.iceConnectionState);
        }, false);
    
        pc.addEventListener('signalingstatechange', function() {
            console.log('pc.signalingState' + pc.signalingState);
        }, false);

        // pc.ontrack = function(evt) {
        //     if (evt.track.kind == 'video') {
        //         document.getElementById('video').srcObject = evt.streams[0];
        //     } else {
        //         console.log('get track audio')
        //     }
        // }
        console.log('create pc ')
        return pc;
    }

    waitForICE() {
        var pc = this.pc;
        return new Promise(function(resolve) {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                function checkState() {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                }
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });
    }

    async negotiate() {
        try {
            let post_info = this.final_config.post_info;
            let offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);
            await this.waitForICE();

            offer = this.pc.localDescription;
            let res = await pose_axios.post('/offer',JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
                pose_id: post_info.pose_id,
                user_id: post_info.user_id,
                language: post_info.language,
                width:this.width,
                aspectRatio: this.aspectRatio,
                orientation: this.orientation,
            }));
            await this.pc.setRemoteDescription(res.data);
            return true;
        } catch (error) {
            console.log(error);
            return  false;
        }
    }

    stopRecording() {
        try {
            let pc = this.pc;
            let dc = this.dc;
            if (dc) {
                dc.close();
            }
            // close transceivers
            if (pc && pc.getTransceivers) {
                pc.getTransceivers().forEach(function(transceiver) {
                    if (transceiver.stop) {
                        transceiver.stop();
                    }
                });
                setTimeout(function() {
                    pc.close();
                }, 500);
            }
            
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    closeCamera() {
        // 停止所有的輸入或輸出的串流裝置（例如，關攝影機）
        this.stream.getTracks().forEach(function (track) {
            track.stop()    
        });
    }

    async getResult() {
        var total_score = 0;
        let post_info = this.final_config.post_info;
        for (let index = 0; index < this.video_list.length; index++) {
            const video_file_name = this.video_list[index];
            try {
                let response = await api_axios.post('/apis/get-pose-result',{user_id:post_info.user_id,pose_id:post_info.pose_id,file_name:video_file_name})
                if (response.data.result.status == 200) {
                    total_score += parseInt(response.data.result.score)
                } else if(response.data.result.status == 102) { 
                    total_score += 30
                    total_score += parseInt(Math.random(6) * 20)
                } else if(response.data.result.status == 204) {
                    total_score += parseInt(response.data.result.score)
                } else if(response.data.result.status == 404){
                    total_score += 30
                    total_score += parseInt(Math.random(6) * 20)
                } else {
                    total_score += 30
                    total_score += parseInt(Math.random(6) * 20)
                }
            } catch (error) {
                console.error(error)
                total_score += 30
                total_score += parseInt(Math.random(6) * 20)
            }
        }
        return total_score / this.video_list.length;
    }

    async getDetailResult() {
        var total_score = 0;
        let post_info = this.final_config.post_info;
        let detail_results = []
        for (let index = 0; index < this.video_list.length; index++) {
            const video_file_name = this.video_list[index];
            try {
                let response = await api_axios.post('/apis/get-pose-result',{user_id:post_info.user_id,pose_id:post_info.pose_id,file_name:video_file_name})
                detail_results.push(response.data.result)
            } catch (error) {
                console.error(error)
                total_score += 30
                total_score += parseInt(Math.random(6) * 20)
                detail_results.push({error_code: 500});
            }
        }
        return detail_results[0];
    }

    getVideoList() {
        return this.video_list;
    }

    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }
      
    isiOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
      
    isMobile() {
        return isAndroid() || isiOS();
    }
}
export default ({ app }, inject) => {
    inject('newLudoRTC', newLudoRTC);
}