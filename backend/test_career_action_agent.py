import json
import os
import unittest
from unittest.mock import patch

import career_action_agent as agent


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return json.dumps(self.payload).encode("utf-8")


def interactive_response():
    return {
        "mode": "interactive",
        "title": "Thử làm nhà thiết kế",
        "summary": "Con hãy xem một nhà thiết kế làm gì nhé.",
        "explanation": "Nhà thiết kế biến ý tưởng thành hình ảnh hoặc sản phẩm dễ dùng.",
        "interactive": {
            "kind": "multiple_choice",
            "prompt": "Việc nào giống công việc thiết kế nhất?",
            "options": [
                {"id": "a", "label": "Vẽ cách sắp xếp một căn phòng"},
                {"id": "b", "label": "Đếm số cây trong sân"},
            ],
            "correctOptionId": "a",
            "hint": "Hãy nghĩ đến việc tạo ra một cách sắp xếp đẹp và tiện dụng.",
            "successMessage": "Chính xác! Con đã nhận ra ý tưởng thiết kế rồi.",
        },
        "video": None,
    }


class CareerActionAgentTests(unittest.TestCase):
    def test_minimal_context_omits_sensitive_fields(self):
        context = agent.minimal_student_context(
            {
                "id": "STU006",
                "name": "Student",
                "grade": 9,
                "className": "9A",
                "favoriteCareer": "Designer",
                "riasecTop3": "AIS",
                "preferredActivities": "drawing",
                "medicalHistory": "private",
                "fatherName": "private",
                "scores": [{"subject": "Math", "score": 9}],
            }
        )

        self.assertEqual(context["grade"], 9)
        self.assertNotIn("id", context)
        self.assertNotIn("name", context)
        self.assertNotIn("medicalHistory", context)
        self.assertNotIn("fatherName", context)
        self.assertNotIn("scores", context)

    def test_normalizes_interactive_response(self):
        result = agent.normalize_agent_response(interactive_response())

        self.assertEqual(result["mode"], "interactive")
        self.assertIsNotNone(result["interactive"])
        self.assertIsNone(result["video"])

    def test_normalizes_youtube_video_and_builds_embed_url(self):
        result = agent.normalize_agent_response(
            {
                "mode": "video",
                "title": "Video học nghề",
                "summary": "Xem một ví dụ ngắn.",
                "explanation": "Video cho thấy công việc trong thực tế.",
                "interactive": None,
                "video": {
                    "url": "https://www.youtube.com/watch?v=abc123_XY",
                    "title": "Một ngày làm việc",
                    "channel": "Kênh giáo dục",
                    "description": "Video phù hợp cho học sinh.",
                },
            }
        )

        self.assertEqual(result["video"]["source"], "YouTube")
        self.assertEqual(
            result["video"]["embedUrl"],
            "https://www.youtube-nocookie.com/embed/abc123_XY",
        )

    def test_rejects_non_youtube_video(self):
        payload = interactive_response()
        payload.update(
            {
                "mode": "video",
                "interactive": None,
                "video": {
                    "url": "https://example.com/video.mp4",
                    "title": "Video",
                    "channel": "Unknown",
                    "description": "Video",
                },
            }
        )

        with self.assertRaises(ValueError):
            agent.normalize_agent_response(payload)

    def test_calls_openrouter_with_flash_lite_and_search_tool(self):
        upstream = {"choices": [{"message": {"content": json.dumps(interactive_response())}}]}
        with patch.dict(os.environ, {"OPENROUTER_API_KEY": "test-key"}, clear=False):
            with patch.object(agent.urllib.request, "urlopen", return_value=FakeResponse(upstream)) as urlopen:
                result = agent.generate_career_action(
                    {"grade": 8, "riasecTop3": "RIA"},
                    {"id": "career-1", "name": "Nhà thiết kế", "field": "Sáng tạo"},
                    {"id": "action-1", "label": "Thiết kế sản phẩm"},
                )

        request = urlopen.call_args.args[0]
        request_payload = json.loads(request.data.decode("utf-8"))
        self.assertEqual(request_payload["model"], "google/gemini-3.1-flash-lite")
        self.assertEqual(request_payload["tools"][0]["type"], "openrouter:web_search")
        self.assertEqual(result["mode"], "interactive")

    def test_missing_key_is_reported_without_network_call(self):
        with patch.dict(os.environ, {"OPENROUTER_API_KEY": ""}, clear=False):
            with patch.object(agent.urllib.request, "urlopen") as urlopen:
                with self.assertRaises(agent.CareerActionAgentError):
                    agent.generate_career_action(
                        {"grade": 8},
                        {"id": "career-1", "name": "Nhà thiết kế"},
                        {"id": "action-1", "label": "Thiết kế sản phẩm"},
                    )
        urlopen.assert_not_called()


if __name__ == "__main__":
    unittest.main()
