export type Language = "vi" | "en";

export const LANGUAGE_STORAGE_KEY = "edupathLanguage";

export const LANGUAGE_META: Record<
  Language,
  { label: string; shortLabel: string; locale: string; htmlLang: string }
> = {
  vi: {
    label: "Tiếng Việt",
    shortLabel: "VI",
    locale: "vi-VN",
    htmlLang: "vi",
  },
  en: {
    label: "English",
    shortLabel: "EN",
    locale: "en-US",
    htmlLang: "en",
  },
};

const enText: Record<string, string> = {
  "Tiếng Việt": "Vietnamese",
  "Ngôn ngữ": "Language",
  English: "English",

  "Hệ thống hướng nghiệp học sinh lớp 6–12":
    "Career guidance system for grades 6-12",
  "THCS & THPT Nguyễn Du · Năm học 2024–2025":
    "Nguyen Du Secondary & High School · Academic year 2024-2025",
  "Mật khẩu": "Password",
  "Đăng nhập với vai trò": "Sign in as",
  "Đăng nhập": "Sign in",
  "Quản lý toàn hệ thống": "Manage the whole system",
  "Nhập liệu & theo dõi lớp": "Enter data and track classes",
  "Tư vấn & lập kế hoạch": "Counsel and plan",
  "Khám phá nghề nghiệp": "Explore careers",
  "Theo dõi tiến độ của con": "Track your child's progress",

  "Quản trị viên": "Administrator",
  "Giáo viên": "Teacher",
  "Cố vấn hướng nghiệp": "Career Counselor",
  "Học sinh": "Student",
  "Phụ huynh": "Parent",
  "GV Trần Thị Lan": "Teacher Tran Thi Lan",
  "CV Nguyễn Văn Minh": "Counselor Nguyen Van Minh",
  "PH Nguyễn Văn Bình": "Parent Nguyen Van Binh",
  "Nguyễn Minh Anh": "Nguyen Minh Anh",

  "Hướng nghiệp": "Career guidance",
  "Tổng quan trường": "School Overview",
  "Dashboard khối": "Grade Dashboard",
  "Dashboard lớp": "Class Dashboard",
  "Hồ sơ học sinh": "Student Profile",
  "Dữ liệu & Bảo mật": "Data & Security",
  "Lớp của tôi": "My Class",
  "Nhập dữ liệu": "Data Entry",
  "Tiến độ của con": "Child Progress",
  "Đăng xuất": "Sign out",

  "Tổng quan": "Overview",
  Dashboard: "Dashboard",
  Students: "Students",
  "Students List": "Students List",
  "Student Groups": "Student Groups",
  Families: "Families",
  Features: "Features",
  Lessons: "Lessons",
  Assignment: "Assignment",
  Surveys: "Surveys",
  "Course & Diploma": "Course & Diploma",
  "Test Scores": "Test Scores",
  Reports: "Reports",
  "Student Work": "Student Work",
  "Lesson Progress": "Lesson Progress",
  "Assignment Report": "Assignment Report",
  Engagement: "Engagement",
  "College Planning": "College Planning",
  Connector: "Connector",
  Messenger: "Messenger",
  "Advice Notes": "Advice Notes",
  Meeting: "Meeting",
  Home: "Home",
  References: "References",
  "Real Games": "Real Games",
  Explore: "Explore",
  "Khám phá ngành nghề": "Career Explorer",
  "Khám phá Đại học": "University Explorer",
  "About Me": "About Me",
  "Personal Information": "Personal Information",
  Portfolios: "Portfolios",
  Resume: "Resume",
  "Application Results": "Application Results",
  Plans: "Plans",
  "Plan for Grade": "Grade Plan",
  "Plan for Pathways": "Pathway Plan",
  Connection: "Connection",
  "Advisement Notes": "Advisement Notes",
  "Tìm bài học, ngành nghề...": "Search lessons, careers...",
  "Tìm học sinh, lớp...": "Search students, classes...",

  "Đã giao": "Assigned",
  "Tổng bài tập": "Total assignments",
  "Đúng hạn": "On time",
  "Trễ hạn": "Late",
  "Cần nhắc": "Needs reminder",
  "Khoá học": "Courses",
  "Đang hoạt động": "Active",
  "Chứng chỉ": "Certificates",
  "Đã cấp": "Issued",
  "Tỉ lệ hoàn thành": "Completion rate",
  "Bài test": "Tests",
  "Loại kiểm tra": "Test types",
  "Đã làm": "Completed",
  "Kỹ năng mềm": "Soft skills",
  "Bài học": "Lessons",
  "Tổng cộng": "Total",
  "Hoàn thành": "Completed",
  "Đang học": "In progress",
  "Nộp đúng hạn": "Submitted on time",
  "Nộp trễ": "Submitted late",
  "Chưa nộp": "Not submitted",

  "Trợ lý hướng nghiệp": "Career guidance assistant",
  "Đang nhập...": "Typing...",
  "Câu hỏi gợi ý": "Suggested questions",
  "Nhập câu hỏi...": "Type a question...",
  "EduBot — Trợ lý hướng nghiệp": "EduBot - Career guidance assistant",
  "Tôi nên chọn ngành nào?": "Which major should I choose?",
  "Điểm chuẩn vào HUST là bao nhiêu?": "What is HUST's admission score?",
  "Làm thế nào để hoàn thiện hồ sơ?": "How can I complete my profile?",
  "Tôi có thể làm bài test hướng nghiệp ở đâu?":
    "Where can I take the career test?",
  "Xin chào! Tôi là EduBot 🤖 — trợ lý hướng nghiệp của bạn. Tôi có thể giúp gì cho bạn hôm nay?":
    "Hello! I am EduBot, your career guidance assistant. How can I help today?",
  "Cảm ơn bạn đã hỏi! Tôi đang tìm câu trả lời phù hợp nhất cho bạn. Trong thời gian chờ, bạn có thể liên hệ trực tiếp cố vấn hướng nghiệp qua mục **Messenger** nhé 💬":
    "Thanks for asking! I am finding the best answer for you. In the meantime, you can contact your counselor directly in **Messenger**.",
  "Dựa trên kết quả MBTI và Holland của bạn (INTJ / I-C-R), bạn phù hợp nhất với nhóm **Khoa học & Công nghệ** — đặc biệt là Kỹ thuật Phần mềm (92%) và Khoa học Dữ liệu (87%). Bạn có muốn tìm hiểu chi tiết không? 🎯":
    "Based on your MBTI and Holland results (INTJ / I-C-R), you fit best with **Science & Technology**, especially Software Engineering (92%) and Data Science (87%). Would you like to explore the details?",
  "Năm 2024, ĐH Bách Khoa Hà Nội có điểm chuẩn dao động **26.75 – 27.55 điểm** tùy ngành (tổ hợp A00/A01). Ngành Khoa học Máy tính là cao nhất: 27.55 điểm. Bạn muốn xem thêm các trường khác không? 📚":
    "In 2024, Hanoi University of Science and Technology admission scores ranged from **26.75 to 27.55** depending on the major (A00/A01). Computer Science was the highest at 27.55. Would you like to see more universities?",
  "Hồ sơ của bạn hiện đạt **62%**. Để hoàn thiện, bạn cần: ✅ Hoàn thành bài test MBTI · ✅ Cập nhật thông tin cá nhân · ✅ Thêm thành tích vào Portfolio. Tôi có thể dẫn bạn đến từng mục nhé! 💪":
    "Your profile is currently **62%** complete. To finish it, complete the MBTI test, update personal information, and add achievements to your portfolio. I can guide you through each step.",
  "Bạn có thể làm bài test tại mục **Surveys** trong thanh điều hướng bên trái. Hiện có 4 bài test: Holland Code ✅, MBTI 🧠, Kỹ năng mềm ⚡, và Năng lực học tập 📚. Bạn chưa làm MBTI nhé! 😊":
    "You can take the test in **Surveys** from the left navigation. There are four tests: Holland Code, MBTI, Soft Skills, and Academic Ability. You have not completed MBTI yet.",

  "Bình thường": "Normal",
  "Chú ý": "Watch",
  "Cần hỗ trợ": "Needs support",
  "Khẩn cấp": "Urgent",
  "Đang làm": "In progress",
  "Chưa làm": "Not started",

  "Tổng học sinh": "Total students",
  "Hồ sơ hoàn thành": "Profiles completed",
  "Cần tư vấn": "Need counseling",
  "Bài test hoàn thành": "Tests completed",
  "Số lớp": "Classes",
  "Nhóm ngành top 1": "Top career cluster",
  "Điểm TB lớp": "Class average",
  "Tìm kiếm học sinh...": "Search students...",
  "Tìm học sinh...": "Search students...",
  "Dữ liệu thiếu": "Missing data",
  "Dữ liệu trùng": "Duplicate data",
  "Log thao tác (7 ngày)": "Activity log (7 days)",
  "Dữ liệu nhạy cảm": "Sensitive data",

  "Tạo bài học": "Create lesson",
  "Đang mở": "Open",
  "Bản nháp": "Draft",
  "Đã xong": "Done",
  "Tất cả": "All",
  "Tạo khảo sát": "Create survey",
  "Thông báo": "Notifications",
  "Gửi": "Send",
  "Lưu": "Save",
  "Hủy": "Cancel",
  "Xóa": "Delete",
  "Chỉnh sửa": "Edit",
  "Cập nhật": "Update",
  "Quay lại": "Back",
  "Quay lại danh sách": "Back to list",
  "Xem chi tiết": "View details",
  "Xem kết quả": "View results",
  "Xem lộ trình": "View pathway",
  "Nhắn tin ngay": "Message now",
  "Tìm kiếm...": "Search...",
  "Nhập tin nhắn...": "Type a message...",
  "Tên, mã học sinh hoặc lớp": "Name, student ID, or class",
  "VD: Tư vấn định hướng nghề nghiệp": "E.g. career orientation counseling",
  "Ghi lại điểm chính của cuộc họp...": "Record key meeting notes...",
  "VD: Lộ trình học tập học kỳ 2...": "E.g. semester 2 study plan...",
  "Nhập lời khuyên chi tiết dành cho học sinh...":
    "Enter detailed advice for the student...",
  "Nhập lời khuyên gửi cho học sinh...": "Enter advice for the student...",
  "Nhập câu trả lời của bạn": "Enter your answer",
  "Viết ngắn về sở thích, mục tiêu học tập hoặc định hướng nghề nghiệp của bạn.":
    "Write briefly about your interests, study goals, or career direction.",
  "Tìm và thêm nghề nghiệp": "Search and add careers",
  "Tìm và thêm trường đại học": "Search and add universities",
  "Tìm ngành nghề...": "Search careers...",
  "Tìm trường, ngành...": "Search universities, majors...",
  "Đang lưu...": "Saving...",
  "Đã làm - sửa lại": "Done - edit",
  "Tôi thích điều gì?": "What do I like?",
  "Đang khám phá ngành nghề này": "Currently exploring this career",
  "Lưu ngành nghề đang khám phá": "Save current explored career",
  "Xác nhận để cập nhật nghề đang khám phá trong hồ sơ của bạn.":
    "Confirm to update the career you are exploring in your profile.",

  "Công lập": "Public",
  "Tư thục": "Private",
  "Quốc tế": "International",
  "Công nghệ": "Technology",
  "Y tế": "Healthcare",
  "Thiết kế": "Design",
  "Kinh tế": "Business",
  "Giáo dục": "Education",
  "Kỹ thuật": "Engineering",
  "Môi trường": "Environment",
  "Yêu thích": "Love",
  "Rất thích": "Love",
  "Thích": "Like",
  "Trung lập": "Neutral",
  "Không thích": "Dislike",
  "Ghét": "Hate",
  "Hơi ghét": "Slightly dislike",
  "Đam mê": "Passion",

  "Toán": "Math",
  "Ngữ văn": "Literature",
  "Tiếng Anh": "English",
  "Khoa học": "Science",
  "Lịch sử": "History",
  "Tin học": "ICT",
  "Vật lý": "Physics",
  "Hóa học": "Chemistry",
  "Sinh học": "Biology",
  "Địa lý": "Geography",
  "Nghệ thuật": "Arts",
  "Thể dục": "Physical Education",
  "Cao": "High",
  "Tăng trưởng": "Growing",
  "Ổn định": "Stable",
  "Đang giảm": "Declining",
  "Sáng tạo": "Creative",
  "Phân tích / Tư duy": "Analytical / Thinking",
  "Tổ chức": "Organized",
  "Giao tiếp": "Communication",
  "Chăm sóc / Hỗ trợ": "Care / Support",
  "Công nghệ & CNTT": "Technology & IT",
  "Y tế & Sức khỏe": "Healthcare & Health",
  "Kinh tế & Tài chính": "Business & Finance",
  "Nghệ thuật & Thiết kế": "Arts & Design",
  "Giáo dục & Đào tạo": "Education & Training",
  "Kỹ thuật & Sản xuất": "Engineering & Manufacturing",
  "Môi trường & Khoa học": "Environment & Science",
  "Truyền thông & Marketing": "Media & Marketing",
  "THPT (không cần ĐH)": "High school (no university required)",
  "Cao đẳng 2–3 năm": "College 2-3 years",
  "Đại học 4 năm": "University 4 years",
  "Thạc sĩ / Tiến sĩ": "Master's / PhD",

  "Kỹ sư Phần mềm": "Software Engineer",
  "Kỹ sư phần mềm": "Software Engineer",
  "Khoa học Dữ liệu": "Data Science",
  "Nhà khoa học dữ liệu": "Data Scientist",
  "Kỹ sư AI/ML": "AI/ML Engineer",
  "Kỹ sư DevOps": "DevOps Engineer",
  "Kỹ sư dữ liệu": "Data Engineer",
  "Bác sĩ Nội khoa": "Internal Medicine Doctor",
  "Product Manager": "Product Manager",
  "Business Analyst": "Business Analyst",
  "Kỹ sư cơ khí": "Mechanical Engineer",
  "Chuyên viên AI": "AI Specialist",

  "Đại học Bách Khoa Hà Nội": "Hanoi University of Science and Technology",
  "ĐH Bách Khoa Hà Nội": "Hanoi University of Science and Technology",
  "ĐH Bách Khoa TP.HCM": "Ho Chi Minh City University of Technology",
  "ĐH Công nghệ Thông tin – ĐHQG HCM":
    "University of Information Technology - VNU-HCM",
  "ĐH FPT": "FPT University",
  "Đại học FPT": "FPT University",
  "Đại học RMIT Việt Nam": "RMIT University Vietnam",
  "ĐH Quốc gia Hà Nội – ĐHCN": "VNU University of Engineering and Technology",
  "Khoa học Máy tính": "Computer Science",
  "Kỹ thuật Máy tính": "Computer Engineering",
  "Kỹ thuật Phần mềm": "Software Engineering",
  "Khoa học Dữ liệu & AI": "Data Science & AI",
  "Hệ thống thông tin": "Information Systems",
  "An toàn thông tin": "Information Security",
  "Kinh doanh quốc tế": "International Business",
  "Thiết kế đồ họa": "Graphic Design",

  "Hôm nay": "Today",
  "Ngày mai": "Tomorrow",
  "Hôm qua": "Yesterday",
  "T2": "Mon",
  "T3": "Tue",
  "T4": "Wed",
  "T5": "Thu",
  "T6": "Fri",
  "T7": "Sat",
  CN: "Sun",
};

