<template>
    <!-- header -->
    <div class="header" :style="{background: bgColor}">
        <div class="header-wrapper" :style="{background: bgColor}">
			<router-link to="/go2university">
				<!-- logo -->
				<img class="header-logo" :src="HeaderLogo" alt="ludo-header-logo">
			</router-link>
			<div class="troggle" >
				<div class="line" :style="{background: color}"></div>
				<div class="line" :style="{background: color}"></div>
				<div class="line" :style="{background: color}"></div>	
			</div>

			<!-- menu -->
			<!-- <a href="" class="header-menu-item">Features</a>
			<a href="" class="header-menu-item">Explore</a>
			<a href="" class="header-menu-item">Templates</a> -->
			<!-- <router-link to="/confirm" class="header-menu-item">購買序號</router-link> -->
			
			<a v-if="$route.path == '/go2university' " href="#all-course" class="header-menu-item">課程兌換</a>
			<router-link v-else to="/go2university#all-course"  class="header-menu-item">課程兌換</router-link>
			
			<a href="https://m.me/2018930911516278?ref=9aB25EjxH" class="header-menu-item">聯絡我們</a>
		</div>
                
            <!-- login -->
            <router-link v-if="!user.user_id" to="/login" class="login-btn" :style="{color: color,borderColor:color}">Login</router-link>
			<router-link v-else to="/logout" class="login-btn" :style="{color: color,borderColor:color}">登出</router-link>
    </div>
</template>

<script>
import HeaderLogo from 'static/header-logo.png'
import { mapMutations, mapGetters } from 'vuex';
import Vuex from 'vuex';

export default {
    data:() => ({
        HeaderLogo: HeaderLogo,
	}),
	computed: mapGetters({
      user : 'user/getData',
	}),	
	created() {
		if (!process.server) {
			this.$checkLogin(this.$store);
		}
	},
	props: {
		bgColor:String,
		color:String,
    },
}
</script>

<style>
@media (min-width:900px) {
	/*header*/
	.header{
		position: fixed !important;
		width: 100vw;
		height: 80px;
		background-color: white;
		/*margin: 15px;*/
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		z-index: 1;
	}
	.header-wrapper{
		position: relative;
		display: flex;
		width: 80%;
		align-items: center;
	}
	/*logo*/
	.header-logo{
		position: relative;
		display: flex;
		height:35px;
		margin-right: 25px; 

		animation:
		logoin 0.5s 0.5s both;
	}

	@keyframes logoin{
		0%{
			opacity: 0;
		}
		100%{
			opacity: 1;
		}
	}
	/*.header-menu-item:hover{
		border-bottom: 2px solid grey;
		text-align: center;
	}*/

	/*menu*/
	.header-menu-item{
		/*margin-top: 8px;*/
		margin-left: 18px;
		margin-right: 18px;
		position: relative;
		text-decoration: none;
		font-weight: 50;
		font-size: 14px;
		color: grey;
		display: block;

		transition: all 0.2s;
		transition-timing-function: ease;

		animation: 
		menuin 1s 0.6s both;
	}
	.header-menu-item-contact{
		/*margin-top: 3px;*/
		margin-left: 15px;
		/*margin-right: 18px;*/
		position: relative;
		background-color: grey;
		width: 90px;
		height: 25px;
		border: 2px solid grey;
		border-radius: 50px;
		text-decoration: none;
		text-align: center;
		line-height: 25px;
		color: white;
		font-size: 13px;
		font-weight: 50;
		display: block;

		transition: all 0.2s;
		transition-timing-function: ease;

		animation: 
		menuin 1s 0.6s both;
	}
	@keyframes menuin{
		0%{
			transform: translate(80%,0);
			opacity: 0;
		}
		40%{
			opacity: 1;
		}
		100%{
			transform: translate(0,0);
		}
	}
	.header-menu-item-contact:hover{
		background-color: orange;
		border: 2px solid orange;
		color: white;
	}
	.header-menu-item-contact:active{
		background-color: orange;
		border: 2px solid orange;
		color: white;
	}
	.header-menu-item:hover{
		color: orange;
	}
	.header-menu-item:active{
		color: black;
	}

	/*登入按鈕*/
	.login-btn{
		position: relative;
		display: inline-block;
		text-decoration: none;
		text-align: center;
		line-height: 33px;
		background-color: transparent;
		width: 100px;
		height: 35px; 
		font-size: 15px;
		/* font-weight: 50; */
		color: grey;
		/* border: 2px solid grey; */
		border-radius: 50px;

		transition: all 0.2s;
		transition-timing-function: ease;

		animation: 
		loginin 1s 0.6s both;

	}
	@keyframes loginin{
		0%{
			transform: translate(80%,0);
			opacity: 0;
		}
		100%{
			transform: translate(0,0);
			opacity: 1;
		}
	}
	.login-btn:hover{
		background-color: orange;
		border: 2px solid orange;
		color: white;
	}
}
@media (max-width:899px) {
	/*header*/
	.header{
		position: fixed;
		width: 100vw;
		height: 60px;
		background-color: #fff;
		/*margin: 15px;*/
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		z-index: 1;
	}
	.header-wrapper{
		position: absolute;
		display: flex;
		width: 85%;
		/*align-items: center;*/
		/*margin-top: -22px;*/

		/*水平置中*/
		display: flex;
		justify-content: center;
		flex-direction: column;
		/*align-items: left;*/
		/*水平置中*/
	}
	/*logo*/
	.header-logo{
		position: relative;
		display: flex;
		height:25px;
		/*top: 30%;*/
		/*right:0;*/
		/*margin-right: 25px; */

		animation:
		logoin 0.5s 0.5s both;
	}

	@keyframes logoin{
		0%{
			opacity: 0;
		}
		100%{
			opacity: 1;
		}
	}
	.troggle{
		position: absolute;
		/*display: flex;*/
		top: 30%;
		right: 0;
		width: 25px;
		height: 25px;

		/*垂直*/
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		/*垂直*/
	}
	.line{
		position: relative;
		width: 25px;
		height: 2px;
		border-radius: 50px;
		background-color: #324D5B;
		margin: 3px;
	}

	/*登入按鈕*/
	.login-btn{
		/* display: none; */
		position: relative;
		display: inline-block;
		text-decoration: none;
		text-align: center;
		line-height: 33px;
		background-color: transparent;
		width: 100px;
		height: 35px; 
		font-size: 15px;
		font-weight: 50;
		color: grey;
		border: 2px solid grey;
		border-radius: 50px;

		transition: all 0.2s;
		transition-timing-function: ease;

		margin-left: 68%;

		animation: 
		loginin 1s 0.6s both;

	}
	@keyframes loginin{
		0%{
			transform: translate(80%,0);
			opacity: 0;
		}
		100%{
			transform: translate(0,0);
			opacity: 1;
		}
	}
	.login-btn:hover{
		background-color: orange;
		border: 2px solid orange;
		color: white;
	}
	.cover-photo-text-btn2{
		display: none;
	}
	.header-menu-item{
		display: none;
	}
	.troggle{
		display: none;
	}
	.header-menu-item-contact{
		display: none;
	}
}
</style>
