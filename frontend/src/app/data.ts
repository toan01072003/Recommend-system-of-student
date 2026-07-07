// ── Types ─────────────────────────────────────────────────────────────────────

export type CareerActivity = { id: string; label: string };
export type CareerUniversity = {
  name: string; shortName: string; program: string;
  score: string; combination: string;
  type: "Công lập" | "Tư thục" | "Quốc tế";
  photo: string; uniId?: string;
};

export type ExploreCareer = {
  id: string; name: string; field: string; fieldColor: string;
  salaryMin: string; salaryMax: string; salaryNote: string;
  education: string; desc: string; fullDesc: string;
  coverPhoto: string; gallery: string[]; videoThumb: string;
  skills: string[]; relatedCareers: string[];
  activities: CareerActivity[];
  universities: CareerUniversity[];
};

export type University = {
  id: string; name: string; shortName: string;
  type: "Công lập" | "Tư thục" | "Quốc tế";
  typeColor: string; location: string;
  tuitionMin: string; tuitionMax: string; tuitionNote: string;
  majors: string[]; topMajor: string;
  desc: string; fullDesc: string;
  coverPhoto: string; gallery: string[]; videoThumb: string;
  admissionScore: string; ranking: string;
  activities: { id: string; label: string }[];
  related: string[];
};

export type ChatContact = { id: string; name: string; role: string; avatar: string; lastMsg: string; time: string; unread: number };
export type ChatMessage = { id: number; from: "me" | "them"; text: string; time: string };
export type AdviceNote = { id: number; from: string; subject: string; body: string; date: string; read: boolean; priority: "high" | "medium" | "low" };
export type TestFilters = {
  minSalary: number;
  education: string[];
  demand: string[];
  personality: string[];
  clusters: string[];
  subjects: string[];
};

// ── Mock data ─────────────────────────────────────────────────────────────────

export const gradeData = [
  { grade: "Lớp 6", students: 245, completion: 42, tests: 38 },
  { grade: "Lớp 7", students: 231, completion: 55, tests: 51 },
  { grade: "Lớp 8", students: 228, completion: 61, tests: 58 },
  { grade: "Lớp 9", students: 219, completion: 74, tests: 71 },
  { grade: "Lớp 10", students: 312, completion: 82, tests: 78 },
  { grade: "Lớp 11", students: 298, completion: 88, tests: 85 },
  { grade: "Lớp 12", students: 287, completion: 95, tests: 92 },
];

export const classesData = [
  { name: "9A", students: 38, completion: 89, avg: 7.8, risk: 2 },
  { name: "9B", students: 36, completion: 72, avg: 7.2, risk: 5 },
  { name: "9C", students: 37, completion: 61, avg: 6.9, risk: 8 },
  { name: "9D", students: 38, completion: 94, avg: 8.1, risk: 1 },
  { name: "9E", students: 35, completion: 55, avg: 6.5, risk: 11 },
  { name: "9F", students: 35, completion: 78, avg: 7.5, risk: 4 },
];

export const studentsInClass = [
  { id: "HS001", name: "Nguyễn Minh Anh", gender: "Nữ", avg: 8.5, careerFit: "KH & Công nghệ", testStatus: "Hoàn thành", risk: "none", progress: 95 },
  { id: "HS002", name: "Trần Đức Huy", gender: "Nam", avg: 7.2, careerFit: "Kinh tế & TC", testStatus: "Hoàn thành", risk: "low", progress: 78 },
  { id: "HS003", name: "Lê Thu Hương", gender: "Nữ", avg: 6.8, careerFit: "Nghệ thuật", testStatus: "Chưa làm", risk: "medium", progress: 45 },
  { id: "HS004", name: "Phạm Văn Long", gender: "Nam", avg: 5.9, careerFit: "Chưa xác định", testStatus: "Chưa làm", risk: "high", progress: 20 },
  { id: "HS005", name: "Hoàng Thị Mai", gender: "Nữ", avg: 9.1, careerFit: "Y tế & Sức khỏe", testStatus: "Hoàn thành", risk: "none", progress: 98 },
  { id: "HS006", name: "Võ Thanh Nam", gender: "Nam", avg: 7.8, careerFit: "Kỹ thuật", testStatus: "Đang làm", risk: "low", progress: 62 },
  { id: "HS007", name: "Đặng Lan Anh", gender: "Nữ", avg: 8.2, careerFit: "Giáo dục", testStatus: "Hoàn thành", risk: "none", progress: 91 },
  { id: "HS008", name: "Bùi Minh Tuấn", gender: "Nam", avg: 6.1, careerFit: "Chưa xác định", testStatus: "Chưa làm", risk: "high", progress: 15 },
];

export const studentSkills = [
  { skill: "Tư duy logic", score: 85, fullMark: 100 },
  { skill: "Sáng tạo", score: 72, fullMark: 100 },
  { skill: "Giao tiếp", score: 78, fullMark: 100 },
  { skill: "Lãnh đạo", score: 61, fullMark: 100 },
  { skill: "Phân tích", score: 88, fullMark: 100 },
  { skill: "Kỹ thuật", score: 92, fullMark: 100 },
];

export const academicTrend = [
  { term: "HK1-7", score: 7.2 },
  { term: "HK2-7", score: 7.5 },
  { term: "HK1-8", score: 7.8 },
  { term: "HK2-8", score: 8.0 },
  { term: "HK1-9", score: 8.3 },
  { term: "HK2-9", score: 8.5 },
];

export const careerMatches = [
  { career: "Kỹ thuật phần mềm", score: 92 },
  { career: "Khoa học dữ liệu", score: 87 },
  { career: "Kỹ thuật điện tử", score: 81 },
  { career: "Toán học ứng dụng", score: 76 },
  { career: "Vật lý học", score: 71 },
];

export const careerInterestDist = [
  { name: "KH & Công nghệ", value: 89, color: "#EA580C" },
  { name: "Kinh tế", value: 54, color: "#22C55E" },
  { name: "Y tế", value: 41, color: "#F59E0B" },
  { name: "Nghệ thuật", value: 28, color: "#8B5CF6" },
  { name: "Giáo dục", value: 22, color: "#EC4899" },
  { name: "Khác", value: 17, color: "#78716C" },
];

export const heatmapData = [
  { grade: "Lớp 6", vals: [45, 38, 52, 41, 48, 35, 55, 43] },
  { grade: "Lớp 7", vals: [61, 55, 68, 59, 72, 48, 65, 58] },
  { grade: "Lớp 8", vals: [70, 63, 74, 68, 75, 58, 71, 66] },
  { grade: "Lớp 9", vals: [89, 72, 61, 94, 55, 78, 82, 69] },
  { grade: "Lớp 10", vals: [88, 79, 85, 91, 77, 83, 86, 80] },
  { grade: "Lớp 11", vals: [92, 85, 88, 95, 83, 89, 91, 87] },
  { grade: "Lớp 12", vals: [98, 92, 95, 97, 91, 94, 96, 93] },
];

