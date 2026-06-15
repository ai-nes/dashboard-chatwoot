# Phân tích sự tương thích giữa API Frappe CRM và UI Dashboard

Tài liệu này phân tích sự khác biệt (Gap Analysis) giữa dữ liệu trả về từ API lấy hồ sơ học sinh theo số điện thoại (được mô tả trong [message.md](file:///e:/TVu/CRM/dashboard-chatwoot/message.md)) và cấu trúc dữ liệu hiển thị thực tế trên giao diện Dashboard (được định nghĩa trong [student-types.ts](file:///e:/TVu/CRM/dashboard-chatwoot/app/%28dashboard%29/components/student-types.ts)).

---

## 1. Tóm tắt tình trạng

*   **API Hiện tại**: Trả về dữ liệu thô trực tiếp từ các DocType của Frappe dưới dạng 6 mảng phẳng: `students`, `contacts`, `score_histories`, `interactions`, `intents`, `influences`.
*   **UI Dashboard**: Mong đợi cấu trúc dữ liệu được định hình sẵn (`StudentDashboardData`) bao gồm các thông tin lồng nhau (nested objects) và các thông tin thống kê/gợi ý.
*   **Kết luận**: **Chưa thể hiển thị trực tiếp** dữ liệu từ API lên UI mà không qua một lớp chuyển đổi dữ liệu (Mapper) ở Frontend. Ngoài ra, **API đang thiếu một số trường thông tin quan trọng** dẫn đến một số thành phần giao diện sẽ bị trống hoặc hiển thị không chính xác.

### Kết luận cập nhật

Vấn đề UI đang gặp **có thể giải quyết ngay** bằng cách đổi endpoint đang gọi.

UI hiện đang gọi:

```http
GET /api/method/crm.api.get_student_records_by_phone?phone=...
```

Endpoint này chỉ phù hợp để debug/lấy dữ liệu raw. Response thực tế là:

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

Nếu UI cần `StudentDashboardData`, nên gọi endpoint đã có sẵn trong app:

```http
GET /api/method/crm.api.get_student_dashboard?phone=...
```

Raw response của Frappe sẽ có dạng:

```json
{
  "message": {
    "isSuccess": true,
    "message": "Thành công",
    "data": {
      "student": {},
      "interactions": { "items": [], "nextCursor": null },
      "intents": {
        "items": [],
        "total": 0,
        "dominant": [],
        "support": []
      },
      "events": { "items": [] },
      "suggestedEvents": { "items": [] },
      "leadScore": {
        "fitScore": 0,
        "engagementScore": 0,
        "intentScore": 0,
        "timeDecayScore": 0,
        "negativeScore": 0,
        "totalScore": 0,
        "maxScore": 100,
        "tier": "cold",
        "isPotentialCustomer": false,
        "breakdown": [],
        "trend": [],
        "lastUpdated": 1781510400
      }
    },
    "metadata": null
  }
}
```

Scoring mới clamp `final_score` trong khoảng `0..100`, nên dashboard response
trả `leadScore.maxScore = 100`.

Frontend cần đọc:

```ts
const envelope = response.message

if (!envelope?.isSuccess) {
  throw new Error(envelope?.message || 'Không lấy được dữ liệu học sinh')
}

const dashboardData = envelope.data
```

Không đọc trực tiếp `response.data.student`, vì với `/api/method/...` Frappe bọc
giá trị trả về của Python method trong `response.message`.

---

## 2. Bảng so sánh chi tiết và Khoảng trống dữ liệu (Gaps)

### A. Thông tin học sinh (`Student` vs `students[]` / `contacts[]`)

| Trường dữ liệu trên UI | Kiểu dữ liệu UI | Thuộc tính tương ứng trong API | Đánh giá & Giải pháp |
| :--- | :--- | :--- | :--- |
| **id** | `number` | `students[0].import_source_id` hoặc `contacts[0].name` | Cần thống nhất ID nào sẽ làm định danh chính trên UI. |
| **fullName** | `string` | `students[0].student_name` hoặc `contacts[0].full_name` | Khớp. FE dễ dàng lấy được. |
| **highSchool** | `{ province: string, name: string }` | `students[0].province` & `students[0].high_school` | Khớp về thông tin, nhưng API trả về dạng phẳng. FE cần map thành nested object. |
| **homeAddress** | `{ province, district, detail }` | `students[0].province` & `students[0].ward` | **Thiếu Quận/Huyện (`district`) và địa chỉ chi tiết (`detail`)**. API chỉ có phường/xã (`ward`). |
| **cohort** | `string` | `students[0].cohort_start_year/cohort_end_year`, fallback `contacts[0].cohort_start_year/cohort_end_year`, sau cùng `students[0].admission_year` | Khớp. Student và Contact đều có field niên khóa. |
| **academicRecords** | `AcademicRecord[]` | `students[0].academic_results` hoặc `contacts[0].academic_results` | Khớp dữ liệu nguồn. Mapper/API dashboard cần map `school_year` -> `year`, `academic_rank` -> `grade`. |
| **languages** | `LanguageCertificate[]` | `students[0].language_certificates` hoặc `contacts[0].language_certificates` | Khớp dữ liệu nguồn. Mapper/API dashboard cần map `certificate_name`, `score_level`, `issue_date`. |
| **interestedPrograms** | `TrainingProgram[]` (mảng) | `students[0].education_program` hoặc `contacts[0].education_program` (string đơn) | **Chưa khớp hoàn toàn**. API chỉ trả về một chuỗi đơn (ví dụ: `"Quốc tế"`), trong khi UI mong muốn một mảng danh sách chương trình quan tâm. |
| **interestedMajors** | `InterestedMajor[]` (mảng) | `students[0].major` và `students[0].aspiration` | **Chưa khớp**. UI cần danh sách các ngành kèm độ ưu tiên (`primary`/`secondary`). API chỉ trả về một ngành duy nhất tại thời điểm hiện tại. |
| **socialMediaInterests**| `SchoolSocialMediaInterest[]` | *Không có* | **Thiếu hoàn toàn**. API không cung cấp thông tin tương tác của học sinh với các kênh mạng xã hội của trường (Facebook, Zalo, Tiktok...). |

### B. Lịch sử tương tác (`interactions`)

| Trường dữ liệu trên UI | Kiểu dữ liệu UI | Thuộc tính tương ứng trong API | Đánh giá & Giải pháp |
| :--- | :--- | :--- | :--- |
| **id** | `string` | `interactions[].name` | Khớp. |
| **type** | `InteractionType` (enum) | `interactions[].interaction_type` | **Chưa khớp định dạng**. API trả về string hiển thị tiếng Anh của Frappe (ví dụ: `"Phone Call"`). FE cần map sang enum tương ứng (`phone_call`). |
| **occurredAt** | `number` (epoch timestamp) | `interactions[].interaction_datetime` | **Chưa khớp định dạng**. API trả về chuỗi ngày tháng `"2026-06-12 10:00:00"`. FE cần parse chuỗi này sang timestamp. |
| **summary** / **notes** | `string` | `interactions[].summary` / `interactions[].notes` | Khớp. |
| **dominantIntent** | `string \| null` | `CRM Intent.intent_role == "Dominant"` trong cùng interaction | Endpoint dashboard đã map sẵn. Raw API chưa map. |
| **supportIntents** | `string[]` | `CRM Intent.intent_role == "Support"` trong cùng interaction | Endpoint dashboard đã map sẵn. Raw API chưa map. |

### C. Phân tích ý định (`intents`)

Endpoint dashboard đã transform intent gần khớp UI hơn raw API:

*   `items[]` có `key`, `label`, `intentType`, `importance`, `role`, `isDominant`, `detectedAt`, `sourceInteractionId`, `sourceType`, `confidence`.
*   `dominant[]` và `support[]` đã được tách theo `CRM Intent.intent_role`.
*   `interactions.items[].dominantIntent` và `supportIntents` cũng được map từ cùng nguồn.

Gap còn lại:

*   Mapping intent key đã bao phủ các intent type mới trong seed scoring như `Tuition`, `Scholarship`, `Admission Process`, `Enrollment Intent`, `Deposit Intent`.
*   `detectedAt` hiện lấy từ `CRM Intent.modified`, không phải thời điểm interaction xảy ra. Nếu UI cần thời điểm phát hiện theo cuộc tương tác, nên dùng `CRM Interaction.interaction_datetime`.

### D. Điểm tiềm năng (`leadScore`)

Scoring mới dùng công thức:

```text
non_decay = 0.4 * fit_score
decayable = 0.3 * engagement_score + 0.3 * intent_score
final_score = max(0, min(100, non_decay + decayable * time_decay_factor + min(0, negative_score)))
```

Với endpoint dashboard, backend đã lấy `CRM Score History` mới nhất và trả
`leadScore` transform sẵn:

| Field dashboard | Nguồn hiện tại | Ghi chú |
|---|---|---|
| `fitScore` | `latest_score_history.fit_score` | Khớp. |
| `engagementScore` | `latest_score_history.engagement_score` | Khớp. |
| `intentScore` | `latest_score_history.intent_score` | Khớp scoring mới. |
| `timeDecayScore` | `latest_score_history.time_decay_score` | Khớp scoring mới. |
| `negativeScore` | `latest_score_history.negative_score` | Khớp scoring mới. |
| `totalScore` | `latest_score_history.final_score` | Khớp scoring mới, điểm đã nằm trong `0..100` nếu seed/calculator đúng. |
| `maxScore` | hardcoded `100` | Khớp scoring mới. |
| `tier` | `>=80 hot`, `>=50 warm`, còn lại `cold` | Khớp thang `0..100`. |
| `isPotentialCustomer` | `totalScore >= 70` | Hợp lý với thang `0..100`. |
| `breakdown` | `latest_score_history.details[]` | Khớp, dùng `score` và `category`. |
| `trend` | 5 bản ghi score history gần nhất | Khớp cho chart. |
| `lastUpdated` | `scoring_time` dạng Unix timestamp | Khớp. |

Gap còn lại với scoring mới:

*   `leadScore` hiện đã expose đủ `fitScore`, `engagementScore`, `intentScore`, `timeDecayScore`, `negativeScore`, `totalScore`.
*   Nếu UI đang giả định `maxScore = 200`, cần đổi về `100` để khớp thang scoring mới.

### E. Sự kiện tuyển sinh (`events` & `suggestedEvents`)

Endpoint raw `get_student_records_by_phone` không trả event/suggested event.
Endpoint dashboard `get_student_dashboard` đã trả:

*   `events.items[]`: lấy từ `CRM Contact.crm_event` nếu có.
*   `suggestedEvents.items[]`: lấy các `CRM Event` sắp tới, loại event đã tham dự.

Gap còn lại:

*   `eventStatus` hiện backend nhận param nhưng chưa filter thật.
*   `matchScore` và `matchReason` đang hardcoded, chưa tính theo scoring/major thực tế.

---

## 3. Đề xuất giải pháp khắc phục

### Phương án 1: Đổi UI sang API dashboard đã transform sẵn (Khuyên dùng)

Đổi URL frontend đang gọi từ:

```http
/api/method/crm.api.get_student_records_by_phone
```

sang:

```http
/api/method/crm.api.get_student_dashboard
```

Query hiện hỗ trợ:

| Param | Mô tả |
|-------|-------|
| `phone` | SĐT cần tra cứu. |
| `interactionLimit` | Giới hạn số tương tác, mặc định `50`. |
| `suggestedEventLimit` | Giới hạn số sự kiện gợi ý, mặc định `10`. |
| `eventStatus` | Backend hiện nhận param nhưng chưa filter. |

Ưu điểm:

*   Không cần viết mapper lớn ở frontend.
*   Response đã gần khớp `StudentDashboardData`: `student`, `interactions`, `intents`, `events`, `suggestedEvents`, `leadScore`.
*   Các field ngày/giờ chính đã được chuyển sang Unix timestamp ở các phần dashboard.

Việc frontend cần làm:

1.  Unwrap response Frappe từ `response.message`.
2.  Check `response.message.isSuccess`.
3.  Dùng `response.message.data` làm data cho dashboard.

Ví dụ:

```ts
async function fetchStudentDashboard(phone: string) {
  const res = await fetch(
    `/api/method/crm.api.get_student_dashboard?phone=${encodeURIComponent(phone)}`
  )
  const json = await res.json()
  const envelope = json.message

  if (!envelope?.isSuccess) {
    throw new Error(envelope?.message || 'Không lấy được dữ liệu học sinh')
  }

  return envelope.data
}
```

### Phương án 2: Nâng cấp Backend raw API

Backend có thể nâng cấp API `/api/method/crm.api.get_student_records_by_phone` để cấu trúc lại response trả về khớp trực tiếp với giao diện mong muốn. 

*   Bổ sung bảng dữ liệu các kênh mạng xã hội (`social_media_interests`).
*   Bổ sung danh sách các sự kiện đã tham gia và gợi ý sự kiện.
*   Format sẵn các trường dữ liệu ngày tháng về dạng epoch timestamp (số) để tránh FE phải tự parse.
*   Hỗ trợ lưu trữ dạng mảng cho ngành học quan tâm (`interested_majors`) và chương trình quan tâm (`interested_programs`).

Không khuyên dùng nếu vẫn cần giữ endpoint raw cho debug/tích hợp dữ liệu, vì đổi
shape response có thể làm hỏng client đang phụ thuộc vào 6 mảng thô.

### Phương án 3: Xử lý chuyển đổi tại Frontend (Mapper)
Nếu không thể thay đổi Backend, Frontend cần viết một hàm chuyển đổi dữ liệu (`mapper`) khi nhận kết quả từ API:

1.  **Xử lý trường thiếu**: Gán mảng rỗng `[]` hoặc giá trị mặc định cho `socialMediaInterests`, `events`, `suggestedEvents` để tránh crash giao diện.
2.  **Chuyển đổi kiểu dữ liệu phẳng**: Gom các trường phẳng như `province`, `high_school` thành cấu trúc lồng nhau `highSchool: { province, name }`.
3.  **Parse dữ liệu**: Chuyển đổi định dạng ngày tháng từ string sang timestamp. Map các chuỗi tên của Frappe sang enum tiếng Anh mà UI đang dùng.
4.  **Tính toán chỉ số**: Tính toán `leadScore` từ lịch sử chấm điểm (`score_histories`) mới nhất.

Chỉ nên dùng phương án này nếu UI bắt buộc tiếp tục gọi
`get_student_records_by_phone`.

---

## 4. Quyết định đề xuất

Chọn **Phương án 1**:

```http
GET /api/method/crm.api.get_student_dashboard?phone=...
```

Đây là cách giải quyết nhanh nhất cho lỗi UI hiện tại, vì endpoint này đã tồn tại
trong `crm/api/student_dashboard.py` và được re-export qua `crm/api/__init__.py`
để giữ route cũ `crm.api.get_student_dashboard`. Endpoint
`get_student_records_by_phone` nên giữ vai trò API raw/debug hoặc dùng cho các màn
hình cần dữ liệu Frappe nguyên bản.

Các điểm còn cần lưu ý sau khi đổi endpoint:

*   `student.id` là Frappe document name/string, không phải number.
*   HTTP lỗi nghiệp vụ như thiếu phone hoặc không tìm thấy vẫn trả `200 OK`, cần check `isSuccess=false`.
*   Raw HTTP của Frappe luôn bọc payload trong field `message`.
*   `eventStatus` hiện chưa filter thật trong backend.
