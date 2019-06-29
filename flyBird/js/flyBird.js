var wrapGame = document.getElementById("wrapGame");
var headDiv = document.getElementById("head");
var startMenu = document.getElementById("startMenu");
var endMenu = document.getElementById("endMenu");
var currentScore = document.getElementById("currentScore");
var bestScore = document.getElementById("bestScore");
var pipesUL = document.getElementById("pipes");
var birdImg = document.getElementById("bird");
var score = document.getElementById("score");
var grass = document.getElementById("grass");
var gameMusic = document.getElementById("gameMusic");
var bulletMusic = document.getElementById("bullet");
var gameOverMusic = document.getElementById("gameOver");
var birdDownTimer; //小鸟下落的定时器
var birdFlyTimer; //小鸟上升的定时器
var createPipesTimer;//创建管道的定时器

// 开始按钮的点击事件
startMenu.onclick = function(e) {
	var event1 = window.event || e;
	// 1.取消事件冒泡  只执行开始按钮的点击事件，不执行点击wrap的事件
	event1.cancelBubble = true;
	event1.stopPropagation();
	// 2.播放bgm
	gameMusic.play();
	gameMusic.loop = true; //循环播放
	// 3.隐藏开始按钮
	headDiv.style.display = "none";
	startMenu.style.display = "none";
	// 4.显示小鸟，显示分数的图
	birdImg.style.display = "block";
	score.style.display = 'block';
	// 5.草坪移动
	setInterval(grassMove, 30);
	// 6.小鸟落
	birdDownTimer = setInterval(birdDown, 30);
	// 7.小鸟升
	wrapGame.onclick = function() {
		clickBirdUp();
	}
	// 8.创建管道
	setInterval(createPipes,3000);
	// 9.处理碰撞检测
	setInterval(dealCrash,30);
}

function dealCrash(){
	//获取页面中的所有li上下管道，与小鸟检测是否碰撞
	var lis=document.getElementsByClassName("pipe");
	for(var i=0;i<lis.length;i++){
		if(isCrash(birdImg,lis[i].firstElementChild)){
			//碰了，游戏结束
			gameOver();
			console.log("上管道死了");
		}
		if(isCrash(birdImg,lis[i].lastElementChild)){
			//碰了，游戏结束
			gameOver();
			console.log("下管道死了");
		}
	}
}

function isCrash(obj1,obj2){
	// 两个物体碰撞检测的函数 obj1=bird obj2=pipe
	var boolCrash=true;
	var left1=obj1.offsetLeft;
	var right1=obj1.offsetLeft+obj1.offsetWidth;
	var top1=obj1.offsetTop;
	var bottom1=obj1.offsetTop+obj1.offsetHeight;
	// offsetParent父级元素
	var left2=obj2.offsetParent.offsetLeft;
	var right2=obj2.offsetParent.offsetLeft+obj2.offsetWidth;
	var top2=obj2.offsetTop;
	var bottom2=obj2.offsetTop+obj2.offsetHeight;
	
	// 碰撞条件
	// 碰不到的条件 right1<left2||left1>right2
	if(!(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2)){
		// 碰了
		boolCrash=true;
	}else{
		// 没碰
		boolCrash=false;
	}
	return boolCrash;
}

var index = 0;
function grassMove() {
	index += 2;
	if (index >= wrapGame.offsetWidth) {
		index = 0; //切到第一张
	}
	grass.style.left = -index + "px";
}

