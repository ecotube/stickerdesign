
var currentStickerIndex = 0;
var stickersConfig = [];
var selectedStickerObj = null;
var standardWidth = 480;
var leftPadding = 15;
var standardHeight = 720;
var modelImageWidth = 0;
var modelImageHeight = 0;
var points = {
    p36 : {x: 145.090714, y: 388.185455},
    p28 : {x: 226.809326, y: 413.432007},
    p45 : {x: 316.302063, y: 386.818054},
    p31 : {x: 202.558029, y: 478.747101},
    p30 : {x: 224.125854, y: 464.141724},
    p35 : {x: 252.042282, y: 478.494385},
    p32 : {x: 213.580750, y: 482.631195},
    p33 : {x: 226.403198, y: 486.411560},
    p34 : {x: 239.940094, y: 482.355194},
    p61 : {x: 215.366150, y: 521.271179},
    p62 : {x: 228.104187, y: 521.828186},
    p63 : {x: 241.252060, y: 520.668823},
    p48 : {x: 183.998306, y: 525.298035},
    p66 : {x: 227.626801, y: 523.914185},
    p54 : {x: 278.198853, y: 522.706726},
    p48 : {x: 183.998306, y: 525.298035},
    p57 : {x: 228.023361, y: 547.001709}
};
var standardOffsetWidthScale = distance(points.p36, points.p45) / standardWidth;

var pointConfig = {
    "eye" : {
        widthBasePoints: [points.p36, points.p45],
        center: points.p28,
        pos: 2
    },
    "nose" : {
        widthBasePoints: [points.p31, points.p35],
        center: points.p30,
        pos: 4
    },
    "nostril" : {
        widthBasePoints: [points.p32, points.p34],
        center: points.p33,
        pos: 5
    },
    "upperlip_bottom" : {
        widthBasePoints: [points.p61, points.p63],
        center: points.p62,
        pos: 6
    },
    "underlip_bottom" : {
        widthBasePoints: [points.p48, points.p54],
        center: points.p66,
        pos: 7
    },
    "underlip_top" : {
        widthBasePoints: [points.p48, points.p54],
        center: points.p57,
        pos: 9
    }
}

$(document).ready(function(){
    setModelParam();

    // init sticker
    $(".sticker-div").click(function(){
        stickerChosen($(this));
    });

    // upload sticker
    $("#uploader").click(function(){ $("#media").click();});
    $(document).on('change', 'input#media', function(){ ajaxFileUpload(); });

    // finish buttons click events
    $("#fin").click(function(){ finishSticker();});
    $("#finall").click(function(){ uploadConfig();});

    // choose sticker center
    $("input[type='radio']").click(function(){
        if(noActiveSticker()) return;
        if($("#sticker_" + currentStickerIndex).size() != 0){ $("#sticker_"+currentStickerIndex).remove(); }
        addStickerToModel(calculatePos());
        dragNResize();
    });
});

function noActiveSticker(){
    if($(".uploaded>.active").size() == 0) {
        notify('请先选择一张贴纸!');
        $(this).prop('checked', false);
        return true;
    }
    return false;
}

function setModelParam(){
    document.getElementById("model-image").onload = function(){
        modelImageHeight = $(this).height();
        modelImageWidth = $(this).width();
    };
    modelImageHeight = modelImageHeight == 0 ? $("#model-image").height() : modelImageHeight;
    modelImageWidth = modelImageWidth == 0 ? $("#model-image").width() : modelImageWidth;
}

function uploadConfig(){
    $.ajax({
        url: 'json.php',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(stickersConfig),
        success: function(data, textStatus, jqXHR){
            window.location.href = 'download.php';
        },
        error: function(){
            notify('上传错误, 请稍后再试');
        }

    })
}

function finishSticker(){
    var config = {};
    config.facePos = pointConfig[$("input[type='radio']:checked").val()].pos;
    config.scaleWidthOffset = parseFloat(getWidthOffset());
    config.scaleXOffset = parseFloat(getXOffset());
    config.scaleYOffset = parseFloat(getYOffset());
    config.frameFolder = $("#frame_folder").val();
    config.frameNum = $("#frame_num").val();
    config.frameWidth = $("#tmp").width();
    config.frameHeight = $("#tmp").height();
    stickersConfig[currentStickerIndex] = config;
    notify("贴纸参数保存成功", 'alert-success');
}

function getWidthOffset(){
    return (widthDifference() / standardModelOffsetWidth()).toFixed(2);
}

function widthDifference(){
    var diff = parseFloat($("#sticker_" + currentStickerIndex + ">img").width()) - stickerBaseWidth();
    return diff;
}

function heightDifference(){
    var diff = parseFloat(widthDifference() / $("#tmp").width() * $("#tmp").height());
    return diff;
}

