import { EXPLORE_CAREERS } from "../data";
import type { CareerActivity, ExploreCareer } from "../data";
import type {
  CommonReferenceMapping,
  ReferenceAction,
  ReferenceEmotion,
} from "../api/client";

export const STUDENT_REFERENCE_FALLBACK_ID = "STU006";

export const REFERENCE_EMOTIONS: Array<{
  value: ReferenceEmotion;
  label: string;
  icon: string;
  color: string;
}> = [
  { value: "hate", label: "Ghét", icon: "😣", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "dislike", label: "Hơi ghét", icon: "🙁", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "neutral", label: "Bình thường", icon: "😐", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { value: "like", label: "Thích", icon: "🙂", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "passion", label: "Đam mê", icon: "😍", color: "bg-pink-50 text-pink-700 border-pink-200" },
];

export const referenceEmotionMeta = (emotion?: string | null) =>
  REFERENCE_EMOTIONS.find((item) => item.value === emotion) ?? null;

export const currentStudentReferenceId = () =>
  window.localStorage.getItem("studentPortalSurveyStudentId") ||
  window.localStorage.getItem("studentPortalMeetingStudentId") ||
  STUDENT_REFERENCE_FALLBACK_ID;

export const actionKey = (careerId: string, activityId: string) =>
  `${careerId}:${activityId}`;

const COMMON_ACTION_MAPPING_OVERRIDES: Record<string, CommonReferenceMapping[]> = {};

const normalizeActionText = (value: string) =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const mapping = (
  commonActionId: string,
  weight = 1,
  note?: string,
): CommonReferenceMapping => ({
  commonActionId,
  weight,
  ...(note ? { note } : {}),
});

export const commonActionMappingsForCareerAction = (
  career: ExploreCareer,
  activity: CareerActivity,
): CommonReferenceMapping[] => {
  const key = actionKey(career.id, activity.id);
  if (COMMON_ACTION_MAPPING_OVERRIDES[key]) {
    return COMMON_ACTION_MAPPING_OVERRIDES[key];
  }

  const text = normalizeActionText(`${career.name} ${career.field} ${activity.label}`);
  const rules: Array<[RegExp, CommonReferenceMapping[]]> = [
    [/debug|sua loi|phat hien loi/, [mapping("ANA08", 1, "Tìm và sửa lỗi")]],
    [/thu thap.*du lieu|ghi nhan du lieu/, [mapping("DAT01", 1, "Thu thập dữ liệu")]],
    [/truc quan|bieu do|dashboard/, [mapping("DAT04", 1, "Trình bày dữ liệu")]],
    [/kiem tra chat luong|quality|qa|test san pham/, [mapping("QUA02", 1, "Kiểm tra chất lượng")]],
    [/kiem tra do chinh xac|doi chieu|xac minh/, [mapping("DAT05", 1, "Kiểm tra độ chính xác")]],
    [/phan tich|bao cao phan tich/, [mapping("ANA01", 1, "Phân tích thông tin")]],
    [/so sanh|lua chon/, [mapping("ANA02", 1, "So sánh lựa chọn")]],
    [/suy luan|logic|thuat toan/, [mapping("ANA04", 1, "Suy luận logic")]],
    [/mo hinh|gia thuyet|toi uu hoa/, [mapping("ANA06", 1, "Kiểm tra hoặc tối ưu giả thuyết")]],
    [/thiet ke|wireframe|prototype|ban ve|kien truc|design system/, [mapping("CRE03", 1, "Thiết kế sản phẩm")]],
    [/y tuong moi|sang tao|de xuat/, [mapping("CRE01", 1, "Đề xuất ý tưởng mới")]],
    [/lap ke hoach|ke hoach/, [mapping("ORG01", 1, "Lập kế hoạch")]],
    [/uu tien|thu tu uu tien/, [mapping("ORG02", 1, "Sắp xếp thứ tự ưu tiên")]],
    [/theo doi tien do|du bao|dong tien/, [mapping("ORG05", 1, "Theo dõi tiến độ")]],
    [/lap rap|che tao/, [mapping("PRA01", 1, "Lắp ráp")]],
    [/sua chua|bao tri/, [mapping("PRA02", 1, "Sửa chữa")]],
    [/su dung cong cu|cad|may moc/, [mapping("PRA03", 1, "Sử dụng công cụ")]],
    [/nhap|luu tru|ho so/, [mapping("DAT02", 1, "Nhập và lưu trữ dữ liệu")]],
    [/so lieu|tai chinh|diem|score/, [mapping("DAT03", 1, "Làm việc với số liệu")]],
    [/lang nghe|phong van/, [mapping("SOC01", 1, "Lắng nghe người khác")]],
    [/giai thich|trinh bay/, [mapping("SOC02", 1, "Giải thích")]],
    [/giang day|huong dan|soan bai/, [mapping("SOC03", 1, "Hướng dẫn")]],
    [/cham soc|ho tro|benh nhan/, [mapping("SOC04", 1, "Chăm sóc và hỗ trợ")]],
    [/tu van/, [mapping("SOC05", 1, "Tư vấn")]],
    [/hop tac|lam viec voi|hoi chan|review code|handoff|hop voi/, [mapping("SOC06", 1, "Hợp tác nhóm")]],
    [/thuyet phuc/, [mapping("LEA01", 1, "Thuyết phục")]],
    [/ra quyet dinh|quyet dinh/, [mapping("LEA03", 1, "Ra quyết định")]],
    [/rui ro/, [mapping("LEA08", 1, "Chấp nhận rủi ro")]],
    [/lap lai/, [mapping("PER01", 1, "Làm việc lặp lại")]],
    [/tap trung/, [mapping("PER05", 1, "Duy trì sự tập trung")]],
    [/danh gia|tu danh gia|cham bai/, [mapping("CRT05", 1, "Tự đánh giá")]],
    [/tieu chuan|style guide|quy tac/, [mapping("QUA01", 1, "Làm theo tiêu chuẩn")]],
    [/chi tiet/, [mapping("QUA03", 1, "Chú ý chi tiết")]],
    [/ghi chep|tai lieu/, [mapping("QUA04", 1, "Ghi chép đầy đủ")]],
    [/hoc cong cu|hoc cong nghe|framework|cap nhat kien thuc|cong nghe moi/, [mapping("ADP07", 1, "Học công cụ mới")]],
    [/ap luc|deadline/, [mapping("ADP02", 1, "Xử lý áp lực thời gian")]],
  ];

  return rules.find(([pattern]) => pattern.test(text))?.[1] ?? [];
};

export const careerReferenceActions = (): ReferenceAction[] =>
  EXPLORE_CAREERS.flatMap((career) =>
    career.activities.map((activity, index) => ({
      actionId: `${career.id}:${activity.id}`,
      careerId: career.id,
      careerName: career.name,
      field: career.field,
      label: activity.label,
      sortOrder: index + 1,
      commonMappings: commonActionMappingsForCareerAction(career, activity),
    })),
  );
