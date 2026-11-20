$(document).ready(function () {
    const subjects = [
        { code: "Toan", name: "Toán" },
        { code: "Van", name: "Ngữ Văn" },
        { code: "Anh", name: "Tiếng Anh" },
        { code: "Ly", name: "Vật Lí" },
        { code: "Hoa", name: "Hóa Học" },
        { code: "Sinh", name: "Sinh Học" },
        { code: "Su", name: "Lịch Sử" },
        { code: "Dia", name: "Địa Lí" },
        { code: "CN", name: "Công Nghệ" },
        { code: "GDKTPL", name: "GDKTPL" },
        { code: "QGQP", name: "QGQP" },
        { code: "TD", name: "Thể Dục" },
        { code: "HDTN", name: "HĐTN" }
    ];
    function renderScoreTables() {
        let teacherHTML = "";
        let studentHTML = "";

        subjects.forEach(function (sub) {
            teacherHTML += `
                <tr>
                    <td class="fw-bold text-start">${sub.name}</td>
                    <td><input class="form-control TX_${sub.code}" type="number" step="0.1" min="0" max="10"></td>
                    <td><input class="form-control TX_${sub.code}" type="number" step="0.1" min="0" max="10"></td>
                    <td><input class="form-control TX_${sub.code}" type="number" step="0.1" min="0" max="10"></td>
                    <td><input class="form-control" id="${sub.code}_GK" type="number" step="0.1" min="0" max="10"></td>
                    <td><input class="form-control" id="${sub.code}_CK" type="number" step="0.1" min="0" max="10"></td>
                    <td class="fw-bold text-primary" id="${sub.code}_TBM"></td>
                </tr>
            `;

            studentHTML += `
                <tr>
                    <td class="fw-bold text-start">${sub.name}</td>
                    <td id="${sub.code}_TX_S"></td>
                    <td id="${sub.code}_GK_S"></td>
                    <td id="${sub.code}_CK_S"></td>
                    <td class="fw-bold text-primary" id="${sub.code}_TBM_S"></td>
                </tr>
            `;
        });

        $("#teacherTableBody").html(teacherHTML);
        $("#studentTableBody").html(studentHTML);
    }

    renderScoreTables();
    function showSection(targetId) {
        if (targetId === "home") {
            $(".content-section").hide();
            $("main").fadeIn(300);
        } else {
            $("main").hide();
            $(".content-section").hide();
            $("#" + targetId).fadeIn(300);
        }
        window.scrollTo(0, 0);

        if (targetId === "bangdiem") {
            loadBangDiemTheoVaiTro();
        }
    }
    $("#menu a").click(function () {
        const target = $(this).data("target");
        showSection(target);
    });
    $("#btnHeroTuyenSinh").click(function () {
        showSection("tuyensinh");
    });
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function updateLoginUI() {
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (savedUser) {
            $("#loginBtn").text(savedUser.name).css("background-color", "#28a745");
        } else {
            $("#loginBtn").text("Đăng nhập").css("background-color", "#ffc107");
        }
    }
    updateLoginUI();
    $("#loginBtn").click(function (e) {
        e.preventDefault();
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (savedUser) {
            $("#userMenu").toggle();
        } else {
            $("#loginPopup").css("display", "flex");
        }
    });
    $("#loginPopup").click(function (e) {
        if (e.target === this) {
            $("#loginPopup").hide();
        }
    });
    $(document).click(function (e) {
        if (!$(e.target).closest("#userMenu, #loginBtn").length) {
            $("#userMenu").hide();
        }
    });
    $("#linkToSignup").click(function (e) {
        e.preventDefault();
        $("#loginForm").hide();
        $("#signupForm").show();
    });

    $("#linkToLogin").click(function (e) {
        e.preventDefault();
        $("#signupForm").hide();
        $("#loginForm").show();
    });
    $("#btnSubmitSignup").click(function () {
        const name = $("#signupName").val().trim();
        const email = $("#signupEmail").val().trim();
        const pass = $("#signupPass").val().trim();
        const role = $("#signupRole").val();

        if (!name || !email || !pass) {
            alert("❌ Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        if (!isValidEmail(email)) {
            alert("❌ Email không hợp lệ!");
            $("#signupEmail").focus();
            return;
        }

        const users = JSON.parse(localStorage.getItem("userAccounts")) || [];
        if (users.some(u => u.email === email)) {
            alert("⚠ Email này đã được đăng ký!");
            return;
        }

        users.push({ name: name, email: email, pass: pass, role: role });
        localStorage.setItem("userAccounts", JSON.stringify(users));

        alert("✅ Đăng ký thành công! Mời bạn đăng nhập.");
        $("#signupForm").hide();
        $("#loginForm").show();
    });
    $("#btnSubmitLogin").click(function () {
        const email = $("#loginEmail").val().trim();
        const pass = $("#loginPass").val().trim();

        if (!isValidEmail(email)) {
            alert("❌ Chỉ được đăng nhập bằng EMAIL hợp lệ!");
            return;
        }

        const users = JSON.parse(localStorage.getItem("userAccounts")) || [];
        const found = users.find(u => u.email === email && u.pass === pass);

        if (!found) {
            alert("❌ Sai email hoặc mật khẩu!");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(found));
        alert("🎉 Đăng nhập thành công!");
        $("#loginPopup").hide();
        updateLoginUI();
        if ($("#bangdiem").is(":visible")) {
            loadBangDiemTheoVaiTro();
        }
    });
    $("#logoutBtn").click(function () {
        localStorage.removeItem("loggedInUser");
        $("#userMenu").hide();
        updateLoginUI();
        alert("Bạn đã đăng xuất!");

        if ($("#bangdiem").is(":visible")) {
            loadBangDiemTheoVaiTro();
        }
    });

    function loadBangDiemTheoVaiTro() {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));

        $("#guestBox").hide();
        $("#teacherBox").hide();
        $("#studentBox").hide();

        if (!user) {
            $("#guestBox").show();
            return;
        }

        if (user.role === "teacher") {
            $("#teacherBox").show();
        } else if (user.role === "student") {
            $("#studentBox").show();
            loadStudentScore(user.name);
        }
    }
    $("#btnLuuDiem").click(function () {
        const studentName = $("#studentNameSave").val().trim();
        if (!studentName) {
            alert("Vui lòng nhập tên học sinh!");
            return;
        }

        let data = {};

        subjects.forEach(function (sub) {
            const mon = sub.code;
            let txArr = [];
            let sum = 0;

            $(".TX_" + mon).each(function () {
                const val = $(this).val();
                if (val !== "") {
                    txArr.push(val);
                    sum += parseFloat(val);
                }
            });

            const gk = $("#" + mon + "_GK").val();
            const ck = $("#" + mon + "_CK").val();

            let tbm = "";
            if (txArr.length > 0 && gk !== "" && ck !== "") {
                const avgTX = sum / txArr.length;
                tbm = ((avgTX + parseFloat(gk) * 2 + parseFloat(ck) * 3) / 6).toFixed(2);
            }

            $("#" + mon + "_TBM").text(tbm);
            data[mon] = { TX: txArr, GK: gk, CK: ck, TBM: tbm };
        });

        localStorage.setItem("score_" + studentName, JSON.stringify(data));
        alert("✅ Đã lưu bảng điểm cho học sinh: " + studentName);
    });
    function loadStudentScore(studentName) {
        const data = JSON.parse(localStorage.getItem("score_" + studentName));
        if (!data) {
            subjects.forEach(function (sub) {
                $("#" + sub.code + "_TX_S").text("-");
                $("#" + sub.code + "_GK_S").text("-");
                $("#" + sub.code + "_CK_S").text("-");
                $("#" + sub.code + "_TBM_S").text("-");
            });
            return;
        }

        subjects.forEach(function (sub) {
            const mon = sub.code;
            $("#" + mon + "_TX_S").text(data[mon].TX.join(", "));
            $("#" + mon + "_GK_S").text(data[mon].GK);
            $("#" + mon + "_CK_S").text(data[mon].CK);
            $("#" + mon + "_TBM_S").text(data[mon].TBM);
        });
    }
});