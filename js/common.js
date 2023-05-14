let CLICK_ACTION = {
    orderGetCode: function () {
        requestCode();
    },
    orderCheckCode: function () {
        if (getVue().isGetCode) {
            // submitCode();
            requestCode();
        }
        else {
            requestCode();
        }
    }
}

function getVue() {
    if (vm) {
        return vm;
    }
}


// $(document).ready(function () {
var baseUrl = 'https://flows.cdyylkj.com/Right';

//自动获取地址栏链接带？以及后面的字符串
var queryString = window.location.search;
localStorage.setItem('queryString', queryString)

//获取手机号码
var phone
var pid;

var interval = null;

// 获取orderId
var orderId = '';
if (getUrlParam('a_oId')) {
    orderId = getUrlParam('a_oId');
} else if (getUrlParam('clickid')) {
    orderId = getUrlParam('clickid');
}

// 获取channelId
var channelId = '';
channelId = getUrlParam('channelid');

// 获取ua
var userAgent = navigator.userAgent;
console.log(userAgent);

//获取验证码
function requestCode() {
    if (getVue().selectType !== 1) {
        alert("请勾选并同意活动规则及相关资费");
        return;
    }

    phone = getVue().phone;
    let isphone = isPhoneNo(phone);
    if (!isphone) {
        alert("请填入正确的手机号");
        return;
    }

    if (!getVue().isOverdue) {
        return;
    }
    settime();	//start countdown for sms code

    let obj1 = {
        // "ipaddress": '1.192.156.201',	//固定值
        "ipaddress": window.ipAddress,
        "ver": '1.0',	//固定值
        "mobile": phone.toString(),
        "channel": channelId,
        "imsi": '460030870900577',	//固定值
        "imei": '354779069340660',	//固定值
        "phoneModel": 'MI+4LTE',	//固定值
        "apName": 'xibuxinchan',	//固定值
        "appName": 'doudizhu',	//固定值
        "chargeName": '10beika',	//固定值
        "price": 1990,	//测试值，deploy后重置
        "chargeType": 2,	//固定值
        "timestamp": new Date().getTime(),
        "orderId": orderId,	//来自跳转页面url的参数：a_oId 或 clickid
        "sig": 'test',	//固定值
        "ua": userAgent
    }
    $.ajax({
        url: baseUrl + '/HttpAPI',
        type: 'get',
        dataType: 'json',
        data: obj1,
        contentType: "application/x-www-form-urlencoded",
        // contentType: "application/json; charset=utf-8",
        async: true,
        success: function (res) {
            if (res.resultCode == 0) {
                // getVue().isGetCode = true;
                // pid = res.pid
                let changeUrl = res.orderPage;
				$(location).attr("href", changeUrl);	//re-direct to original order page
            } else {
                alert(res.resultDesc);
                // Cancel the countdown
                getVue().isOverdue = true;
                clearTimeout(clock);
                // _getCode.text("获取验证码");
                getVue().codeTime = 60;
            }
        },
        error: function (err) {
            alert("网络异常");
            getVue().isOverdue = true;
            clearTimeout(clock);
            // _getCode.text("获取验证码");
            getVue().codeTime = 60;
        }
    });
}


// 验证手机号
function isPhoneNo(phone) {
    var pattern = /^1[3456789]\d{9}$/;
    return pattern.test(phone);
}

//截取地址栏参数code
function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let url = window.location.href.split('#')[0]
    let search = url.split('?')[1]
    if (search) {
        var r = search.substr(0).match(reg)
        if (r !== null) return unescape(r[2])
        return null
    } else {
        return null
    }
}

var clock;
/* func: set countdown */
function settime() {
    if (getVue().codeTime == 0) {
        getVue().isOverdue = true;
        getVue().codeTime = 60;
        return false;
    } else {
        getVue().isOverdue = false;
        getVue().codeTime--;
    }
    clock = setTimeout(function () {
        settime();
    }, 1000);
}
