# API Hồ sơ học sinh theo số điện thoại

Contract backend cho widget nhúng Chatwoot khi cần lấy các bản ghi CRM liên quan
đến một số điện thoại.

> API này trả dữ liệu thô từ Frappe DocType bằng `doc.as_dict()`. Backend không
> map sang shape dashboard như `student`, `leadScore`, `events.items`, ...

---

## 1. Tổng quan

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/method/crm.api.get_student_records_by_phone` | Lấy học sinh/contact và các bản ghi liên quan theo số điện thoại |

Luồng frontend:

```text
Chatwoot postMessage
  └─ contact.phone_number → normalize → "84912345678"
       └─ GET /api/method/crm.api.get_student_records_by_phone?phone=84912345678
```

- Không có SĐT → không gọi API, hoặc API trả các mảng rỗng.
- API tìm theo **9 chữ số cuối** sau khi loại bỏ ký tự không phải số.
- API hiện đang khai báo `allow_guest=True`, nên không bắt buộc token.

---

## 2. Request

```http
GET /api/method/crm.api.get_student_records_by_phone?phone=84912345678
Content-Type: application/json
```

| Query param | Kiểu | Bắt buộc | Mô tả |
|-------------|------|----------|-------|
| `phone` | string | Không | SĐT cần tra cứu. Backend chỉ giữ chữ số và tìm theo 9 chữ số cuối. |

Ví dụ chuẩn hóa để tìm kiếm:

| Input | Search term backend dùng |
|-------|--------------------------|
| `+84 912 345 678` | `912345678` |
| `0912345678` | `912345678` |
| `84912345678` | `912345678` |

---

## 3. Response thực tế

Do đây là Frappe whitelisted method, HTTP response thực tế được bọc trong field
`message`.

```json
{
  "message": {
    "students": [],
    "contacts": [],
    "score_histories": [],
    "interactions": [],
    "intents": [],
    "influences": []
  }
}
```

Không có envelope `isSuccess`, `data`, `metadata` ở API này.

### Khi thiếu `phone`

Backend trả HTTP `200 OK` với tất cả mảng rỗng:

```json
{
  "message": {
    "students": [],
    "contacts": [],
    "score_histories": [],
    "interactions": [],
    "intents": [],
    "influences": []
  }
}
```

### Khi không tìm thấy dữ liệu

Backend cũng trả HTTP `200 OK` với tất cả mảng rỗng.

### Khi tìm thấy dữ liệu

```json
{
  "message": {
    "students": [
      {
        "name": "ENR-2026-00001",
        "doctype": "CRM Student",
        "student_name": "Nguyễn Văn Đại",
        "phone": "0912345678",
        "mobile_no": "0912345678",
        "email": "vandai@example.com",
        "enrollment_status": "New",
        "latest_score": 85,
        "enrollment_date": "2026-06-12",
        "converted": 0,
        "high_school": "THPT Nguyễn Thị Minh Khai",
        "province": "TP. Hồ Chí Minh",
        "ward": "Phường Tân Phú",
        "branch": "Main Campus",
        "major": "Computer Science",
        "aspiration": "Nguyện vọng 1",
        "source": "Facebook",
        "admission_year": "2026",
        "notes": "Ghi chú tư vấn",
        "import_source_id": 123
      }
    ],
    "contacts": [
      {
        "name": "CRMC-2026-00001",
        "doctype": "CRM Contact",
        "full_name": "Nguyễn Văn Đại",
        "phone": "0912345678",
        "email": "vandai@example.com",
        "enrollment_status": "New",
        "lead_status": "Qualified",
        "communication_status": "Open",
        "sla_status": "",
        "assigned_to": "STAFF-0001",
        "student": "ENR-2026-00001",
        "admission_year": "2026",
        "parent_name": "Nguyễn Văn A",
        "parent_phone": "0900000000",
        "high_school": "THPT Nguyễn Thị Minh Khai",
        "province": "TP. Hồ Chí Minh",
        "major": "Computer Science",
        "aspiration": "Nguyện vọng 1",
        "source": "Facebook",
        "crm_campaign": "Tuyển sinh 2026",
        "crm_event": "EVT-0001",
        "branch": "Main Campus",
        "cohort_start_year": 2026,
        "education_program": "Quốc tế",
        "graduation_score": 8.5,
        "transcript_score": 8.2,
        "cohort_end_year": 2030,
        "admission_method": "Xét học bạ",
        "english_converted_score": 7.5,
        "total_score": 24.2,
        "academic_results": [],
        "language_certificates": [],
        "notes": "Ghi chú contact"
      }
    ],
    "score_histories": [
      {
        "name": "SCH-2026-00001",
        "doctype": "CRM Score History",
        "student": "ENR-2026-00001",
        "score_template": "Default",
        "scoring_time": "2026-06-12 10:30:00",
        "fit_score": 40,
        "engagement_score": 25,
        "intent_score": 15,
        "time_decay_score": 0,
        "negative_score": 0,
        "final_score": 80,
        "score_change": 5,
        "details": []
      }
    ],
    "interactions": [
      {
        "name": "INTX-2026-00001",
        "doctype": "CRM Interaction",
        "student": "ENR-2026-00001",
        "crm_contact": "CRMC-2026-00001",
        "interaction_type": "Phone Call",
        "interaction_datetime": "2026-06-12 10:00:00",
        "outcome": "Interested",
        "summary": "Hỏi thông tin tuyển sinh",
        "notes": "Quan tâm ngành CNTT"
      }
    ],
    "intents": [
      {
        "name": "INTENT-2026-00001",
        "doctype": "CRM Intent",
        "interaction": "INTX-2026-00001",
        "student": "ENR-2026-00001",
        "intent_type": "Major Inquiry",
        "importance": "High",
        "confidence": 90,
        "notes": "Quan tâm ngành CNTT"
      }
    ],
    "influences": [
      {
        "name": "INF-2026-00001",
        "doctype": "CRM Influence",
        "crm_contact": "CRMC-2026-00001",
        "full_name": "Nguyễn Văn A",
        "relationship": "Parent",
        "phone": "0900000000",
        "notes": "Phụ huynh"
      }
    ]
  }
}
```

> Các object thực tế có thể có thêm field chuẩn của Frappe như `owner`,
> `creation`, `modified`, `modified_by`, `docstatus`, `idx`, và field child-table
> tùy dữ liệu từng bản ghi.

---

## 4. Cấu trúc `message`

| Field | Kiểu | Mô tả |
|-------|------|-------|
| `message.students` | array | Danh sách `CRM Student` có `phone` khớp search term. |
| `message.contacts` | array | Danh sách `CRM Contact` có `phone` khớp search term hoặc liên kết với student tìm được. |
| `message.score_histories` | array | Danh sách `CRM Score History` của các student tìm được. |
| `message.interactions` | array | Danh sách `CRM Interaction` liên kết với student hoặc contact tìm được. |
| `message.intents` | array | Danh sách `CRM Intent` của các student tìm được. |
| `message.influences` | array | Danh sách `CRM Influence` của các contact tìm được. |

---

## 5. Field chính theo DocType

### `students[]` — CRM Student

| Field | Kiểu Frappe | Mô tả |
|-------|-------------|-------|
| `name` | string | Document name. |
| `doctype` | string | Luôn là `CRM Student`. |
| `student_name` | Data | Họ tên học sinh. |
| `phone` | Data | SĐT. |
| `mobile_no` | Data | SĐT di động. |
| `email` | Data | Email. |
| `enrollment_status` | Link | Trạng thái tuyển sinh. |
| `latest_score` | Float | Điểm mới nhất. |
| `enrollment_date` | Date | Ngày ghi danh/tuyển sinh. |
| `converted` | Check | Đã chuyển đổi hay chưa. |
| `high_school` | Link | Trường THPT. |
| `province` | Link | Tỉnh/thành. |
| `ward` | Link | Phường/xã. |
| `branch` | Link | Cơ sở/campus. |
| `major` | Link | Ngành học. |
| `aspiration` | Link | Nguyện vọng. |
| `source` | Link | Nguồn lead. |
| `admission_year` | Link | Năm tuyển sinh. |
| `notes` | Text | Ghi chú. |
| `import_source_id` | Int | ID nguồn import. |

### `contacts[]` — CRM Contact

| Field | Kiểu Frappe | Mô tả |
|-------|-------------|-------|
| `name` | string | Document name. |
| `doctype` | string | Luôn là `CRM Contact`. |
| `full_name` | Data | Họ tên contact. |
| `phone` | Data | SĐT contact. |
| `email` | Data | Email. |
| `enrollment_status` | Link | Trạng thái tuyển sinh. |
| `lead_status` | Link | Trạng thái lead. |
| `communication_status` | Select | Trạng thái liên lạc. |
| `sla_status` | Select | Trạng thái SLA. |
| `assigned_to` | Link | Nhân sự phụ trách. |
| `student` | Link | `CRM Student` liên kết. |
| `admission_year` | Link | Năm tuyển sinh. |
| `parent_name` | Data | Tên phụ huynh. |
| `parent_phone` | Data | SĐT phụ huynh. |
| `high_school` | Link | Trường THPT. |
| `province` | Link | Tỉnh/thành. |
| `major` | Link | Ngành học. |
| `aspiration` | Link | Nguyện vọng. |
| `source` | Link | Nguồn lead. |
| `crm_campaign` | Link | Chiến dịch. |
| `crm_event` | Link | Sự kiện. |
| `branch` | Link | Cơ sở/campus. |
| `cohort_start_year` | Int | Năm bắt đầu khóa. |
| `education_program` | Link | Chương trình đào tạo. |
| `graduation_score` | Float | Điểm tốt nghiệp. |
| `transcript_score` | Float | Điểm học bạ. |
| `cohort_end_year` | Int | Năm kết thúc khóa. |
| `admission_method` | Select | Phương thức xét tuyển. |
| `english_converted_score` | Float | Điểm tiếng Anh quy đổi. |
| `total_score` | Float | Tổng điểm. |
| `academic_results` | array | Child table `CRM Student Academic Result`. |
| `language_certificates` | array | Child table `CRM Student Language Certificate`. |
| `notes` | Text Editor | Ghi chú. |

### `score_histories[]` — CRM Score History

| Field | Kiểu Frappe | Mô tả |
|-------|-------------|-------|
| `name` | string | Document name. |
| `doctype` | string | Luôn là `CRM Score History`. |
| `student` | Link | Student được chấm điểm. |
| `score_template` | Link | Template tính điểm. |
| `scoring_time` | Datetime | Thời điểm chấm. |
| `fit_score` | Float | Điểm phù hợp. |
| `engagement_score` | Float | Điểm tương tác. |
| `intent_score` | Float | Điểm ý định. |
| `time_decay_score` | Float | Điểm suy giảm theo thời gian. |
| `negative_score` | Float | Điểm trừ. |
| `final_score` | Float | Điểm cuối. |
| `score_change` | Float | Mức thay đổi điểm. |
| `details` | array | Child table `CRM Score History Detail`. |

### `interactions[]` — CRM Interaction

| Field | Kiểu Frappe | Mô tả |
|-------|-------------|-------|
| `name` | string | Document name. |
| `doctype` | string | Luôn là `CRM Interaction`. |
| `student` | Link | Student liên kết. |
| `crm_contact` | Link | Contact liên kết. |
| `interaction_type` | Link | Loại tương tác. |
| `interaction_datetime` | Datetime | Thời điểm tương tác. |
| `outcome` | Select | Kết quả tương tác. |
| `summary` | Data | Tóm tắt. |
| `notes` | Text | Ghi chú. |

### `intents[]` — CRM Intent

| Field | Kiểu Frappe | Mô tả |
|-------|-------------|-------|
| `name` | string | Document name. |
| `doctype` | string | Luôn là `CRM Intent`. |
| `interaction` | Link | Interaction nguồn. |
| `student` | Link | Student liên kết. |
| `intent_type` | Link | Loại ý định. |
| `importance` | Select | Mức quan trọng, ví dụ `Medium`, `High`, `Very High`. |
| `confidence` | Percent | Độ tin cậy, dạng phần trăm. |
| `notes` | Small Text | Ghi chú. |

### `influences[]` — CRM Influence

| Field | Kiểu Frappe | Mô tả |
|-------|-------------|-------|
| `name` | string | Document name. |
| `doctype` | string | Luôn là `CRM Influence`. |
| `crm_contact` | Link | Contact liên kết. |
| `full_name` | Data | Họ tên người ảnh hưởng. |
| `relationship` | Select | Quan hệ, ví dụ `Parent`. |
| `phone` | Data | SĐT. |
| `notes` | Text | Ghi chú. |

---

## 6. Lưu ý cho frontend

- Đọc payload từ `response.message`, không đọc từ `response.data`.
- Không kiểm tra `isSuccess` cho API này vì backend không trả field đó.
- Nếu cần shape dashboard đã transform sẵn, endpoint khác trong app là
  `/api/method/crm.api.get_student_dashboard`, nhưng đó là contract khác.
- Nếu muốn contract thống nhất kiểu `{ isSuccess, message, data, metadata }`, cần
  sửa backend chứ không chỉ sửa docs.
