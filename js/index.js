function getId(id) {
	return document.getElementById(id);
};


//我的id
var myid = null;

//聊天记录
var record = {
	// mao:[{
	// 	id: "myid",
	// 	message:"我说",
	// },
	// {
	// 	id:"mao",
	// 	message:"你说"
	// }]
}

//添加好友列表方法
function createFriedList(rosterName) {
	var li = document.createElement("li");
	li.dataset.id = rosterName;
	//li.className = rosterName;
	var str =`<div class="hreatimg"></div>
						<div class="mlname">
							<h3>${rosterName}</h3>
							<p></p>
						</div>
						<i class="redspot"></i>`;
	li.innerHTML = str;
	li.onclick = addListEvent;
	
	return li;
};

//创建链接
var connection = new WebIM.connection({
	url: WebIM.config.xmppURL
});


var applyid = null;

//创建事件监听
connection.listen({
	onOpened: function(message) { //连接成功回调
		// 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
		// 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
		// 则无需调用conn.setPresence();

		console.log("成功登录");
		console.log("成功登录=======>", message);

		//获取好友列表
		connection.getRoster({
			success: function(roster) {
				//获取好友列表，并进行好友列表渲染，roster格式为：
				/** [
				      {
				        jid:'asemoemo#chatdemoui_test1@easemob.com',
				        name:'test1',
				        subscription: 'both'
				      }
				    ]
				*/
				var fragment = document.createDocumentFragment();
				for (var i = 0, l = roster.length; i < l; i++) {
					var ros = roster[i];
					//ros.subscription值为both/to为要显示的联系人，此处与APP需保持一致，才能保证两个客户端登录后的好友列表一致
					if (ros.subscription === 'both' || ros.subscription === 'to') {
						var li = createFriedList(ros.name);
						fragment.appendChild(li);
					}
				}
				document.querySelector(".main_left>ul").appendChild(fragment);
			},

		})
	},



	// onPresence: function ( message ) {},      
	//收到联系人订阅请求、处理群组、聊天室被踢解散等消息
	onPresence: function(e) {

		if (e.type === 'subscribe') {
			//若e.status中含有[resp:true],则表示为对方同意好友后反向添加自己为好友的消息，
			//demo中发现此类消息，默认同意操作，完成双方互为好友；如果不含有[resp:true]，
			//则表示为正常的对方请求添加自己为好友的申请消息。
			console.log("e=========>", e);
			getId("addfrom").textContent = e.from;
			getId("addstatus").textContent = e.status;
			document.querySelector(".haoyouqingqiu").style.display = "block";
			applyid = e.from;
		}

		//(发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
		if (e.type === 'subscribed') {
		
			document.querySelector(".main_left>ul").appendChild(createFriedList(e.from));
		}

		//（发送者取消订阅另一个实体的出席信息）,即删除现有好友
		if (e.type === 'unsubscribe') {

		}

		//（订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
		if (e.type === 'unsubscribed') {

		}

	},
	
	//收到文本消息
    onTextMessage: function (message) {
        // 当为WebIM添加了Emoji属性后，若发送的消息含WebIM.Emoji里特定的字符串，connection就会自动将
        // 这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为{type: 'emoji(或者txt)', data:''}
        // 当type='emoji'时，data表示表情图像的路径，当type='txt'时，data表示文本消息
        //文本消息内容
		var data = message.data;
		//消息发送者id
		var fromId = message.from;
		var theMes ={
			id: fromId,
			message: data
		}
		if(record[fromId]){
			record[fromId].push(theMes);
		}else{
			record[fromId]=[];
			record[fromId].push(theMes);
		}
		
		// console.log("消息对象=====>",record);
		// 
		// console.log("message====>",message);
		//显示信息
		// console.log("?????????????????????????????????????")
		
		// console.log("lis.dataset.id====",lis);
		// console.log("lis.dataset.id====",lis.dataset.id);
		// console.log("fromid=======",fromId);
		var lis = document.querySelector(".main_left>ul>.active");
		if(lis.dataset.id == fromId){
			var li = document.createElement("li");
			var str = `<li class="leftchat">
							<i></i>
							<b></b>
							<div>${data}</div>
						</li>`
			li.innerHTML = str;
			getId("chatbox").appendChild(li);
			
		}else{
			console.log("????");
			var test = document.querySelector(".main_left>ul>."+fromId);
			console.log(test);
			test.querySelector(".redspot").style.display = "block";
		}
    },   //收到表情消息

	// onClosed: function ( message ) {},         //连接关闭回调
	
	// onEmojiMessage: function ( message ) {},   //收到表情消息
	// onPictureMessage: function ( message ) {}, //收到图片消息
	// onCmdMessage: function ( message ) {},     //收到命令消息
	// onAudioMessage: function ( message ) {},   //收到音频消息
	// onLocationMessage: function ( message ) {},//收到位置消息
	// onFileMessage: function ( message ) {},    //收到文件消息
	// onVideoMessage: function (message) {
	//     var node = document.getElementById('privateVideo');
	//     var option = {
	//         url: message.url,
	//         headers: {
	//           'Accept': 'audio/mp4'
	//         },
	//         onFileDownloadComplete: function (response) {
	//             var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
	//             node.src = objectURL;
	//         },
	//         onFileDownloadError: function () {
	//             console.log('File down load error.')
	//         }
	//     };
	//     WebIM.utils.download.call(conn, option);
	// },   //收到视频消息
	// onRoster: function ( message ) {},         //处理好友申请
	// onInviteMessage: function ( message ) {},  //处理群组邀请
	// onOnline: function () {},                  //本机网络连接成功
	// onOffline: function () {},                 //本机网络掉线
	// onError: function ( message ) {},          //失败回调
	// onBlacklistUpdate: function (list) {       //黑名单变动
	//     // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
	//     console.log(list);
	// }
});