export const EXPLORE_CAREERS: ExploreCareer[] = [
  {
    id: "software-eng", name: "Kỹ sư Phần mềm", field: "Công nghệ", fieldColor: "bg-blue-100 text-blue-700",
    salaryMin: "18 tr", salaryMax: "45 tr", salaryNote: "/tháng",
    education: "Đại học 4 năm", desc: "Thiết kế, xây dựng và bảo trì phần mềm, ứng dụng web và di động.",
    fullDesc: "Kỹ sư phần mềm thiết kế, phát triển và bảo trì các hệ thống phần mềm. Họ làm việc trong môi trường đội nhóm, sử dụng Python, JavaScript, Java và nhiều công nghệ hiện đại. Đây là nghề có nhu cầu tuyển dụng lớn nhất tại Việt Nam trong thập kỷ tới.",
    coverPhoto: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=340&fit=crop&auto=format",
    skills: ["Python / JavaScript", "Thuật toán & CTDL", "Git & CI/CD", "Làm việc nhóm Agile", "Tư duy logic"],
    relatedCareers: ["Khoa học dữ liệu", "Kỹ sư AI/ML", "Kỹ sư DevOps", "Product Manager"],
    activities: [
      { id: "a1", label: "Viết code và xây dựng tính năng mới" },
      { id: "a2", label: "Debug và sửa lỗi phần mềm" },
      { id: "a3", label: "Review code của đồng nghiệp" },
      { id: "a4", label: "Họp với khách hàng để hiểu yêu cầu" },
      { id: "a5", label: "Học công nghệ và framework mới" },
      { id: "a6", label: "Thiết kế kiến trúc hệ thống" },
      { id: "a7", label: "Viết tài liệu kỹ thuật" },
    ],
    universities: [
      { name: "ĐH Bách Khoa Hà Nội", shortName: "HUST", program: "Khoa học Máy tính", score: "27.55", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1562774053-701939374585?w=80&h=60&fit=crop&auto=format", uniId: "bkhn" },
      { name: "ĐH Bách Khoa TP.HCM", shortName: "HCMUT", program: "Kỹ thuật Máy tính", score: "26.80", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=80&h=60&fit=crop&auto=format", uniId: "bkhcm" },
      { name: "ĐH Công nghệ Thông tin – ĐHQG HCM", shortName: "UIT", program: "Kỹ thuật Phần mềm", score: "25.50", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=80&h=60&fit=crop&auto=format", uniId: "vnu" },
      { name: "ĐH FPT", shortName: "FPT Uni", program: "Kỹ thuật Phần mềm", score: "21.00", combination: "A00/A01/D01", type: "Tư thục", photo: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=80&h=60&fit=crop&auto=format", uniId: "fpt" },
      { name: "RMIT Vietnam", shortName: "RMIT VN", program: "Software Engineering", score: "Xét hồ sơ + IELTS 6.0", combination: "Hồ sơ", type: "Quốc tế", photo: "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=80&h=60&fit=crop&auto=format", uniId: "rmit" },
    ],
  },
  {
    id: "data-science", name: "Khoa học Dữ liệu", field: "Công nghệ", fieldColor: "bg-blue-100 text-blue-700",
    salaryMin: "20 tr", salaryMax: "50 tr", salaryNote: "/tháng",
    education: "Đại học 4 năm", desc: "Phân tích dữ liệu lớn và xây dựng mô hình dự đoán để hỗ trợ quyết định.",
    fullDesc: "Nhà khoa học dữ liệu kết hợp toán học, thống kê và lập trình để khai thác insight từ dữ liệu lớn. Họ xây dựng mô hình Machine Learning, tạo dashboard và giúp doanh nghiệp đưa ra quyết định dựa trên dữ liệu.",
    coverPhoto: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=600&h=340&fit=crop&auto=format",
    skills: ["Python / R", "Machine Learning", "SQL & Big Data", "Thống kê ứng dụng", "Data Visualization"],
    relatedCareers: ["Kỹ sư phần mềm", "Chuyên viên AI", "Business Analyst", "Kỹ sư dữ liệu"],
    activities: [
      { id: "b1", label: "Thu thập và làm sạch dữ liệu" },
      { id: "b2", label: "Xây dựng mô hình Machine Learning" },
      { id: "b3", label: "Trực quan hoá dữ liệu bằng biểu đồ" },
      { id: "b4", label: "Viết báo cáo phân tích cho ban lãnh đạo" },
      { id: "b5", label: "Thử nghiệm và tối ưu hoá thuật toán" },
      { id: "b6", label: "Làm việc với kỹ sư để triển khai model" },
    ],
    universities: [
      { name: "ĐH Bách Khoa Hà Nội", shortName: "HUST", program: "Khoa học Dữ liệu & AI", score: "27.30", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1562774053-701939374585?w=80&h=60&fit=crop&auto=format", uniId: "bkhn" },
      { name: "ĐH Bách Khoa TP.HCM", shortName: "HCMUT", program: "Khoa học Máy tính", score: "26.50", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=80&h=60&fit=crop&auto=format", uniId: "bkhcm" },
      { name: "ĐH Công nghệ Thông tin – ĐHQG HCM", shortName: "UIT", program: "Khoa học Dữ liệu", score: "25.25", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=80&h=60&fit=crop&auto=format", uniId: "vnu" },
      { name: "ĐH FPT", shortName: "FPT Uni", program: "AI & Data Science", score: "22.00", combination: "A00/A01", type: "Tư thục", photo: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=80&h=60&fit=crop&auto=format", uniId: "fpt" },
      { name: "ĐH Quốc gia Hà Nội – ĐHCN", shortName: "VNU-UET", program: "Hệ thống thông tin", score: "26.00", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
    ],
  },
  {
    id: "doctor", name: "Bác sĩ Nội khoa", field: "Y tế", fieldColor: "bg-red-100 text-red-700",
    salaryMin: "25 tr", salaryMax: "70 tr", salaryNote: "/tháng",
    education: "Đại học Y 6 năm + Nội trú", desc: "Chẩn đoán và điều trị bệnh nội khoa, chăm sóc toàn diện cho bệnh nhân.",
    fullDesc: "Bác sĩ nội khoa khám, chẩn đoán và điều trị các bệnh lý nội tạng. Họ cần nắm vững kiến thức y học sâu rộng, kỹ năng giao tiếp tốt với bệnh nhân và gia đình. Đây là nghề đòi hỏi cam kết cao nhưng mang lại giá trị xã hội to lớn.",
    coverPhoto: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1631217873436-b0fa88e71f0a?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1549560826-4b7bfe23f37b?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=340&fit=crop&auto=format",
    skills: ["Kiến thức y học lâm sàng", "Chẩn đoán hình ảnh", "Giao tiếp với bệnh nhân", "Ra quyết định nhanh", "Làm việc áp lực cao"],
    relatedCareers: ["Bác sĩ phẫu thuật", "Dược sĩ lâm sàng", "Điều dưỡng", "Bác sĩ chuyên khoa"],
    activities: [
      { id: "c1", label: "Thăm khám và lắng nghe bệnh nhân" },
      { id: "c2", label: "Đọc và phân tích kết quả xét nghiệm" },
      { id: "c3", label: "Kê đơn và theo dõi điều trị" },
      { id: "c4", label: "Tư vấn bệnh nhân và gia đình" },
      { id: "c5", label: "Hội chẩn với đồng nghiệp về ca khó" },
      { id: "c6", label: "Cập nhật kiến thức y học mới nhất" },
      { id: "c7", label: "Xử lý tình huống cấp cứu" },
    ],
    universities: [
      { name: "ĐH Y Hà Nội", shortName: "HMU", program: "Y khoa (Bác sĩ đa khoa)", score: "27.40", combination: "B00/B08", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Y Dược TP.HCM", shortName: "UMP", program: "Y khoa (Bác sĩ đa khoa)", score: "26.85", combination: "B00/B08", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Y khoa Phạm Ngọc Thạch", shortName: "PNT", program: "Y khoa", score: "24.50", combination: "B00/B08", type: "Công lập", photo: "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Duy Tân", shortName: "DTU", program: "Y khoa", score: "22.00", combination: "B00", type: "Tư thục", photo: "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=80&h=60&fit=crop&auto=format" },
      { name: "Vinmec – ĐHTN Hà Nội", shortName: "Vinmec", program: "Y khoa (hợp tác quốc tế)", score: "Xét hồ sơ", combination: "B00", type: "Tư thục", photo: "https://images.unsplash.com/photo-1757192420329-39acf20a12b8?w=80&h=60&fit=crop&auto=format" },
    ],
  },
  {
    id: "ux-designer", name: "UX / UI Designer", field: "Thiết kế", fieldColor: "bg-purple-100 text-purple-700",
    salaryMin: "12 tr", salaryMax: "35 tr", salaryNote: "/tháng",
    education: "Đại học hoặc tự học", desc: "Thiết kế giao diện và trải nghiệm người dùng cho sản phẩm kỹ thuật số.",
    fullDesc: "UX/UI Designer nghiên cứu hành vi người dùng và tạo ra những giao diện trực quan, đẹp mắt cho app và website. Họ dùng Figma, Sketch để prototype và làm việc sát với đội developer và marketing.",
    coverPhoto: "https://images.unsplash.com/photo-1621111848501-8d3634f82336?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1761746395622-5f7e0e7b4ec7?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1547027072-332f09bd6bb3?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop&auto=format",
    skills: ["Figma / Adobe XD", "Nghiên cứu người dùng", "Wireframing & Prototype", "Typography & Màu sắc", "CSS cơ bản"],
    relatedCareers: ["Graphic Designer", "Product Manager", "Frontend Developer", "Motion Designer"],
    activities: [
      { id: "d1", label: "Vẽ wireframe và prototype giao diện" },
      { id: "d2", label: "Phỏng vấn người dùng để hiểu nhu cầu" },
      { id: "d3", label: "Thiết kế icon và thành phần UI" },
      { id: "d4", label: "A/B testing giao diện" },
      { id: "d5", label: "Làm việc với developer để handoff design" },
      { id: "d6", label: "Tạo design system và style guide" },
    ],
    universities: [
      { name: "ĐH FPT", shortName: "FPT Uni", program: "Thiết kế Mỹ thuật số", score: "21.00", combination: "C00/D01/V00", type: "Tư thục", photo: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=80&h=60&fit=crop&auto=format", uniId: "fpt" },
      { name: "RMIT Vietnam", shortName: "RMIT VN", program: "Communication Design", score: "Xét hồ sơ + IELTS 6.0", combination: "Hồ sơ", type: "Quốc tế", photo: "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=80&h=60&fit=crop&auto=format", uniId: "rmit" },
      { name: "ĐH Kiến trúc TP.HCM", shortName: "UAH", program: "Thiết kế Đồ họa", score: "20.50", combination: "C00/H00/V00", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Mỹ thuật Công nghiệp HN", shortName: "MTCN HN", program: "Thiết kế Đồ họa", score: "24.80", combination: "C00/H00", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "Fulbright University Vietnam", shortName: "FUV", program: "Liberal Arts (Design track)", score: "Xét hồ sơ + phỏng vấn", combination: "Hồ sơ", type: "Quốc tế", photo: "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=80&h=60&fit=crop&auto=format", uniId: "fulbright" },
    ],
  },
  {
    id: "finance", name: "Chuyên viên Tài chính", field: "Kinh tế", fieldColor: "bg-emerald-100 text-emerald-700",
    salaryMin: "15 tr", salaryMax: "40 tr", salaryNote: "/tháng",
    education: "Đại học 4 năm", desc: "Phân tích tài chính, lập kế hoạch đầu tư và tư vấn chiến lược tài chính.",
    fullDesc: "Chuyên viên tài chính phân tích báo cáo, dự báo dòng tiền và tư vấn đầu tư. Họ làm việc tại ngân hàng, công ty chứng khoán hoặc phòng tài chính doanh nghiệp, cần am hiểu thị trường và tư duy phân tích số liệu tốt.",
    coverPhoto: "https://images.unsplash.com/photo-1711097383282-28097ae16b1d?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop&auto=format",
    skills: ["Phân tích tài chính", "Excel & Power BI", "Kế toán cơ bản", "Tư duy phản biện", "Thị trường chứng khoán"],
    relatedCareers: ["Kế toán viên", "Nhà phân tích đầu tư", "Kiểm toán viên", "Giám đốc tài chính"],
    activities: [
      { id: "e1", label: "Lập và phân tích báo cáo tài chính" },
      { id: "e2", label: "Theo dõi và dự báo dòng tiền" },
      { id: "e3", label: "Nghiên cứu thị trường đầu tư" },
      { id: "e4", label: "Tư vấn chiến lược tài chính cho khách hàng" },
      { id: "e5", label: "Quản lý rủi ro tài chính" },
    ],
    universities: [
      { name: "ĐH Ngoại Thương", shortName: "FTU", program: "Tài chính Quốc tế", score: "27.45", combination: "A00/A01/D01", type: "Công lập", photo: "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=80&h=60&fit=crop&auto=format", uniId: "ntu" },
      { name: "ĐH Kinh tế TP.HCM", shortName: "UEH", program: "Tài chính – Ngân hàng", score: "26.75", combination: "A00/A01/D01", type: "Công lập", photo: "https://images.unsplash.com/photo-1757192420329-39acf20a12b8?w=80&h=60&fit=crop&auto=format", uniId: "ueh" },
      { name: "ĐH Kinh tế Quốc dân", shortName: "NEU", program: "Tài chính", score: "26.50", combination: "A00/A01/D01", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "RMIT Vietnam", shortName: "RMIT VN", program: "Business (Finance)", score: "Xét hồ sơ + IELTS 6.5", combination: "Hồ sơ", type: "Quốc tế", photo: "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=80&h=60&fit=crop&auto=format", uniId: "rmit" },
      { name: "Fulbright University Vietnam", shortName: "FUV", program: "Applied Economics", score: "Xét hồ sơ + phỏng vấn", combination: "Hồ sơ", type: "Quốc tế", photo: "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=80&h=60&fit=crop&auto=format", uniId: "fulbright" },
    ],
  },
  {
    id: "teacher", name: "Giảng viên Đại học", field: "Giáo dục", fieldColor: "bg-amber-100 text-amber-700",
    salaryMin: "15 tr", salaryMax: "40 tr", salaryNote: "/tháng",
    education: "Thạc sĩ / Tiến sĩ", desc: "Giảng dạy và nghiên cứu khoa học, đào tạo nhân tài cho đất nước.",
    fullDesc: "Giảng viên đại học vừa truyền đạt kiến thức cho sinh viên vừa nghiên cứu khoa học. Cần có bằng thạc sĩ hoặc tiến sĩ, đam mê chia sẻ kiến thức và liên tục cập nhật kiến thức mới trong lĩnh vực chuyên môn.",
    coverPhoto: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=340&fit=crop&auto=format",
    skills: ["Chuyên môn sâu", "Kỹ năng thuyết trình", "Nghiên cứu & viết báo", "Hướng dẫn sinh viên", "Soạn giáo án"],
    relatedCareers: ["Giáo viên THPT", "Nhà nghiên cứu", "Chuyên gia tư vấn", "Tác giả sách giáo khoa"],
    activities: [
      { id: "f1", label: "Soạn bài giảng và tài liệu học tập" },
      { id: "f2", label: "Giảng dạy trên lớp và trực tuyến" },
      { id: "f3", label: "Hướng dẫn sinh viên làm đề tài" },
      { id: "f4", label: "Viết bài báo khoa học" },
      { id: "f5", label: "Chấm bài và đánh giá sinh viên" },
      { id: "f6", label: "Tham dự hội thảo khoa học" },
    ],
    universities: [
      { name: "ĐH Sư phạm Hà Nội", shortName: "HNUE", program: "Sư phạm Toán / Tin học", score: "26.00", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Sư phạm TP.HCM", shortName: "HCMUE", program: "Sư phạm Toán / Vật lý", score: "25.50", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Bách Khoa Hà Nội", shortName: "HUST", program: "Cử nhân KH (học lên Thạc sĩ)", score: "27.30", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1562774053-701939374585?w=80&h=60&fit=crop&auto=format", uniId: "bkhn" },
      { name: "ĐH Quốc gia HCM – KHTN", shortName: "HCMUS", program: "Toán – Tin học (nghiên cứu)", score: "24.75", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=80&h=60&fit=crop&auto=format" },
    ],
  },
  {
    id: "mech-eng", name: "Kỹ sư Cơ khí", field: "Kỹ thuật", fieldColor: "bg-orange-100 text-orange-700",
    salaryMin: "15 tr", salaryMax: "35 tr", salaryNote: "/tháng",
    education: "Đại học 4–5 năm", desc: "Thiết kế và phát triển máy móc, thiết bị cơ khí cho ngành công nghiệp.",
    fullDesc: "Kỹ sư cơ khí áp dụng kiến thức vật lý và toán học để thiết kế hệ thống cơ khí, từ động cơ ô tô đến dây chuyền sản xuất. Làm việc trong nhà máy, đòi hỏi kỹ năng CAD/CAM và tư duy kỹ thuật chính xác.",
    coverPhoto: "https://images.unsplash.com/photo-1717386255773-1e3037c81788?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&h=340&fit=crop&auto=format",
    skills: ["AutoCAD / SolidWorks", "Sức bền vật liệu", "Nhiệt động lực học", "Quản lý sản xuất", "Đọc bản vẽ kỹ thuật"],
    relatedCareers: ["Kỹ sư điện", "Kỹ sư tự động hoá", "Kỹ sư xây dựng", "Kỹ sư ô tô"],
    activities: [
      { id: "g1", label: "Vẽ bản vẽ kỹ thuật trên CAD" },
      { id: "g2", label: "Tính toán và mô phỏng kết cấu" },
      { id: "g3", label: "Giám sát sản xuất và chế tạo" },
      { id: "g4", label: "Kiểm tra chất lượng sản phẩm" },
      { id: "g5", label: "Bảo trì và sửa chữa thiết bị" },
      { id: "g6", label: "Đề xuất cải tiến quy trình" },
    ],
    universities: [
      { name: "ĐH Bách Khoa Hà Nội", shortName: "HUST", program: "Kỹ thuật Cơ khí", score: "26.75", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1562774053-701939374585?w=80&h=60&fit=crop&auto=format", uniId: "bkhn" },
      { name: "ĐH Bách Khoa TP.HCM", shortName: "HCMUT", program: "Kỹ thuật Cơ khí", score: "25.50", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=80&h=60&fit=crop&auto=format", uniId: "bkhcm" },
      { name: "ĐH Sư phạm Kỹ thuật TP.HCM", shortName: "HCMUTE", program: "Kỹ thuật Cơ khí Chế tạo", score: "23.20", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Công nghệ – ĐHQG HN", shortName: "UET", program: "Kỹ thuật Cơ điện tử", score: "25.75", combination: "A00/A01", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Tôn Đức Thắng", shortName: "TDTU", program: "Kỹ thuật Cơ khí", score: "22.50", combination: "A00/A01", type: "Tư thục", photo: "https://images.unsplash.com/photo-1757192420329-39acf20a12b8?w=80&h=60&fit=crop&auto=format" },
    ],
  },
  {
    id: "env-eng", name: "Kỹ sư Môi trường", field: "Môi trường", fieldColor: "bg-green-100 text-green-700",
    salaryMin: "12 tr", salaryMax: "28 tr", salaryNote: "/tháng",
    education: "Đại học 4 năm", desc: "Nghiên cứu và xây dựng giải pháp bảo vệ môi trường, phát triển bền vững.",
    fullDesc: "Kỹ sư môi trường phát triển giải pháp xử lý ô nhiễm, nước thải và quản lý chất thải. Trong bối cảnh biến đổi khí hậu, đây là ngành ngày càng quan trọng với tiềm năng tác động xã hội lớn.",
    coverPhoto: "https://images.unsplash.com/photo-1532509854226-a2d9d8e66f8e?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=340&fit=crop&auto=format",
    skills: ["Hoá học môi trường", "GIS & viễn thám", "Đánh giá tác động MT", "Xử lý nước thải", "Năng lượng tái tạo"],
    relatedCareers: ["Kỹ sư xây dựng", "Chuyên gia khí hậu", "Nhà sinh thái học", "Kỹ sư năng lượng"],
    activities: [
      { id: "h1", label: "Lấy mẫu và phân tích môi trường hiện trường" },
      { id: "h2", label: "Thiết kế hệ thống xử lý nước thải" },
      { id: "h3", label: "Lập báo cáo đánh giá tác động môi trường" },
      { id: "h4", label: "Tư vấn doanh nghiệp về tuân thủ quy định" },
      { id: "h5", label: "Nghiên cứu giải pháp năng lượng sạch" },
    ],
    universities: [
      { name: "ĐH Bách Khoa Hà Nội", shortName: "HUST", program: "Kỹ thuật Môi trường", score: "24.50", combination: "A00/B00", type: "Công lập", photo: "https://images.unsplash.com/photo-1562774053-701939374585?w=80&h=60&fit=crop&auto=format", uniId: "bkhn" },
      { name: "ĐH Bách Khoa TP.HCM", shortName: "HCMUT", program: "Kỹ thuật Môi trường", score: "23.85", combination: "A00/B00", type: "Công lập", photo: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=80&h=60&fit=crop&auto=format", uniId: "bkhcm" },
      { name: "ĐH Tài nguyên & Môi trường HCM", shortName: "HCMUNRE", program: "Kỹ thuật Môi trường", score: "21.00", combination: "A00/B00", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
      { name: "ĐH Khoa học Tự nhiên HCM", shortName: "HCMUS", program: "Môi trường học", score: "22.75", combination: "A00/B00", type: "Công lập", photo: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=80&h=60&fit=crop&auto=format" },
    ],
  },
];

export const EXPLORE_FIELDS = ["Tất cả", "Công nghệ", "Y tế", "Thiết kế", "Kinh tế", "Giáo dục", "Kỹ thuật", "Môi trường"];
export const REACTIONS = [
  { emoji: "😍", label: "Yêu thích" },
  { emoji: "👍", label: "Thích" },
  { emoji: "😐", label: "Trung lập" },
  { emoji: "😕", label: "Không thích" },
];

export const CAREER_SCORE_MAP: Record<string, { clusters: string[]; personalities: string[]; subjects: string[]; demandLevel: string; salaryMid: number; education: string }> = {
  "software-eng": { clusters: ["Công nghệ & CNTT"], personalities: ["Phân tích / Tư duy", "Kỹ thuật"], subjects: ["Toán", "Tin học", "Vật lý"], demandLevel: "Cao", salaryMid: 30, education: "uni4" },
  "data-science":  { clusters: ["Công nghệ & CNTT"], personalities: ["Phân tích / Tư duy", "Kỹ thuật"], subjects: ["Toán", "Tin học", "Vật lý"], demandLevel: "Tăng trưởng", salaryMid: 35, education: "uni4" },
  "doctor":        { clusters: ["Y tế & Sức khỏe"], personalities: ["Chăm sóc / Hỗ trợ", "Phân tích / Tư duy"], subjects: ["Sinh học", "Hóa học", "Vật lý"], demandLevel: "Ổn định", salaryMid: 45, education: "postgrad" },
  "ux-designer":   { clusters: ["Nghệ thuật & Thiết kế", "Công nghệ & CNTT"], personalities: ["Sáng tạo", "Tổ chức"], subjects: ["Nghệ thuật", "Tin học", "Tiếng Anh"], demandLevel: "Tăng trưởng", salaryMid: 22, education: "uni4" },
  "finance":       { clusters: ["Kinh tế & Tài chính"], personalities: ["Phân tích / Tư duy", "Tổ chức"], subjects: ["Toán", "Tiếng Anh", "Địa lý"], demandLevel: "Ổn định", salaryMid: 28, education: "uni4" },
  "teacher":       { clusters: ["Giáo dục & Đào tạo"], personalities: ["Giao tiếp", "Chăm sóc / Hỗ trợ"], subjects: ["Toán", "Ngữ văn", "Tiếng Anh"], demandLevel: "Ổn định", salaryMid: 25, education: "postgrad" },
  "mech-eng":      { clusters: ["Kỹ thuật & Sản xuất"], personalities: ["Kỹ thuật", "Phân tích / Tư duy"], subjects: ["Toán", "Vật lý", "Tin học"], demandLevel: "Ổn định", salaryMid: 24, education: "uni4" },
  "env-eng":       { clusters: ["Môi trường & Khoa học"], personalities: ["Phân tích / Tư duy", "Chăm sóc / Hỗ trợ"], subjects: ["Hóa học", "Sinh học", "Địa lý"], demandLevel: "Tăng trưởng", salaryMid: 18, education: "uni4" },
};

export const UNIVERSITIES: University[] = [
  {
    id: "bkhn", name: "Đại học Bách Khoa Hà Nội", shortName: "HUST",
    type: "Công lập", typeColor: "bg-blue-100 text-blue-700",
    location: "Hà Nội", tuitionMin: "14 tr", tuitionMax: "25 tr", tuitionNote: "/năm",
    majors: ["CNTT", "Điện tử", "Cơ khí", "Hóa học", "Vật lý kỹ thuật"],
    topMajor: "Khoa học máy tính",
    desc: "Trường kỹ thuật hàng đầu Việt Nam, đào tạo kỹ sư và nhà khoa học chất lượng cao.",
    fullDesc: "Đại học Bách Khoa Hà Nội (HUST) là trường kỹ thuật đứng đầu cả nước, được thành lập năm 1956. Với đội ngũ giảng viên giỏi, cơ sở vật chất hiện đại và mạng lưới cựu sinh viên rộng khắp, trường đào tạo ra các kỹ sư và nhà khoa học được doanh nghiệp trong nước lẫn quốc tế săn đón.",
    coverPhoto: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=600&h=340&fit=crop&auto=format",
    admissionScore: "26–28 điểm", ranking: "Top 1 kỹ thuật VN",
    activities: [
      { id: "u1a1", label: "Học các môn kỹ thuật chuyên sâu" },
      { id: "u1a2", label: "Tham gia CLB robotics và lập trình" },
      { id: "u1a3", label: "Thực tập tại các tập đoàn công nghệ lớn" },
      { id: "u1a4", label: "Sống trong ký túc xá cùng bạn bè" },
      { id: "u1a5", label: "Nghiên cứu khoa học cùng giảng viên" },
      { id: "u1a6", label: "Tham gia cuộc thi lập trình quốc gia" },
    ],
    related: ["bkhcm", "vnu", "fpt"],
  },
  {
    id: "bkhcm", name: "Đại học Bách Khoa TP.HCM", shortName: "HCMUT",
    type: "Công lập", typeColor: "bg-blue-100 text-blue-700",
    location: "TP. Hồ Chí Minh", tuitionMin: "15 tr", tuitionMax: "28 tr", tuitionNote: "/năm",
    majors: ["Kỹ thuật máy tính", "Điện tử", "Xây dựng", "CNTT", "Kỹ thuật hóa học"],
    topMajor: "Kỹ thuật máy tính",
    desc: "Trường đại học kỹ thuật hàng đầu phía Nam, nổi tiếng về chất lượng đào tạo kỹ sư.",
    fullDesc: "ĐH Bách Khoa TP.HCM là ngôi trường kỹ thuật uy tín nhất khu vực phía Nam. Được thành lập năm 1957, trường có lịch sử lâu đời và đóng góp lớn cho sự phát triển kinh tế – kỹ thuật miền Nam Việt Nam. Sinh viên tốt nghiệp được các tập đoàn lớn trong và ngoài nước tin tưởng tuyển dụng.",
    coverPhoto: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1757192420329-39acf20a12b8?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=340&fit=crop&auto=format",
    admissionScore: "25–27 điểm", ranking: "Top 2 kỹ thuật VN",
    activities: [
      { id: "u2a1", label: "Học tập trong môi trường kỹ thuật tiên tiến" },
      { id: "u2a2", label: "Thực hành trong phòng lab hiện đại" },
      { id: "u2a3", label: "Giao lưu với sinh viên quốc tế" },
      { id: "u2a4", label: "Tham gia dự án khởi nghiệp trong trường" },
      { id: "u2a5", label: "Thi đấu cuộc thi kỹ thuật cấp quốc tế" },
      { id: "u2a6", label: "Thực tập tại các công ty kỹ thuật lớn" },
    ],
    related: ["bkhn", "vnu", "fpt"],
  },
  {
    id: "fpt", name: "Đại học FPT", shortName: "FPT Uni",
    type: "Tư thục", typeColor: "bg-orange-100 text-orange-700",
    location: "Hà Nội / HCM / Đà Nẵng / Cần Thơ", tuitionMin: "30 tr", tuitionMax: "45 tr", tuitionNote: "/năm",
    majors: ["Kỹ thuật phần mềm", "AI & Data Science", "An toàn thông tin", "Kinh doanh quốc tế", "Thiết kế đồ họa"],
    topMajor: "Kỹ thuật phần mềm",
    desc: "Trường đại học tư thục hàng đầu về CNTT và kinh doanh, liên kết doanh nghiệp mạnh nhất.",
    fullDesc: "ĐH FPT nổi tiếng với mô hình đào tạo gắn liền với doanh nghiệp, đặc biệt là tập đoàn FPT – một trong những tập đoàn công nghệ lớn nhất Việt Nam. Sinh viên được thực tập có lương từ năm 3, học tiếng Anh chuyên sâu và tiếp cận công nghệ mới nhất. Tỉ lệ có việc làm sau tốt nghiệp đạt trên 98%.",
    coverPhoto: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=600&h=340&fit=crop&auto=format",
    admissionScore: "21–24 điểm", ranking: "Top 1 CNTT tư thục",
    activities: [
      { id: "u3a1", label: "Học lập trình và công nghệ từ năm 1" },
      { id: "u3a2", label: "Thực tập có lương tại FPT từ năm 3" },
      { id: "u3a3", label: "Học và giao tiếp hoàn toàn bằng tiếng Anh" },
      { id: "u3a4", label: "Tham gia Startup Weekend và hackathon" },
      { id: "u3a5", label: "Học kỳ trao đổi tại nước ngoài" },
      { id: "u3a6", label: "Sống trong campus xanh, hiện đại" },
    ],
    related: ["rmit", "fulbright", "bkhn"],
  },
  {
    id: "rmit", name: "Đại học RMIT Việt Nam", shortName: "RMIT VN",
    type: "Quốc tế", typeColor: "bg-red-100 text-red-700",
    location: "TP. Hồ Chí Minh / Hà Nội", tuitionMin: "80 tr", tuitionMax: "130 tr", tuitionNote: "/năm",
    majors: ["Business", "Design", "IT & Engineering", "Communication", "Finance"],
    topMajor: "Business Administration",
    desc: "Cơ sở quốc tế của Đại học RMIT Úc, cấp bằng quốc tế ngay tại Việt Nam.",
    fullDesc: "RMIT Vietnam là cơ sở quốc tế của Đại học RMIT (Úc) – một trong 200 trường đại học tốt nhất thế giới. Sinh viên nhận bằng quốc tế có giá trị toàn cầu, học trong môi trường đa văn hóa, được tiếp cận công nghệ và phương pháp giảng dạy tiên tiến của Úc ngay tại Việt Nam.",
    coverPhoto: "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1757192420329-39acf20a12b8?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=600&h=340&fit=crop&auto=format",
    admissionScore: "Xét hồ sơ + IELTS", ranking: "Top 200 thế giới (RMIT Úc)",
    activities: [
      { id: "u4a1", label: "Học hoàn toàn bằng tiếng Anh" },
      { id: "u4a2", label: "Làm việc nhóm với sinh viên quốc tế" },
      { id: "u4a3", label: "Thực hành trong studio và lab đẳng cấp quốc tế" },
      { id: "u4a4", label: "Tham gia mạng lưới cựu sinh viên toàn cầu" },
      { id: "u4a5", label: "Internship tại các công ty đa quốc gia" },
      { id: "u4a6", label: "Trao đổi học kỳ tại RMIT Melbourne" },
    ],
    related: ["fulbright", "fpt", "ntu"],
  },
  {
    id: "fulbright", name: "Đại học Fulbright Việt Nam", shortName: "FUV",
    type: "Quốc tế", typeColor: "bg-red-100 text-red-700",
    location: "TP. Hồ Chí Minh", tuitionMin: "60 tr", tuitionMax: "90 tr", tuitionNote: "/năm",
    majors: ["Liberal Arts", "Computer Science", "Engineering", "Public Policy", "Business"],
    topMajor: "Liberal Arts & Sciences",
    desc: "Trường đại học khai phóng đầu tiên tại Việt Nam, theo mô hình liberal arts của Mỹ.",
    fullDesc: "Đại học Fulbright Việt Nam (FUV) là trường đại học khai phóng (liberal arts) đầu tiên tại Việt Nam, được sáng lập với sự hỗ trợ của Chính phủ Mỹ. FUV đào tạo sinh viên tư duy phản biện, sáng tạo và lãnh đạo trong môi trường học thuật đỉnh cao. Học bổng hào phóng lên tới 100%.",
    coverPhoto: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=600&h=340&fit=crop&auto=format",
    admissionScore: "Hồ sơ + phỏng vấn", ranking: "Mô hình Harvard của VN",
    activities: [
      { id: "u5a1", label: "Học theo phương pháp seminar thảo luận" },
      { id: "u5a2", label: "Tự thiết kế chương trình học cá nhân" },
      { id: "u5a3", label: "Nghiên cứu độc lập dưới hướng dẫn GS" },
      { id: "u5a4", label: "Tham gia câu lạc bộ nghệ thuật và xã hội" },
      { id: "u5a5", label: "Tranh luận và bảo vệ quan điểm cá nhân" },
      { id: "u5a6", label: "Học bổng trao đổi tại Mỹ" },
    ],
    related: ["rmit", "fpt", "vnu"],
  },
  {
    id: "vnu", name: "ĐH Quốc gia TP.HCM – Trường CNTT", shortName: "UIT",
    type: "Công lập", typeColor: "bg-blue-100 text-blue-700",
    location: "TP. Hồ Chí Minh", tuitionMin: "12 tr", tuitionMax: "20 tr", tuitionNote: "/năm",
    majors: ["Kỹ thuật phần mềm", "An toàn thông tin", "Khoa học dữ liệu", "Mạng máy tính", "Kỹ thuật máy tính"],
    topMajor: "Kỹ thuật phần mềm",
    desc: "Trường CNTT chuyên sâu nhất khu vực phía Nam, thuộc ĐH Quốc gia TP.HCM.",
    fullDesc: "Trường ĐH Công nghệ Thông tin (UIT) thuộc ĐHQG TP.HCM là trường chuyên về CNTT hàng đầu phía Nam. Đây là điểm đến lý tưởng cho những bạn đam mê công nghệ, với môi trường học tập năng động, nhiều hoạt động hackathon và cuộc thi lập trình quốc gia.",
    coverPhoto: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&h=340&fit=crop&auto=format",
    admissionScore: "24–26 điểm", ranking: "Top CNTT công lập HCM",
    activities: [
      { id: "u6a1", label: "Học lập trình từ năm nhất" },
      { id: "u6a2", label: "Tham gia ICPC và các cuộc thi code" },
      { id: "u6a3", label: "Thực tập tại các công ty phần mềm" },
      { id: "u6a4", label: "Làm dự án thực tế với doanh nghiệp" },
      { id: "u6a5", label: "Nghiên cứu AI và Machine Learning" },
      { id: "u6a6", label: "Tham gia cộng đồng open-source" },
    ],
    related: ["bkhcm", "bkhn", "fpt"],
  },
  {
    id: "ntu", name: "Đại học Ngoại Thương", shortName: "FTU",
    type: "Công lập", typeColor: "bg-blue-100 text-blue-700",
    location: "Hà Nội / TP. Hồ Chí Minh", tuitionMin: "12 tr", tuitionMax: "20 tr", tuitionNote: "/năm",
    majors: ["Kinh tế quốc tế", "Quản trị kinh doanh", "Tài chính quốc tế", "Luật kinh doanh", "Logistics"],
    topMajor: "Kinh tế quốc tế",
    desc: "Trường kinh tế quốc tế hàng đầu Việt Nam, nổi tiếng về ngoại ngữ và kỹ năng mềm.",
    fullDesc: "Đại học Ngoại Thương (FTU) là trường kinh tế – thương mại uy tín nhất Việt Nam. Sinh viên FTU được đào tạo kỹ năng tiếng Anh chuyên ngành cực tốt, hiểu biết thị trường quốc tế sâu rộng và kỹ năng mềm xuất sắc. Nhiều sinh viên FTU làm việc tại các tổ chức quốc tế, ngân hàng nước ngoài và công ty đa quốc gia.",
    coverPhoto: "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=600&h=340&fit=crop&auto=format",
    admissionScore: "26–28 điểm", ranking: "Top 1 kinh tế quốc tế VN",
    activities: [
      { id: "u7a1", label: "Học tiếng Anh chuyên ngành kinh tế" },
      { id: "u7a2", label: "Tham gia mô phỏng đàm phán thương mại" },
      { id: "u7a3", label: "Thực tập tại ngân hàng và công ty quốc tế" },
      { id: "u7a4", label: "Tham gia câu lạc bộ mô phỏng Liên Hợp Quốc" },
      { id: "u7a5", label: "Giao lưu với đối tác trường quốc tế" },
      { id: "u7a6", label: "Nghiên cứu về thương mại và chính sách" },
    ],
    related: ["fulbright", "rmit", "vnu"],
  },
  {
    id: "ueh", name: "Đại học Kinh tế TP.HCM", shortName: "UEH",
    type: "Công lập", typeColor: "bg-blue-100 text-blue-700",
    location: "TP. Hồ Chí Minh", tuitionMin: "13 tr", tuitionMax: "22 tr", tuitionNote: "/năm",
    majors: ["Tài chính – Ngân hàng", "Kế toán kiểm toán", "Quản trị kinh doanh", "Marketing", "Logistics"],
    topMajor: "Tài chính – Ngân hàng",
    desc: "Trường kinh tế lớn nhất phía Nam, đào tạo chuyên gia kinh tế và quản trị hàng đầu.",
    fullDesc: "Đại học Kinh tế TP.HCM (UEH) là trường đại học kinh tế lớn nhất khu vực phía Nam với hơn 50.000 sinh viên. UEH nổi tiếng với chất lượng đào tạo Tài chính, Kế toán và Quản trị kinh doanh. Nhiều cựu sinh viên UEH đang giữ các vị trí lãnh đạo tại các ngân hàng và tập đoàn lớn ở Việt Nam.",
    coverPhoto: "https://images.unsplash.com/photo-1757192420329-39acf20a12b8?w=600&h=360&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1514513452089-17f8a9771ee8?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=260&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=260&fit=crop&auto=format",
    ],
    videoThumb: "https://images.unsplash.com/photo-1757192420329-39acf20a12b8?w=600&h=340&fit=crop&auto=format",
    admissionScore: "24–27 điểm", ranking: "Top kinh tế phía Nam",
    activities: [
      { id: "u8a1", label: "Học chuyên sâu về tài chính và ngân hàng" },
      { id: "u8a2", label: "Thực hành phân tích báo cáo tài chính" },
      { id: "u8a3", label: "Thi CFA, ACCA song song với đại học" },
      { id: "u8a4", label: "Thực tập tại ngân hàng và công ty tài chính" },
      { id: "u8a5", label: "Tham gia hội thảo kinh tế chuyên ngành" },
      { id: "u8a6", label: "Networking với cựu sinh viên doanh nhân" },
    ],
    related: ["ntu", "fulbright", "rmit"],
  },
];

export const UNI_TYPES = ["Tất cả", "Công lập", "Tư thục", "Quốc tế"];
export const UNI_REACTIONS = [
  { emoji: "😍", label: "Rất thích" },
  { emoji: "👍", label: "Thích" },
  { emoji: "😐", label: "Trung lập" },
  { emoji: "😕", label: "Không thích" },
];

export const CONTACTS_FOR_STUDENT: ChatContact[] = [
  { id: "cv1", name: "Thầy Nguyễn Văn Minh", role: "Cố vấn hướng nghiệp", avatar: "M", lastMsg: "Em đã xem lộ trình chưa?", time: "10:32", unread: 2 },
  { id: "gv1", name: "Cô Trần Thị Lan", role: "GVCN lớp 9A", avatar: "L", lastMsg: "Em nhớ nộp bài tập nhé.", time: "Hôm qua", unread: 0 },
  { id: "cv2", name: "Cô Phạm Thu Hà", role: "Cố vấn học tập", avatar: "H", lastMsg: "Kết quả test MBTI rất tốt!", time: "T2", unread: 0 },
];

export const CONTACTS_FOR_COUNSELOR: ChatContact[] = [
  { id: "hs1", name: "Nguyễn Minh Anh", role: "Học sinh lớp 9A", avatar: "A", lastMsg: "Thầy ơi em chưa hiểu phần lộ trình", time: "10:35", unread: 1 },
  { id: "hs2", name: "Trần Đức Huy", role: "Học sinh lớp 9A", avatar: "H", lastMsg: "Em cảm ơn thầy ạ!", time: "09:10", unread: 0 },
  { id: "hs3", name: "Hoàng Thị Mai", role: "Học sinh lớp 9A", avatar: "M", lastMsg: "Thầy có thể tư vấn thêm không ạ?", time: "Hôm qua", unread: 3 },
  { id: "hs4", name: "Lê Thu Hương", role: "Học sinh lớp 9C", avatar: "H", lastMsg: "Vâng em sẽ làm theo lời thầy.", time: "T3", unread: 0 },
  { id: "hs5", name: "Đặng Lan Anh", role: "Học sinh lớp 9A", avatar: "A", lastMsg: "Em đã hoàn thành bài test rồi ạ!", time: "T2", unread: 0 },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, from: "them", text: "Chào em! Thầy muốn nói chuyện về kế hoạch học tập của em.", time: "10:00" },
  { id: 2, from: "me", text: "Dạ chào thầy ạ! Em đang lên kế hoạch cho lớp 10 ạ.", time: "10:05" },
  { id: 3, from: "them", text: "Tốt lắm! Em đã xem lộ trình mà thầy gợi ý chưa? Có câu hỏi gì không?", time: "10:28" },
  { id: 4, from: "them", text: "Em đã xem lộ trình chưa?", time: "10:32" },
];

export const SAMPLE_NOTES: AdviceNote[] = [
  { id: 1, from: "Thầy Nguyễn Văn Minh", subject: "Lộ trình học tập học kỳ 2", body: "Minh Anh ơi, dựa trên kết quả test MBTI và Holland của em, thầy khuyên em nên chọn tổ hợp A01 (Toán-Lý-Anh) và tập trung học lập trình Python trong học kỳ này. Em có thể đăng ký tham gia CLB Robotics vào thứ 4 hàng tuần nhé.", date: "20/06/2025", read: false, priority: "high" },
  { id: 2, from: "Cô Trần Thị Lan", subject: "Nhắc nhở hoạt động ngoại khoá", body: "Em nên tham gia thêm hoạt động đội nhóm để phát triển kỹ năng lãnh đạo. Trường có chương trình Hội trại hè tháng 8, em hãy đăng ký nhé. Điều này sẽ rất tốt cho hồ sơ của em sau này.", date: "15/06/2025", read: true, priority: "medium" },
  { id: 3, from: "Thầy Nguyễn Văn Minh", subject: "Chuẩn bị cho kỳ thi học sinh giỏi", body: "Em có khả năng thi học sinh giỏi Toán thành phố năm nay. Thầy sẽ tạo kế hoạch ôn tập riêng cho em. Em hãy lên gặp thầy vào thứ 6 tuần này nhé.", date: "10/06/2025", read: true, priority: "high" },
];

export const SURVEY_COMPLETED_RESULTS = {
  holland: {
    code: "I–C–R",
    label: "Nhà Nghiên cứu (Investigative)",
    desc: "Bạn thích khám phá, phân tích và giải quyết vấn đề bằng tư duy logic. Phù hợp với các nghề khoa học, kỹ thuật và công nghệ.",
    dims: [
      { label: "Thực tế (R)", score: 72, color: "#F97316" },
      { label: "Nghiên cứu (I)", score: 88, color: "#3B82F6" },
      { label: "Nghệ thuật (A)", score: 55, color: "#8B5CF6" },
      { label: "Xã hội (S)", score: 41, color: "#EC4899" },
      { label: "Khởi nghiệp (E)", score: 63, color: "#F59E0B" },
      { label: "Quy củ (C)", score: 79, color: "#10B981" },
    ],
    topCareers: ["Kỹ sư phần mềm", "Nhà khoa học dữ liệu", "Kỹ sư cơ khí"],
    date: "15/05/2025",
  },
  mbti: {
    type: "INTJ",
    fullName: "Người Kiến trúc sư",
    desc: "Chiến lược gia, độc lập và quyết đoán. Bạn có tầm nhìn dài hạn, thích xây dựng hệ thống và tìm ra giải pháp sáng tạo.",
    dims: [
      { left: "Hướng nội (I)", right: "Hướng ngoại (E)", score: 72, side: "left" },
      { left: "Trực giác (N)", right: "Thực tế (S)", score: 65, side: "left" },
      { left: "Tư duy (T)", right: "Cảm xúc (F)", score: 81, side: "left" },
      { left: "Kế hoạch (J)", right: "Linh hoạt (P)", score: 78, side: "left" },
    ],
    strengths: ["Tư duy chiến lược", "Quyết đoán", "Độc lập", "Sáng tạo"],
    weaknesses: ["Cứng nhắc", "Ngại giao tiếp", "Cầu toàn"],
    date: "20/05/2025",
  },
  skills: {
    overall: 76,
    dims: [
      { label: "Tư duy phản biện", score: 88, color: "#3B82F6" },
      { label: "Giao tiếp", score: 64, color: "#EC4899" },
      { label: "Làm việc nhóm", score: 71, color: "#10B981" },
      { label: "Quản lý thời gian", score: 58, color: "#F59E0B" },
      { label: "Sáng tạo", score: 82, color: "#8B5CF6" },
      { label: "Lãnh đạo", score: 55, color: "#F97316" },
    ],
    topStrength: "Tư duy phản biện",
    needWork: "Quản lý thời gian",
    date: "01/06/2025",
  },
};

export const SUBJECTS = ["Toán", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "Tin học", "GDCD"];

export const ACADEMIC_HISTORY: Record<string, { hk1: number[]; hk2: number[]; conduct: string; title: string }> = {
  "Lớp 6 (2020-2021)": {
    hk1: [8.5, 7.2, 7.8, 8.0, 7.5, 7.0, 6.8, 7.2, 9.0, 8.0],
    hk2: [8.8, 7.5, 8.0, 8.2, 7.8, 7.2, 7.0, 7.5, 9.2, 8.2],
    conduct: "Tốt", title: "Học sinh Tiên tiến",
  },
  "Lớp 7 (2021-2022)": {
    hk1: [8.8, 7.3, 8.0, 8.3, 7.6, 7.1, 7.0, 7.3, 9.2, 8.1],
    hk2: [9.0, 7.5, 8.2, 8.5, 7.8, 7.3, 7.2, 7.5, 9.4, 8.3],
    conduct: "Tốt", title: "Học sinh Giỏi",
  },
  "Lớp 8 (2022-2023)": {
    hk1: [9.0, 7.4, 8.2, 8.6, 7.8, 7.2, 6.9, 7.1, 9.5, 8.2],
    hk2: [9.2, 7.6, 8.4, 8.8, 8.0, 7.5, 7.2, 7.4, 9.6, 8.4],
    conduct: "Tốt", title: "Học sinh Giỏi",
  },
  "Lớp 9 (2023-2024)": {
    hk1: [9.5, 7.8, 8.5, 9.0, 8.2, 7.6, 7.1, 7.3, 9.8, 8.5],
    hk2: [9.2, 7.1, 8.8, 8.8, 8.0, 7.4, 6.4, 7.0, 9.5, 8.3],
    conduct: "Tốt", title: "Học sinh Giỏi",
  },
};

export const DEMAND_OPTIONS   = ["Cao", "Tăng trưởng", "Ổn định", "Đang giảm"];
export const PERSONALITY_OPTS = ["Sáng tạo", "Phân tích / Tư duy", "Tổ chức", "Giao tiếp", "Kỹ thuật", "Chăm sóc / Hỗ trợ"];
export const CLUSTER_OPTS     = ["Công nghệ & CNTT", "Y tế & Sức khỏe", "Kinh tế & Tài chính", "Nghệ thuật & Thiết kế", "Giáo dục & Đào tạo", "Kỹ thuật & Sản xuất", "Môi trường & Khoa học", "Truyền thông & Marketing"];
export const SUBJECT_OPTS     = ["Toán", "Vật lý", "Hóa học", "Sinh học", "Tin học", "Ngữ văn", "Tiếng Anh", "Lịch sử", "Địa lý", "Nghệ thuật", "Thể dục"];
export const EDU_OPTS         = [{ id: "highschool", label: "THPT (không cần ĐH)" }, { id: "college2", label: "Cao đẳng 2–3 năm" }, { id: "uni4", label: "Đại học 4 năm" }, { id: "postgrad", label: "Thạc sĩ / Tiến sĩ" }];

export const INTEREST_CHIPS = [
  { label: "💻 Lập trình", id: "code" },
  { label: "🎨 Thiết kế", id: "design" },
  { label: "💰 Kinh doanh", id: "biz" },
  { label: "🩺 Y học", id: "med" },
  { label: "🎵 Âm nhạc", id: "music" },
  { label: "⚽ Thể thao", id: "sport" },
  { label: "🔬 Nghiên cứu", id: "science" },
  { label: "📖 Giảng dạy", id: "teach" },
  { label: "⚙️ Kỹ thuật", id: "eng" },
  { label: "🖼️ Nghệ thuật", id: "art" },
  { label: "🌱 Môi trường", id: "env" },
  { label: "✈️ Du lịch", id: "travel" },
];

export const KID_CARDS = [
  { emoji: "🌟", title: "Tôi phù hợp ngành nào?", desc: "Top 3 nhóm ngành dành riêng cho bạn", action: "Xem kết quả", from: "#F59E0B", to: "#FBBF24" },
  { emoji: "🗺️", title: "Việc tôi cần làm tiếp theo", desc: "Lộ trình cá nhân từng bước rõ ràng", action: "Xem lộ trình", from: "#10B981", to: "#34D399" },
  { emoji: "💬", title: "Chat với cố vấn", desc: "Đặt câu hỏi bất cứ lúc nào bạn muốn", action: "Nhắn tin ngay", from: "#F97316", to: "#FB923C" },
  { emoji: "❤️", title: "Sở thích của tôi", desc: "Cập nhật những gì bạn yêu thích", action: "Cập nhật", from: "#EC4899", to: "#F472B6" },
];

export const QUIZ_QUESTIONS = [
  {
    q: "Khi có thời gian rảnh, bạn thích làm gì nhất?",
    opts: [
      { label: "🖥️ Chơi game, lập trình, hoặc khám phá công nghệ", val: "tech" },
      { label: "🎨 Vẽ, thiết kế, hoặc làm đồ thủ công", val: "art" },
      { label: "📚 Đọc sách, tìm hiểu kiến thức mới", val: "science" },
      { label: "🤝 Trò chuyện, tụ tập và giúp đỡ bạn bè", val: "social" },
    ],
  },
  {
    q: "Môn học bạn thích nhất ở trường là gì?",
    opts: [
      { label: "🔢 Toán & Tin học", val: "tech" },
      { label: "🎭 Ngữ văn & Nghệ thuật", val: "art" },
      { label: "🔭 Lý, Hóa, Sinh học", val: "science" },
      { label: "🌍 Lịch sử, Địa lý, GDCD", val: "social" },
    ],
  },
  {
    q: "Bạn thấy mình giỏi nhất ở điều gì?",
    opts: [
      { label: "💡 Giải quyết vấn đề bằng logic", val: "tech" },
      { label: "✏️ Sáng tạo và biểu đạt cảm xúc", val: "art" },
      { label: "🔍 Tìm tòi, nghiên cứu kỹ lưỡng", val: "science" },
      { label: "🗣️ Thuyết trình và làm việc nhóm", val: "social" },
    ],
  },
];

export const YEARS = Object.keys(ACADEMIC_HISTORY);

// ── Pure helper functions ─────────────────────────────────────────────────────

export const avg = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);

export function scoreCareer(career: ExploreCareer, f: TestFilters): number {
  const map = CAREER_SCORE_MAP[career.id];
  if (!map) return 0;
  let score = 0;
  // Salary (max 20pts)
  if (map.salaryMid >= f.minSalary) score += 20;
  else score += Math.max(0, 20 - (f.minSalary - map.salaryMid) * 2);
  // Education match (15pts)
  if (f.education.length === 0 || f.education.includes(map.education)) score += 15;
  // Demand (15pts)
  if (f.demand.length === 0 || f.demand.includes(map.demandLevel)) score += 15;
  // Personality (20pts)
  const pMatch = f.personality.filter(p => map.personalities.includes(p)).length;
  score += f.personality.length === 0 ? 20 : Math.round((pMatch / Math.max(f.personality.length, 1)) * 20);
  // Clusters (20pts)
  const cMatch = f.clusters.filter(c => map.clusters.includes(c)).length;
  score += f.clusters.length === 0 ? 20 : Math.round((cMatch / Math.max(f.clusters.length, 1)) * 20);
  // Subjects (10pts)
  const sMatch = f.subjects.filter(s => map.subjects.includes(s)).length;
  score += f.subjects.length === 0 ? 10 : Math.round((sMatch / Math.max(f.subjects.length, 1)) * 10);
  return score;
}
