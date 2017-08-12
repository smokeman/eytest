var weChat = require("wechat");
var config = require("./../../config");
var os = require("./../os/");
var request = require("request");
request = request.defaults({jar: true});
var handler = weChat(config.wechat, weChat.text(function (info, req, res, next) {
    var content = info.Content;
    if (/约/.test(content)) {
        res.reply({
            content: '约你妹呀！',
            type: 'text'
        });
    } else if (/图/.test(content) || /8/.test(content)) {
        res.reply([
            {
                title: '菇凉我的靓照!',
                description: '女神嫁到',
                picurl: 'http://picview01.baomihua.com/photos/20120119/m_14_634626046352187500_36036466.jpg',
                url: 'http://weibo.com/fengjieluoyufeng?c=spr_qdhz_bd_baidusmt_weibo_s&nick=%E7%BD%97%E7%8E%89%E5%87%A4'
            }
        ]);
    } else if (/1/.test(content)) {
        request('http://114.215.159.50:2014/detail/random', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var arr = [];
                body = JSON.parse(body);
                body.forEach(function (item, index) {
                    var obj = {
                        title: (index === 0 ? '美图秀' : '美图' + index),
                        description: '女神图片',
                        picurl: item,
                        url: item
                    };
                    arr.push(obj);
                });
                res.reply(arr.slice(0, 10));
            } else {
                res.send('');
            }
        });

    } else if (/乐/.test(content)) {
        res.reply({
            type: 'music',
            content: {
                title: '来段音乐吧',
                description: '好听的轻音乐',
                musicUrl: 'http://114.215.159.50:7000/%E7%BA%AF%E9%9F%B3%E4%B9%90%20-%20%E6%82%A0%E4%B9%85%E3%81%AE%E6%99%82.mp3',
                hqMusicUrl: 'http://114.215.159.50:7000/%E7%BA%AF%E9%9F%B3%E4%B9%90%20-%20%E6%82%A0%E4%B9%85%E3%81%AE%E6%99%82.mp3',
                thumbMediaId: 'thisThumbMediaId'
            }
        });
    } else if (/系统/.test(content)) {
        var attr = os.getOsInfo();
        var content = 'type:' + attr.type + '\r\n' + 'platform:' + attr.platform + '\r\n' + 'arch:' + attr.arch + '\r\n'
          + 'release:' + attr.release + '\r\n' + 'hostname:' + attr.hostname;

        res.reply({
            content: content,
            type: 'text'
        });

    } else if (/内存/.test(content)) {
        var attr = os.getMemInfo();
        var content = '总内存:' + attr.total + '\r\n' + '剩余内存:' + attr.free + '\r\n' + '使用率:' + attr.usePercent + '%';
        res.reply({
            content: content,
            type: 'text'
        });
    }  else if (/2/.test(content)) {
        var name = content.split('2')[1];
        console.log("name\n", name);
        var url1 = 'http://114.215.159.50:1400/artist/find?name=' + name;
        console.log("url1\n", url1);
        request(url1, function (error, response, body) {
            body = JSON.parse(body);
            var uid = parseInt(body.uid);
            console.log("uid\n", uid);
            var url2 = 'http://114.215.159.50:1400/artist/getArtistPics?uid=' + uid;
            console.log("url2\n", url2);
            request(url2, function (error, resposne, pics) {
                if (error) {
                    console.log("error\n", error);
                    return res.send('');
                }
                console.log("pics\n", pics);
                var arr = [];
                var items = JSON.parse(pics);
                console.log("items\n", items);
                items.forEach(function (item, index) {
                    var obj = {
                        description: body.name,
                        title: (index >= body.popMusic.length ? body.name : body.popMusic[index].name),
                        picurl: item.src,
                        url: item.src
                    };
                    arr.push(obj);
                });
                res.reply(arr.slice(0, 10));
            });
        });
    } else {
        res.reply({
            content: '收到,收到, 但我不知道',
            type: 'text'
        });
    }
}).image(function (image, req, res, next) {
    console.log("image\n", image);
    res.send('');
}).voice(function (voice, req, res, next) {
    console.log("voice\n", voice);
    res.send('');
}).video(function (video, req, res, next) {
    console.log("video\n", video);
    res.send('');
}).location(function (location, req, res, next) {
    console.log("location\n", location);
    res.send('');
}).link(function (link, req, res, next) {
    console.log("link\n", link);
    res.send('');
}).event(function (event, req, res, next) {
    console.log("event\n", event);
    switch (event.Event) {
        case 'subscribe':
            res.reply([
                {
                    title: '欢迎加入!!',
                    description: ' 看美图请直接输入: 1 \r\n 看歌手信息请输入: 2 + 歌手名,如: 2成龙\r\n 看凤姐直接按输入: 8',
                    picurl: 'http://lxcdn.dl.files.xiaomi.net/mfsv2/download/s008/p01Z4fiL6J5k/QDICPcIYfmwoUL.jpg?thumb=320x320',
                    url: 'http://weibo.com/fengjieluoyufeng?c=spr_qdhz_bd_baidusmt_weibo_s&nick=%E7%BD%97%E7%8E%89%E5%87%A4'
                }
            ]);
            break;
        case 'unsubscribe':
            res.reply([
                {
                    title: '亲,请不要离开我!!',
                    picurl: 'http://img4.imgtn.bdimg.com/it/u=2328430394,239657648&fm=21&gp=0.jpg',
                    url: 'http://weibo.com/fengjieluoyufeng?c=spr_qdhz_bd_baidusmt_weibo_s&nick=%E7%BD%97%E7%8E%89%E5%87%A4'
                }
            ]);
            break;
        case 'scan':
            res.reply([
                {
                    title: '欢迎加入!!',
                    description: '开启美图之旅',
                    picurl: 'http://lxcdn.dl.files.xiaomi.net/mfsv2/download/s008/p01Z4fiL6J5k/QDICPcIYfmwoUL.jpg?thumb=320x320',
                    url: 'http://weibo.com/fengjieluoyufeng?c=spr_qdhz_bd_baidusmt_weibo_s&nick=%E7%BD%97%E7%8E%89%E5%87%A4'
                }
            ]);
        default :
            res.send('');

    }
}));
module.exports = handler;