/*
*Created by 2018-3-13 wangshanshan
*
 */

//判断当前是否登陆
$('.liner_granet').on('click',function () {
    $('#wel_login').css('display','none');
    $('.article_login').css('display','block')
})

var minMax = 3;
var priKeyBytes;
var addressBytes;
var address;
var accountName;
var pk;
// 各input框不为空
//监听用户名内容
$("#name").bind('input propertychange',function(){
    if($("#name").val()!=''){
        $('.l_warn').css('display','none')
    }
    // 转码 产生秘钥
    priKeyBytes = genPriKey();
    addressBytes = getAddressFromPriKey(priKeyBytes);
    address = byteArray2hexStr(addressBytes);
    accountName = $("#name").val();
    //TODO fix privateKey store
   // $("#privateKey").val(priKeyBytes);
    var basePrivateKey= base64Encode(priKeyBytes);
    pk= bytesToString(basePrivateKey);
    $("#contents").text(address);
    // console.log($("#contents").text())
});
//监听确认密码内容是否为空  密码是否一致
$("#pwd").bind('input propertychange',function(){
    if($("#name").val()!=''){
        $('.pw_warn').css('display','none')
    }
})
$("#rename").bind('input propertychange',function(){
    if($("#rename").val()!=''){
        $('.mo_warn').css('display','none')
    }
})
$("#repawd").bind('input propertychange',function(){
    if($("#repawd").val()!=''){
        $('.mona_warn').css('display','none')
    }
})
$("#resy").bind('input propertychange',function(){
    if($("#resy").val()!=''){
        $('.mopwd_warn').css('display','none')
    }
})

// 弹框显示隐藏
$('.motal_close,.no').on('click',function () {
    $('.motal').hide()
});


//注册账户 复制文本
function copyUrl2 () {
    var text = document.getElementById("contents");
    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        alert("none");
    }
    document.execCommand('Copy','false',null);
}
//私钥确认按钮
$('#sy_sure').on('click',function () {
    $('.sy').hide()
    $('.motal').show()
})

//创建账户页面点击创建
//pk是指密钥
$('#submit').on('click',function () {
    //  判断用户名是否为空
    if($("#name").val()==''){
        $('.l_warn').css('display','block')
        return false;
    }
    //判断当前密码是否为空  是否与生成密码一致
    if($("#pwd").val()==''||$("#pwd").val()!=$("#contents").text()){
        $('.pw_warn').css('display','block')
        return false;
    }
    priKeyBytes = genPriKey();
    var basePrivateKey= base64Encode(priKeyBytes);
    var pk= bytesToString(basePrivateKey);
    $('#sytext').text(pk)
    $('.sy').show();
})
$("#login").on('click',function () {
    //  判断用户名是否为空
    if($("#rename").val()==''||$("#name").val()!=$("#rename").val()){
        $('.mo_warn').css('display','block')
        return false;
    }
    //判断当前密码是否为空  是否与生成密码一致
    if($("#repawd").val()==''||$("#repawd").val()!=$("#contents").text()){
        $('.mona_warn').css('display','block')
        return false;
    };
    //判断miyao
    console.log($("#resy").val());
    console.log($("#sytext").text())
    if($("#resy").val()==''||$("#resy").val()!=$("#sytext").text()){
        $('.mopwd_warn').css('display','block')
        return false;
    };
    ajax()
})

//ajax
function ajax() {
    console.log('ajax')
    $.ajax({
        type: 'post',
        //address 地址  accountName：账户名
        data: {address: address, name: accountName, accountType: 0},
        dataType: 'json',
        url: 'http://192.168.10.131:8088/transactionForView',

        success: function (data) {
            console.log(data)

            //doSign
            var signbytes = doSign(priKeyBytes, data);
            console.log("sign::: " + byteArray2hexStr(signbytes));
            var bytes = stringToBytes(data);
            var bytesDecode = base64Decode(bytes);

            var transaction = proto.protocol.Transaction.deserializeBinary(bytesDecode);

            var uint8Array = new Uint8Array(signbytes);

            //set sign after base64.
            transaction.addSignature(uint8Array);
            var transactionBytes = transaction.serializeBinary();
            var trxString = byteArray2hexStr(transactionBytes);

            $.ajax({
                type: 'post',
                dataType: 'json',
                data: {transactionData: trxString},
                url:'http://192.168.10.131:8088/transactionFromView',
                async:false,
                success: function (data) {
                    console.log(data)
                    if (data == true) {
                        console.log("tx : " + data);
                        console.log("register is : " + data);
                        $('#create').css('display','none');
                        $('#header_login').css('display','block');
                        $('#center').css('display','block');
                    }

                },
                error:function () {
                    console.log('error')
                }
            });
        },
        error:function () {
            console.log('error')
        }
    });


}