//添加好友列表事件
function addListEvent(){
	var lis = document.querySelectorAll(".main_left>ul>li");
	if(this.className == "active"){
		return;
	}
	
	var li = document.querySelector(".active");
	if(li){
		li.className = "";
	}
	this.className = "active";
	document.getElementsByClassName("main_right")[0].style.display = "block";
	
	var activeId = this.dataset.id;
	getId("chatbox").innerHTML = "";
	if(record[activeId]){
		var re = record[activeId];
		var farmat = document.createDocumentFragment();
		for(var i = 0; i<re.length;i++){
			if(re[i].id==myid){
				var li = document.createElement("li");
				var str = `<li class="rightchat clearfix">
								<i></i>
								<div>${re[i].message}</div>
								<b></b>
							</li>`;
				li.innerHTML = str;
				farmat.appendChild(li);
			}else{
				
				var li = document.createElement("li");
				var str = `<li class="leftchat">
									<i></i>
									<b></b>
									<div>${re[i].message}</div>
								</li>`
				li.innerHTML = str;
				farmat.appendChild(li);
			}
		}
		getId("chatbox").appendChild(farmat);
	}
	
	//console.log("ddddddddddd",activeId);
	

}




window.onload = function() {
	var zhuceym = getId("zhuceym");
	var zhuyem = getId("mianym");
	var dengluym = getId("dengluym");

	getId("qhdenglu").onclick = function() {
		zhuceym.style.display = "none";
		dengluym.style.display = "block";
	}
	getId("qhzhuce").onclick = function() {
		zhuceym.style.display = "block";
		dengluym.style.display = "none";
	}

	getId("tjhaoyou").onclick = function() {
		document.getElementsByClassName("tianjiahaoyou")[0].style.display = "block";
	};
	getId("tjqx").onclick = function() {
		document.getElementsByClassName("tianjiahaoyou")[0].style.display = "none";
	};
	//添加好友
	getId("addFriends").onclick = function() {

		connection.subscribe({
			to: getId("addnum").value,
			// Demo里面接收方没有展现出来这个message，在status字段里面
			message: getId("addmsm").value,

		});
		document.getElementsByClassName("tianjiahaoyou")[0].style.display = "none";
	};

	//同意申请请求
	getId("agreeadd").onclick = function() {
		connection.subscribed({
			to: applyid,
			message: '[resp:true]',
		});
		document.querySelector(".haoyouqingqiu").style.display = "none";
	};
	//拒绝申请请求
	getId("unagreeadd").onclick = function() {
		connection.unsubscribed({
			to: applyid,
			message: 'rejectAddFriend'
		});
		document.querySelector(".haoyouqingqiu").style.display = "none";
	};


	// 注册

	getId('qlijizc').onclick = function() {

		var self = this;
		connection.registerUser({

			//用户名，登录名
			username: getId("username").value,

			//密码
			password: getId("mima").value,

			//匿名
			nickname: getId("nickname").value,

			//应用密钥
			appKey: WebIM.config.appkey,

			//注册成功
			success: function(data) {

				console.log('data ==> ', data);

				self.textContent = '注册';

				//显示登录
				zhuceym.style.display = "none";
				dengluym.style.display = "block";
			},

			//注册失败
			error: function() {
				self.textContent = '注册';
			},

			//请求地址
			apiUrl: WebIM.config.apiURL
		});

	}

	//登录
	getId("btdenglu").onclick = function() {
		var self = this;

		//修改按钮文本
		this.textContent = '登录中...';

		var username = document.getElementsByClassName("zhanghao")[0].value;
		var pwd = document.getElementsByClassName("passwd")[0].value;

		//用户登录
		connection.open({
			//请求地址
			apiUrl: WebIM.config.apiURL,

			//用户名
			user: username,

			//密码
			pwd: pwd,

			//应用密钥
			appKey: WebIM.config.appkey,

			//登录成功执行
			success: function(data) {

				console.log('data ==> ', data);
				this.textContent = '登录';

				//隐藏登录
				dengluym.style.display = "none";
				zhuyem.style.display = "block";

				//保存我的id
				myid = data.user.username;
			},

			//登录失败
			error: function() {
				self.textContent = '登录';
			}

		});
	};

//发送消息

getId("fasong").onclick = function () {
    var id = connection.getUniqueId();                 // 生成本地消息id
	var msg = new WebIM.message('txt', id);      // 创建文本消息
    var sendMsg  = getId("input-content").innerHTML;
	getId("input-content").innerHTML = "";
	var toid = document.querySelector(".main_left>ul>.active>.mlname>h3").innerHTML;
	//console.log(toid);
	msg.set({
        msg: sendMsg,                  // 消息内容
        to: toid,                          // 接收消息对象（用户id）
        roomType: false,
        success: function (id, serverMsgId) {
			
			//存放消息内容到消息里
			//console.log(toid);
			var theMes ={
				id: myid,
				message: sendMsg
			}
			if(record[toid]){
				record[toid].push(theMes);
			}else{
				record[toid]=[];
				record[toid].push(theMes);
			}
			
			console.log("消息对象=====>",record);
			
			
			
            //console.log(id,serverMsgId);
			//显示发送的信息
			var li = document.createElement("li");
			var str = `<li class="rightchat clearfix">
							<i></i>
							<div>${sendMsg}</div>
							<b></b>
						</li>`;
			li.innerHTML = str;
			 getId("chatbox").appendChild(li);
			
        }
    });
    msg.body.chatType = 'singleChat';
    connection.send(msg.body);
};

}
