let Interval = null,
    hoverBarrage = false;
const barrage = {
    fetchData(options) {
        fetch('https://twk.anhaoi.top/.netlify/functions/twikoo', {
            method: "POST",
            body: JSON.stringify({
                "event": "GET_RECENT_COMMENTS",
                "accessToken": "9fce3280fa343c1556b102bcb08adcc7",
                "includeReply": true,
                ...options
            }),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(response => {
            let html = '',
                data = response.data;
            let Index = 0,
                box = [],
                dom = document.querySelector('#comment-barrage');

            clearInterval(Interval);
            Interval = null;

            Interval = setInterval(() => {
                if (box.length >= 1 && !hoverBarrage) {
                    removeBarrage(box.shift());
                }
                if(!hoverBarrage){
                    BarrageBox(data[Index]);
                    Index += 1;
                    Index %= data.length;
                }
            }, 5000);
            $("#menu-commentBarrage span").text("关闭热评");
            $("#comment-barrage").hover(function() {
                hoverBarrage = true;
                console.log("热评悬浮");
            }, function() {
                hoverBarrage = false;
                console.log("停止悬浮");
            });

            async function BarrageBox(data){
                // const time = await meuicat.changeTime([data.created]);

                let barrage = document.createElement('div');
                barrage.className = 'comment-barrage-item'
                barrage.innerHTML = `
				<div class="barrageHead">
					<img class="barrageAvatar" src="${data.avatar}"/>
					<div class="barrageNick">${data.nick}</div>
					<div class="barrageTime">评论于${time[0].timeString}</div>
					<a class="comment-barrage-close" href="javascript:rm.switchCommentBarrage()"><i class="iconfont icat-close"></i></a>
				</div>
				<a class="barrageContent" href="javascript:void(0);" onclick="meuicat.scrollTo('${data.id}');">${data.comment}</a>
			`
                box.push(barrage);
                dom.append(barrage);
            }
            function removeBarrage(barrage){
                barrage.className = 'comment-barrage-item out';
                setTimeout(()=>{
                    dom.removeChild(barrage);
                },1000)
            }

            const scrollBarrage = btf.throttle(function(){
                let visibleBottom = window.scrollY + document.documentElement.clientHeight,
                    comment = document.getElementById('post-comment'),
                    centerY = comment.offsetTop+(comment.offsetHeight/2);

                if(document.body.clientWidth > 768){
                    if(centerY > visibleBottom){
                        dom.style.bottom = '40px';
                    } else {
                        dom.style.bottom = '-200px';
                    }
                }
            }, 200)

            document.addEventListener('scroll', scrollBarrage);
            document.addEventListener('pjax:send', function(){
                clearInterval(Interval);
                document.removeEventListener('scroll', scrollBarrage);
            });

        });
    },
    data() {
        this.fetchData({ "urls": [window.location.pathname] });
    }
};

window.DOMReady = function () {
    barrage.data();
};

window.addEventListener("load", DOMReady)
document.addEventListener("pjax:complete", DOMReady)

// 热评弹窗