function getXOffset(){
    var left_original_px = $("#sticker_" + currentStickerIndex).css("left");
    var left_original = parseFloat(left_original_px.substring(0, left_original_px.length - 2)) - leftPadding;
    var left_current = left_original + parseFloat($("#sticker_" + currentStickerIndex + ">img").attr("data-x"));
    return ((left_current - left_original + (widthDifference()/2)) / standardModelOffsetWidth()).toFixed(2);
}

function getYOffset(){
    var top_original_px = $("#sticker_" + currentStickerIndex).css("top");
    var top_original = parseFloat(top_original_px.substring(0, top_original_px.length - 2));
    var top_current = top_original + parseFloat($("#sticker_" + currentStickerIndex + ">img").attr("data-y"));
    return ((top_current - top_original + (heightDifference()/2)) / standardModelOffsetWidth()).toFixed(2);
}

function stickerBaseWidth(){
    var baseWidthPts = pointConfig[$("input[type='radio']:checked").val()].widthBasePoints;
    var width = parseFloat(distance(baseWidthPts[0], baseWidthPts[1]) * standardWidth / modelImageWidth);
    return width;
}

function distance(pt1, pt2){
    return Math.sqrt(Math.pow((pt1.x - pt2.x), 2) + Math.pow((pt1.y - pt2.y), 2));
}

function addStickerToModel(pos){
    var stickerTpl = '' +
        '<div id="sticker_' + currentStickerIndex + '" class="active" style="z-index:99999;position:absolute;left:'+ (leftPadding + pos.x) +'px;top:' + pos.y + 'px;width:'+ pos.width +'px;">' +
        '<img class="full" src="'+ selectedStickerObj.attr("src") +'"/>' +
        '</div>';
    var addedSticker = $(stickerTpl);
    $("#model").append(addedSticker);
}

function dragNResize(){
    interact('#sticker_'+currentStickerIndex+'>img')
        .draggable({
            inertia: true,
            autoScroll: true,
            restrict: { restriction: "#model"},
            onmove: dragMoveListener,
        })
        .resizable({
            preserveAspectRatio: true,
            edges: { left: true, right: true, bottom: true, top: true }
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width  = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
        })
        .on(['mouseover'], function(event){
            $('#sticker_'+currentStickerIndex+'>img').css("border", "1px solid #fdfdfd").css("border-radius","4px");
        })
        .on(['mouseout'], function(event){
            $('#sticker_'+currentStickerIndex+'>img').css("border","none");
        });
}

function dragMoveListener (event) {
    var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}


function calculatePos(){
    var config = pointConfig[$("input[type='radio']:checked").val()];
    var param = {};
    param.width = stickerBaseWidth();
    param.x = (config.center.x / standardWidth) * modelImageWidth - (param.width / 2);
    param.y = (config.center.y / standardHeight) * modelImageHeight - ((param.width / selectedStickerObj.width() * selectedStickerObj.height()) / 2);
    return param;
}

function stickerChosen(obj){
    obj.siblings().attr("style","").removeClass("active");
    obj.attr("style", "border-top:3px solid #62addf").addClass("active");
    currentStickerIndex = obj.index();
    $("#model").children().removeClass('active');
    selectedStickerObj = obj.children("img");
    useLastStickerConfig();
    $("#tmp").attr("src", selectedStickerObj.attr("src"));
}

function useLastStickerConfig(){
    if(stickersConfig[currentStickerIndex]){
        $("#frame_folder").val(stickersConfig[currentStickerIndex].frameFolder);
        $("#frame_num").val(stickersConfig[currentStickerIndex].frameNum);
        for(var key in pointConfig){
            if(pointConfig[key].pos == parseInt(stickersConfig[currentStickerIndex].facePos, 10)){
                $("input[value='"+key+"']").prop("checked", true);
            }
        }
        dragNResize();
    }

}

function standardModelOffsetWidth(){
    return standardOffsetWidthScale * modelImageWidth;
}

function addUploadedSticker(data){
    var tpl = '<div class="col-md-3 col-lg-3 col-sm-3 sticker-div">' +
        '<img src="' + data.file + '" class="img-rounded full"/>' +
        '</div>';
    var dom = $(tpl);
    $(".uploaded").append(dom);
    $("img", dom).click(function(){
        stickerChosen($(this).parent());
    })
}

function ajaxFileUpload() {
    $.ajaxFileUpload
    (
        {
            url: 'file.php', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'media', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            success: function (data, status)  //服务器成功响应处理函数
            {
                addUploadedSticker(data);
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                notify("上传失败，请重试！");
            }
        }
    )
    return false;
}

function notify(message, type){
    var type = type ? type : "alert-warning";
    console.log(type);
    $(".message").addClass(type).html(message);
    $(".message").show();
    setTimeout(function(){
        $(".message").fadeOut(500);
    }, 1500);
    setTimeout(function(){
        $(".message").removeClass(type);
    }, 2000);
}
