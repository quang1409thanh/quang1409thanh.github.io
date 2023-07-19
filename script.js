// Lấy các phần tử DOM
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const checkButton = document.getElementById("checkButton");
const resultContainer = document.getElementById("resultContainer");

// Xử lý khi người dùng gửi form
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Ngăn chặn gửi form mặc định
    performCheck();
});

// Xử lý khi người dùng click nút "Check"
checkButton.addEventListener("click", () => {
    performCheck();
});

// Hàm thực hiện kiểm tra và hiển thị kết quả
function performCheck() {
    const soBaoDanh = searchInput.value;

    getMockData(soBaoDanh, function (data) {
        displayResult(data);
    });
}

// Hàm hiển thị kết quả
function displayResult(data) {
    if (typeof data === 'string') {
        resultContainer.innerHTML = `<p>${data}</p>`;
    } else {
        resultContainer.innerHTML = `
            <p>SBD: ${data.sbd}</p>
            <p>Toán: ${data.toan}</p>
            <p>Ngữ Văn: ${data.ngu_van}</p>
            <p>Ngoại Ngữ: ${data.ngoai_ngu}</p>
            <p>Vật Lý: ${data.vat_li}</p>
            <p>Hóa Học: ${data.hoa_hoc}</p>
            <p>Sinh Học: ${data.sinh_hoc}</p>
            <p>Lịch Sử: ${data.lich_su}</p>
            <p>Địa Lý: ${data.dia_li}</p>
            <p>GDCD: ${data.gdcd}</p>
        `;
    }
}

// Hàm giả định dữ liệu từ số báo danh
function getMockData(soBaoDanh, callback) {
    processFile('https://raw.githubusercontent.com/quang1409thanh/diemthi/985d1763674228c5704c427839c58de466baf722/diem_thi_thpt_2023.csv', (studentsData) => {
        const student = studentsData.find((studentData) => studentData.sbd === soBaoDanh);

        if (student) {
            const studentResult = new StudentResult(
                student.sbd,
                parseFloat(student.toan),
                parseFloat(student.ngu_van),
                parseFloat(student.ngoai_ngu),
                parseFloat(student.vat_li),
                parseFloat(student.hoa_hoc),
                parseFloat(student.sinh_hoc),
                parseFloat(student.lich_su),
                parseFloat(student.dia_li),
                parseFloat(student.gdcd),
                student.ma_ngoai_ngu
            );

            callback((studentResult));
        } else {
            callback("Không tìm thấy dữ liệu cho số báo danh này.");
        }
    });
}


function processFile(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            const studentsData = parseCSV(text);
            callback(createStudents(studentsData));
        });
}



// main.js
// Định nghĩa class với các thuộc tính tương ứng
class StudentResult {
    constructor(sbd, toan, ngu_van, ngoai_ngu, vat_li, hoa_hoc, sinh_hoc, lich_su, dia_li, gdcd, ma_ngoai_ngu) {
        this.sbd = sbd;
        this.toan = toan;
        this.ngu_van = ngu_van;
        this.ngoai_ngu = ngoai_ngu;
        this.vat_li = vat_li;
        this.hoa_hoc = hoa_hoc;
        this.sinh_hoc = sinh_hoc;
        this.lich_su = lich_su;
        this.dia_li = dia_li;
        this.gdcd = gdcd;
        this.ma_ngoai_ngu = ma_ngoai_ngu;
    }

}

// Hàm chuyển đổi dữ liệu từ CSV thành mảng các đối tượng
function parseCSV(csvContent) {
    const lines = csvContent.trim().split("\n");
    const headers = lines[0].split(",");
    const studentsData = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(",");
        const studentData = {};

        for (let j = 0; j < headers.length; j++) {
            studentData[headers[j].trim()] = data[j].trim() || null;
        }

        studentsData.push(studentData);
    }

    return studentsData;
}

// Hàm tạo các đối tượng StudentResult từ dữ liệu
function createStudents(dataArray) {
    const students = [];

    for (const data of dataArray) {
        const student = new StudentResult(
            data["sbd"],
            parseFloat(data["toan"]),
            parseFloat(data["ngu_van"]),
            parseFloat(data["ngoai_ngu"]),
            parseFloat(data["vat_li"]),
            parseFloat(data["hoa_hoc"]),
            parseFloat(data["sinh_hoc"]),
            parseFloat(data["lich_su"]),
            parseFloat(data["dia_li"]),
            parseFloat(data["gdcd"]),
            data["ma_ngoai_ngu"]
        );

        students.push(student);
    }

    return students;
}
