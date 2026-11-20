$(document).ready(function () {
    var canh = 1;                      
    $("#btnDoiCanh").click(function () {
        $("body").removeClass("canh" + canh);
        canh = canh + 1;
        if (canh > 4) {
            canh = 1;
        }
        $("body").addClass("canh" + canh);
    });
    var nhac = $("#nhac")[0];           
    var dangPhat = false;
    $("#btnNhac").click(function () {
        if (dangPhat == false) {
            nhac.play();
            $(this).text("Ngừng nhạc");
            dangPhat = true;
        } else {
            nhac.pause();
            $(this).text("Phát nhạc");
            dangPhat = false;
        }
    });

});
$(document).ready(function () {
    $("body").append(
        '<div id="tiaNang"></div>' +
        '<div id="bongBong"></div>' +
        '<div id="diemBox">Bong bóng đã nổ: <b id="soDiem">0</b></div>' +
        '<div id="bangPhu">' +
            '<div class="hang">' +
                '<button id="btnTamDung">Tạm dừng</button>' +
                '<button id="btnToanManHinh">Toàn màn hình</button>' +
            '</div>' +
            '<label for="tocDo">Tốc độ bơi <b id="giaTriTocDo">1.0x</b></label>' +
            '<input type="range" id="tocDo" min="0.5" max="3" step="0.1" value="1">' +
            '<label for="amLuong">Âm lượng nhạc <b id="giaTriAmLuong">100%</b></label>' +
            '<input type="range" id="amLuong" min="0" max="100" step="5" value="100">' +
        '</div>' +
        '<div id="tooltip"></div>' +
        '<div id="thongBao"></div>'
    );
    var vtRong = [[6, 90], [9, 120], [38, 80], [63, 110], [88, 95], [92, 125]];
    for (var r = 0; r < vtRong.length; r++) {
        $("body").append(
            "<div class='rong' style='left:" + vtRong[r][0] + "%; height:" + vtRong[r][1] +
            "px; animation-delay:-" + r + "s'></div>"
        );
    }
    $("body").append("<div class='da' style='left:22%; width:90px; height:50px'></div>");
    $("body").append("<div class='da' style='left:75%; width:120px; height:62px'></div>");
    var thongTin = {
        shark:    ["Cá mập",       "Bơi nhanh nhất hồ. Nhấp vào để làm nó giật mình!"],
        goldfish: ["Đàn cá vàng",  "Thích bơi thành đàn cho an toàn."],
        faint:    ["Đàn cá xanh",  "Đàn cá nhỏ lấp lánh, bơi lượn nhẹ nhàng."],
        turtle:   ["Rùa biển",     "Bơi chậm rãi nhưng có thể sống hơn 50 năm."],
        diver1:   ["Thợ lặn Xanh", "Đang lặn xuống khảo sát đáy biển."],
        diver2:   ["Thợ lặn Đỏ",   "Đang chụp ảnh san hô dưới đáy."],
        diver3:   ["Thợ lặn Lục",  "Đang tìm kho báu (chưa thấy gì)."]
    };
    function thongBao(noiDung) {
        $("#thongBao").stop(true, true).text(noiDung)
            .fadeIn(200).delay(1800).fadeOut(400);
    }
    function doiTamDung() {
        $("body").toggleClass("tamdung");
        var dangDung = $("body").hasClass("tamdung");
        $("#btnTamDung").text(dangDung ? "Tiếp tục" : "Tạm dừng").toggleClass("bat", dangDung);
    }
    $("#btnTamDung").click(doiTamDung);
    var tocDo = 1;
    function datTocDoChoMotCon(phanTu, heSo) {
        if (!phanTu.getAnimations) { return; }
        phanTu.getAnimations().forEach(function (a) {
            a.playbackRate = heSo;
        });
    }
    $("#tocDo").on("input", function () {
        tocDo = parseFloat($(this).val());
        $("#content > div").each(function () { datTocDoChoMotCon(this, tocDo); });
        $("#giaTriTocDo").text(tocDo.toFixed(1) + "x");
    });
    $("#amLuong").on("input", function () {
        $("#nhac")[0].volume = $(this).val() / 100;
        $("#giaTriAmLuong").text($(this).val() + "%");
    });
    var diem = 0;
    function taoBongBong(x) {
        if ($(".bubble").length > 60) { return; }
        var kichThuoc = 10 + Math.random() * 24;
        var $b = $("<div class='bubble'></div>").css({
            left: x + "px",
            width: kichThuoc + "px",
            height: kichThuoc + "px",
            animationDuration: (6 + Math.random() * 6) + "s"
        });
        $("#bongBong").append($b);
        $b.on("animationend", function () { $(this).remove(); });
        $b.on("click", function (e) {
            e.stopPropagation();
            var viTri = getComputedStyle(this).transform;     
            $(this).off("click").css({
                transform: viTri,
                animation: "no 0.25s forwards"
            });
            var cai = this;
            setTimeout(function () { $(cai).remove(); }, 260);

            diem++;
            $("#soDiem").text(diem);
            if (diem % 10 === 0) { thongBao("Tuyệt vời! Bạn đã làm nổ " + diem + " bong bóng!"); }
        });
    }
    setInterval(function () {
        if (!$("body").hasClass("tamdung")) {
            taoBongBong(Math.random() * $(window).width());
        }
    }, 700);
    $("#content").click(function (e) {
        for (var i = 0; i < 6; i++) {
            taoBongBong(e.pageX + (Math.random() * 50 - 25));
        }
    });
    for (var i = 0; i < 8; i++) {
        taoBongBong(Math.random() * $(window).width());
    }
    $("#content > div").click(function (e) {
        e.stopPropagation();
        var $con = $(this);
        if ($con.data("giatMinh")) { return; }
        $con.data("giatMinh", true);

        datTocDoChoMotCon(this, tocDo * 3);
        var vt = $con.offset();
        for (var i = 0; i < 5; i++) { taoBongBong(vt.left + Math.random() * $con.width()); }
        thongBao(thongTin[this.id][0] + " giật mình!");

        var that = this;
        setTimeout(function () {
            datTocDoChoMotCon(that, tocDo);
            $con.data("giatMinh", false);
        }, 1500);
    });
    $("#content > div").on("mouseenter", function () {
        var tt = thongTin[this.id];
        $("#tooltip").html("<b>" + tt[0] + "</b>" + tt[1]).show();
    }).on("mousemove", function (e) {
        $("#tooltip").css({ left: e.clientX + 16, top: e.clientY + 16 });
    }).on("mouseleave", function () {
        $("#tooltip").hide();
    });
    function doiToanManHinh() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    $("#btnToanManHinh").click(doiToanManHinh);
    $("button").click(function () { this.blur(); });

    $(document).keydown(function (e) {
        if ($(e.target).is("input")) { return; }
        var phim = e.key.toLowerCase();
        if (phim === " ")      { e.preventDefault(); doiTamDung(); }
        else if (phim === "n") { $("#btnDoiCanh").click(); }  
        else if (phim === "m") { $("#btnNhac").click(); }     
        else if (phim === "f") { doiToanManHinh(); }
    });

});
$(document).ready(function () {
    $("body").append('<button id="btnBang" aria-label="Mở bảng điều khiển">☰</button>');
    $("#btnBang").click(function () {
        $("body").toggleClass("moBang");
        this.blur();
    });
    if (!document.documentElement.requestFullscreen) {
        $("#btnToanManHinh").hide();
    }
    $("#content img").on("contextmenu", function (e) { e.preventDefault(); });
});