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
// Hàm thực hiện kiểm tra và hiển thị kết quả
function performCheck() {
    const soBaoDanh = searchInput.value;
    let dots = ' ...';
    resultContainer.innerHTML = `<p>Xin vui lòng chờ trong giây lát${dots}</p>`;
    getMockData(soBaoDanh, function (data) {
        displayResult(data);
    });
}

// Hàm hiển thị kết quả
function displayResult(data) {

    if (typeof data === 'string') {
        resultContainer.innerHTML = `<p>${data}</p>`;
    } else {
        const mon = {
            toan: 'Toán',
            ngu_van: 'Ngữ Văn',
            ngoai_ngu: 'Ngoại Ngữ',
            vat_li: 'Vật Lý',
            hoa_hoc: 'Hóa Học',
            sinh_hoc: 'Sinh Học',
            lich_su: 'Lịch Sử',
            dia_li: 'Địa Lý',
            gdcd: 'GDCD'
        }
        let info = data.khoi_thi_max.info.map(x => mon[x]).join(', ');
        let html = `
            <h3>  Kết quả của bạn là: </h3>
            <table>
                <tr><th>SBD</th><td>${data.sbd}</td></tr>
                ${!isNaN(data.toan) ? `<tr><th>Toán</th><td>${data.toan}</td></tr>` : ''}
                ${!isNaN(data.ngu_van) ? `<tr><th>Ngữ Văn</th><td>${data.ngu_van}</td></tr>` : ''}
                ${!isNaN(data.ngoai_ngu) ? `<tr><th>Ngoại Ngữ</th><td>${data.ngoai_ngu}</td></tr>` : ''}
                ${!isNaN(data.vat_li) ? `<tr><th>Vật Lý</th><td>${data.vat_li}</td></tr>` : ''}
                ${!isNaN(data.hoa_hoc) ? `<tr><th>Hóa Học</th><td>${data.hoa_hoc}</td></tr>` : ''}
                ${!isNaN(data.sinh_hoc) ? `<tr><th>Sinh Học</th><td>${data.sinh_hoc}</td></tr>` : ''}
                ${!isNaN(data.lich_su) ? `<tr><th>Lịch Sử</th><td>${data.lich_su}</td></tr>` : ''}
                ${!isNaN(data.dia_li) ? `<tr><th>Địa Lý</th><td>${data.dia_li}</td></tr>` : ''}
                ${!isNaN(data.gdcd) ? `<tr><th>GDCD</th><td>${data.gdcd}</td></tr>` : ''}
                ${!isNaN(data.tong) ? `<tr><th>Tổng Điểm</th><td>${data.tong}</td></tr>` : ''}
                ${!isNaN(data.khoi_thi_max.diem) ? `<tr><th>Khối thi cao nhất</th><td>${info}: ${data.khoi_thi_max.diem}đ</td></tr>` : ''}
            </table>
        `;
        resultContainer.innerHTML = html;
    }
}

// Hàm giả định dữ liệu từ số báo danh
function getMockData(soBaoDanh, callback) {
    processFile('https://raw.githubusercontent.com/quang1409thanh/diemthi/985d1763674228c5704c427839c58de466baf722/diem_thi_thpt_2023.csv', (studentsData) => {
        const student = studentsData.find((studentData) => studentData.sbd === soBaoDanh);

        if (student) {
            const diem = {
                toan: parseFloat(student.toan),
                ngu_van: parseFloat(student.ngu_van),
                ngoai_ngu: parseFloat(student.ngoai_ngu),
                vat_li: parseFloat(student.vat_li),
                hoa_hoc: parseFloat(student.hoa_hoc),
                sinh_hoc: parseFloat(student.sinh_hoc),
                lich_su: parseFloat(student.lich_su),
                dia_li: parseFloat(student.dia_li),
                gdcd: parseFloat(student.gdcd)
            };

            let max_3_mon = 0;
            let mon_1 = '', mon_2 = '', mon_3 = '';
            for (let i in diem) {
                for (let j in diem) {
                    for (let k in diem) {
                        if (i !== j && i !== k && j !== k && !isNaN(diem[i]) && !isNaN(diem[j]) && !isNaN(diem[k])) {
                            if (diem[i] + diem[j] + diem[k] > max_3_mon) {
                                max_3_mon = diem[i] + diem[j] + diem[k];
                                mon_1 = i;
                                mon_2 = j;
                                mon_3 = k;
                            }
                        }
                    }
                }
            }

            let tong_diem = 0;
            for (let i in diem) {
                if (!isNaN(diem[i])) tong_diem += diem[i];
            }
            const max_3 = new khoi_thi_max(
                max_3_mon,
                [mon_1, mon_2, mon_3]
            )
            const studentResult = new StudentResult(
                student.sbd,
                diem.toan,
                diem.ngu_van,
                diem.ngoai_ngu,
                diem.vat_li,
                diem.hoa_hoc,
                diem.sinh_hoc,
                diem.lich_su,
                diem.dia_li,
                diem.gdcd,
                student.ma_ngoai_ngu,
                tong_diem,
                max_3
            );

            callback(studentResult);
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

class khoi_thi_max {
    constructor(diem, info) {
        this.diem = diem;
        this.info = info;
    }
}
class StudentResult {
    constructor(sbd, toan, ngu_van, ngoai_ngu, vat_li, hoa_hoc, sinh_hoc, lich_su, dia_li, gdcd, ma_ngoai_ngu, tong, khoi_thi_max) {
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
        this.tong = tong;
        this.khoi_thi_max = khoi_thi_max;
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
        );

        students.push(student);
    }

    return students;
}