var speed = 0; //记录小鸟飞的速度
// 小鸟下落
function birdDown() {
	birdImg.src = "img/down_bird1.png";
	speed += 0.5;
	if (speed > 10) {
		speed = 10;
	}
	// 修改位置
	birdImg.style.top = birdImg.offsetTop + speed + "px";
	// 判断是否碰到草坪
	if (birdImg.offsetHeight + birdImg.offsetTop >= pipesUL.offsetHeight) {
		birdImg.src = "img/bird1.png";
		// 碰到，游戏结束
		gameOver();
	}
}
// 小鸟上升
function clickBirdUp() {
	// 播放音乐
	bulletMusic.play();
	// 清除小鸟下降的定时器
	clearInterval(birdDownTimer);
	clearInterval(birdFlyTimer);
	console.log("fly");
	// 处理飞翔的定时器
	speed = 10; //修改速度值,开始上升时速度最快
	birdFlyTimer = setInterval(function() {
		birdImg.src = "img/up_bird1.png"
		speed -= 0.5;
		// 当速度小于或者等于0时，小鸟会重新下落，也就是重新启动小鸟的定时器
		if (speed <= 0) {
			// 清除小鸟上升的定时器
			clearInterval(birdFlyTimer);
			// 重新创建一个下降的定时器
			birdDownTimer = setInterval(birdDown, 30);
		}
		// 修改小鸟的位置
		birdImg.style.top = birdImg.offsetTop - speed + "px";
		// 判断是否碰到顶部
		if (birdImg.offsetTop <= 0) {
			gameOver();
		}
	}, 30);

}

function gameOver() {
	gameMusic.pause();
	gameOverMusic.play();
	// 显示结束菜单
	endMenu.style.display="block";
	endMenu.style.zIndex=2;
	// 清除页面中所有定时器
	//网页加载完成后，创建的所有定时器的id是递增的，只要获取到最后一个定时器的id，
	//就能遍历得到所有的定时器id<,通过id删除对应的定时器即可
	var timeId=setInterval(function(){},1);
	for(var i=1;i<=timeId;i++){
		clearInterval(i);//清除每个id对应的定时器
	}
	currentScore.innerHTML=scoreNum;
	// 
	if(localStorage.bestS){
		// 获取本地存储的最高分和当前的分对比
		localStorage.bestS = localStorage.bestS>scoreNum?localStorage.bestS:scoreNum;
		bestScore.innerHTML=localStorage.bestS;
	}else{
		// first play game
		localStorage.bestS=scoreNum;
		bestScore.innerHTML=scoreNum;
	}
	wrapGame.onclick = null; //清除点击事件
}

// 随机函数
function randomNum(m,n){
	return Math.floor(Math.random()*(n-m+1)+m);
}

// 创建管道的函数
function createPipes(){
	// 创建上下管道所在的li
	var li=document.createElement("li");
	li.className="pipe";
	// 每次创建的li再屏幕右侧
	li.style.left=wrapGame.offsetWidth+"px";
	pipesUL.appendChild(li);
	// 随机上管道的高度
	var top_height=randomNum(80,200);
	// 获取下管道的高度 假设通道口的高度是150
	var bottom_height=li.offsetHeight-200-top_height;
	// 创建上管道
	var topDiv=document.createElement("div");
	topDiv.className="up_pipe";
	topDiv.style.height=top_height+"px";
	li.appendChild(topDiv);
	var bottomDiv=document.createElement("div");
	bottomDiv.className="down_pipe";
	bottomDiv.style.height=bottom_height+"px";
	li.appendChild(bottomDiv);
	// 获取此时li的left值，就是移动距离
	var distance=wrapGame.clientWidth;
	// 让管道移动
	var pipeMoveTimer=setInterval(function(){
		distance-=2;//和草坪移动的速度和距离一致s
		li.style.left=distance+"px";
		// 当创建的li管道移出屏幕时，删除li节点
		if(distance<=-li.offsetWidth){
			// 删除管道
			pipesUL.removeChild(li);
			clearInterval(pipeMoveTimer);
		}
		// 处理得分操作
		if(distance==-3){
			// 小鸟飞过管道
			changeScore();
		}
	},30);
}

var scoreNum=0;
// 处理得分操作
function changeScore(){
	scoreNum++;
	score.innerHTML="";//清空图片内容
	if(scoreNum<10){
		// 一位数
		// 显示一张图
		var img=document.createElement("img");
		img.src="img/"+scoreNum+".jpg";
		score.appendChild(img);
	}else if(scoreNum>=10&&scoreNum<=99){
		// 两位数
		var img1=document.createElement("img");
		img1.src="img/"+ Math.floor(scoreNum/10)+".jpg";
		score.appendChild(img1);
		var img2=document.createElement("img");
		img2.src="img/"+ scoreNum%10+".jpg";
		score.appendChild(img2);
	}
}

