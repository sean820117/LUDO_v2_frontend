import axios from 'axios';

var pose_axios = axios.create({
    baseURL: 'http://ec2-18-237-249-229.us-west-2.compute.amazonaws.com:8787',
    withCredentials: 'true',
    timeout: 2000000,
});

function newLudoRTC (options = {}) {
    if (process.client) {
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
        this.dc = null;
        this.video_list = [];

        let default_config = {
            sdpSemantics: 'unified-plan',
            iceServers : [{urls: ['stun:stun.l.google.com:19302']}],
            constraints : {
                // audio: true,
                video: {
                    "mandatory": {
                        "maxWidth": 320,
                        "maxHeight": 240,
                        "maxFrameRate": 30,
                    },
                }
            },
            post_info : {
                pose_id: "yoga_27",
                user_id: "guest",
                language: 'zh-tw',
            },
        };
        this.final_config = Object.assign(default_config,config);
    }

    async openCamera() {
        let constraints = this.final_config.constraints;

        try {
            let stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.stream = stream;
            let video_element = document.getElementById('video');
            if ('srcObject' in video_element) {
                video_element.srcObject = stream
            } else {
                video_element.src = window.URL.createObjectURL(stream)
            }
            video_element.play();
            return true;
        } catch (error) {
            alert('Could not acquire media: ' + err);
            return false;
        }
        
    }

    async startRecording(post_info = {}) {
        if (post_info.length > 0) {
            this.final_config.post_info = post_info;
        }
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
            if (pc.getTransceivers) {
                pc.getTransceivers().forEach(function(transceiver) {
                    if (transceiver.stop) {
                        transceiver.stop();
                    }
                });
            }
        
            // close local audio / video
            // pc.getSenders().forEach(function(sender) {
            //     sender.track.stop();
            // });
        
            // close peer connection
            setTimeout(function() {
                pc.close();
            }, 500);
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
}

export default ({ app }, inject) => {
    inject('newLudoRTC', newLudoRTC);
}