const replacementRules: Array<[RegExp, string]> = [
  [/\bLớp\s+(\d+)([A-Z])\b/g, "Class $1$2"],
  [/\bLớp\s+(\d+)\b/g, "Grade $1"],
  [/(\d+)\s*HS\b/g, "$1 students"],
  [/(\d+)\s*nộp\b/g, "$1 submitted"],
  [/(\d+)\s*bài\b/g, "$1 items"],
  [/(\d+)\s*tr\b/g, "$1M VND"],
  [/\/tháng/g, "/month"],
  [/\/năm/g, "/year"],
  [/điểm/g, "points"],
  [/hồ sơ/g, "profile"],
  [/bài tập/g, "assignments"],
  [/học sinh/g, "students"],
  [/ngành nghề/g, "careers"],
  [/đại học/g, "universities"],
  [/Đại học/g, "University"],
  [/Học sinh/g, "Student"],
  [/Cố vấn/g, "Counselor"],
  [/Thầy/g, "Mr."],
  [/Cô/g, "Ms."],
];

const trimPreserving = (value: string) => {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return {
    leading,
    trailing,
    core: value.slice(leading.length, value.length - trailing.length),
  };
};

const splitAndTranslate = (value: string): string | null => {
  const separators = [" · ", " — ", " – ", " - ", " / ", ": "];
  for (const separator of separators) {
    if (!value.includes(separator)) continue;
    const parts = value.split(separator);
    const translated = parts.map((part) => translateStaticText(part, "en"));
    if (translated.some((part, index) => part !== parts[index])) {
      return translated.join(separator);
    }
  }

  return null;
};

export const translateStaticText = (
  value: string | null | undefined,
  language: Language,
): string => {
  if (!value) return value ?? "";
  if (language === "vi") return value;

  const { leading, trailing, core } = trimPreserving(value);
  if (!core) return value;

  const exact = enText[core];
  if (exact) return `${leading}${exact}${trailing}`;

  const split = splitAndTranslate(core);
  if (split && split !== core) return `${leading}${split}${trailing}`;

  let translated = core;
  for (const [pattern, replacement] of replacementRules) {
    translated = translated.replace(pattern, replacement);
  }

  return `${leading}${translated}${trailing}`;
};

export const tStatic = (value: string, language: Language) =>
  translateStaticText(value, language);

export const formatDateTime = (
  value: string | number | Date,
  language: Language,
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString(LANGUAGE_META[language].locale, options);
};

export const formatDate = (
  value: string | number | Date,
  language: Language,
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(LANGUAGE_META[language].locale, options);
};

export const formatTime = (
  value: string | number | Date,
  language: Language,
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleTimeString(LANGUAGE_META[language].locale, options);
};
