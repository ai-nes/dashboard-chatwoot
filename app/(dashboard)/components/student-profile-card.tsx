import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { MailIcon, MapPinIcon, MapPinnedIcon, PhoneIcon, SchoolIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { PanelShell } from "./panel-shell";
import {
  ACADEMIC_GRADE_LABELS,
  MAJOR_PRIORITY_LABELS,
  STUDY_MAJOR_LABELS,
  TRAINING_PROGRAM_LABELS,
  type Student,
} from "./student-types";

const GRADE_STYLE: Record<string, string> = {
  Gioi: "border-emerald-300 bg-emerald-50 text-emerald-800",
  Kha: "border-blue-300 bg-blue-50 text-blue-800",
  "Trung binh": "border-amber-300 bg-amber-50 text-amber-800",
  Yeu: "border-red-300 bg-red-50 text-red-800",
};

export function StudentProfileCard({ student }: { student: Student }) {
  const contactItems = [
    { icon: MailIcon, label: "Email", value: student.email },
    { icon: PhoneIcon, label: "Số điện thoại", value: student.phone },
  ];

  return (
    <PanelShell title="Thông tin học sinh" subtitle="Hồ sơ chi tiết & thuộc tính tuyển sinh">
      <div className="space-y-4 p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {contactItems.map((item) => (
            <InfoItem key={item.label} {...item} />
          ))}
        </div>

        {student.highSchool ? (
          <Section title="Tỉnh & Trường THPT">
            <div className="grid gap-2 sm:grid-cols-2">
              <InfoItem icon={MapPinnedIcon} label="Tỉnh/TP" value={student.highSchool.province} />
              <InfoItem icon={SchoolIcon} label="Trường THPT" value={student.highSchool.name} />
            </div>
          </Section>
        ) : null}

        {student.homeAddress ? (
          <Section title="Địa chỉ">
            <div className="grid gap-2 sm:grid-cols-2">
              <InfoItem icon={MapPinnedIcon} label="Tỉnh/TP" value={student.homeAddress.province} />
              {student.homeAddress.district ? (
                <InfoItem icon={MapPinIcon} label="Quận/Huyện" value={student.homeAddress.district} />
              ) : null}
              {student.homeAddress.detail ? (
                <InfoItem
                  icon={MapPinIcon}
                  label="Địa chỉ chi tiết"
                  value={student.homeAddress.detail}
                  className={student.homeAddress.district ? "sm:col-span-2" : undefined}
                />
              ) : null}
            </div>
          </Section>
        ) : null}

        <Section title="Niên khóa">
          <Badge variant="outline" className="border-violet-300 bg-violet-50 text-[11px] font-medium text-violet-800">
            {student.cohort}
          </Badge>
          {student.dateOfBirth ? (
            <span className="ml-2 text-[11px] text-muted-foreground">Sinh: {student.dateOfBirth}</span>
          ) : null}
        </Section>

        <Section title="Học lực theo năm">
          <div className="flex flex-wrap gap-1.5">
            {student.academicRecords.map((record) => (
              <Badge
                key={record.year}
                variant="outline"
                className={cn("text-[10px] font-medium", GRADE_STYLE[record.grade])}
              >
                {record.year}: {ACADEMIC_GRADE_LABELS[record.grade]}
              </Badge>
            ))}
          </div>
        </Section>

        <Section title="Ngoại ngữ & chứng chỉ">
          <div className="space-y-1.5">
            {student.languages.map((lang, i) => (
              <div
                key={`${lang.certificate}-${i}`}
                className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/50 px-2.5 py-1.5 text-[11px]"
              >
                <span className="font-medium text-emerald-900">
                  {lang.language} — {lang.certificate}
                </span>
                <span className="font-medium text-emerald-700">
                  {lang.score ? `${lang.score}` : ""}
                  {lang.issuedAt ? ` · ${lang.issuedAt}` : ""}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Ngành quan tâm">
          <div className="flex flex-wrap gap-1.5">
            {student.interestedMajors.map((item) => (
              <Badge
                key={item.major}
                variant="outline"
                className={cn(
                  "text-[10px] font-medium",
                  item.priority === "primary"
                    ? "border-violet-300 bg-violet-50 text-violet-800"
                    : "border-neutral-300 bg-neutral-50 text-neutral-700",
                )}
              >
                {STUDY_MAJOR_LABELS[item.major]}
                <span className="ml-1 font-normal opacity-70">
                  · {MAJOR_PRIORITY_LABELS[item.priority]}
                </span>
              </Badge>
            ))}
          </div>
        </Section>

        <Section title="Chương trình đào tạo quan tâm">
          <div className="flex flex-wrap gap-1.5">
            {student.interestedPrograms.map((program) => (
              <Badge
                key={program}
                variant="outline"
                className="border-blue-300 bg-blue-50 text-[10px] font-medium text-blue-800"
              >
                {TRAINING_PROGRAM_LABELS[program]}
              </Badge>
            ))}
          </div>
        </Section>

        {student.notes ? (
          <p className="rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
            {student.notes}
          </p>
        ) : null}
      </div>
    </PanelShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof MailIcon;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-neutral-200 bg-neutral-50/50 px-2.5 py-2",
        className,
      )}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0 text-neutral-500" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[11px] font-medium leading-snug text-foreground">{value}</p>
      </div>
    </div>
  );
}
