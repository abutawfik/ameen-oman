import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions,
  LookupButton, SuccessScreen, BRANCHES, PAYMENT_METHODS,
} from "./components/FormComponents";

interface Props { isAr: boolean; onCancel: () => void; onSaved: () => void; }

const ChangeRoomForm = ({ isAr, onCancel, onSaved }: Props) => {
  const [branch, setBranch] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [changeDT, setChangeDT] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);

  const t = {
    title: isAr ? "تغيير غرفة" : "Room Change",
    tip: isAr
      ? "أدخل رقم مرجع الحجز للبحث عن تفاصيل النزيل والغرفة الحالية."
      : "Enter Booking Reference to look up guest details and current room.",
    eventInfo: isAr ? "معلومات تغيير الغرفة" : "Room Change Information",
    branch: isAr ? "الفرع" : "Branch",
    bookingRef: isAr ? "مرجع الحجز" : "Booking Reference",
    currentRoom: isAr ? "الغرفة الحالية" : "Current Room",
    newRoom: isAr ? "الغرفة الجديدة" : "New Room Number",
    payment: isAr ? "طريقة الدفع" : "Payment Method",
    changeDT: isAr ? "تاريخ ووقت التغيير" : "Room Change Date & Time",
    reason: isAr ? "سبب التغيير (اختياري)" : "Reason for Change (optional)",
    notFound: isAr ? "لم يُعثر على الحجز" : "Booking not found",
    reasons: [
      { value: "guest_request", label: isAr ? "طلب النزيل" : "Guest Request" },
      { value: "maintenance",   label: isAr ? "صيانة" : "Maintenance" },
      { value: "upgrade",       label: isAr ? "ترقية" : "Upgrade" },
      { value: "overbooking",   label: isAr ? "حجز زائد" : "Overbooking" },
      { value: "noise",         label: isAr ? "ضوضاء" : "Noise Complaint" },
      { value: "other",         label: isAr ? "أخرى" : "Other" },
    ],
  };

  const lookupBooking = () => {
    if (bookingRef.toUpperCase() === "BK-88234") {
      setLookupError(false);
      setCurrentRoom("412");
      setAutoFilled(true);
    } else {
      setLookupError(true);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => { setSaved(false); onSaved(); }, 2000);
    }, 1500);
  };

  if (saved) {
    return (
      <SuccessScreen
        icon="ri-door-line"
        color="#FACC15"
        titleEn="Room Change Event Saved!"
        titleAr="تم حفظ حدث تغيير الغرفة!"
        isAr={isAr}
        eventCode="HOTEL_ROOM_CHANGE"
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.3)" }}
        >
          <i className="ri-door-line text-yellow-400 text-xl" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl font-['Inter']">{t.title}</h2>
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] tracking-widest">HOTEL_ROOM_CHANGE</p>
        </div>
      </div>

      <TipBanner text={t.tip} color="amber" />

      <SectionCard title={t.eventInfo} icon="ri-exchange-line" accentColor="#FACC15">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={t.branch} required>
            <SelectInput
              options={BRANCHES}
              placeholder={isAr ? "اختر الفرع" : "Select branch"}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </FormField>

          <FormField label={t.bookingRef} required>
            <div className="flex gap-2">
              <TextInput
                placeholder="BK-XXXXX"
                value={bookingRef}
                onChange={(e) => { setBookingRef(e.target.value); setLookupError(false); }}
                className="flex-1 font-['JetBrains_Mono'] tracking-wider"
              />
              <LookupButton onClick={lookupBooking} isAr={isAr} />
            </div>
            {lookupError && (
              <p className="text-red-400 text-xs mt-1 font-['Inter'] flex items-center gap-1">
                <i className="ri-error-warning-line" />{t.notFound}
              </p>
            )}
          </FormField>

          <FormField label={t.currentRoom}>
            <TextInput
              placeholder={isAr ? "الغرفة الحالية" : "Current room"}
              value={currentRoom}
              onChange={(e) => setCurrentRoom(e.target.value)}
              autoFilled={autoFilled && !!currentRoom}
              readOnly={autoFilled}
              className="font-['JetBrains_Mono']"
            />
          </FormField>

          <FormField label={t.newRoom} required>
            <TextInput
              placeholder={isAr ? "رقم الغرفة الجديدة" : "New room number"}
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              className="font-['JetBrains_Mono']"
            />
          </FormField>

          <FormField label={t.payment} required>
            <SelectInput
              options={PAYMENT_METHODS}
              placeholder={isAr ? "اختر طريقة الدفع" : "Select payment"}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </FormField>

          <FormField label={t.changeDT} required>
            <TextInput
              type="datetime-local"
              value={changeDT}
              onChange={(e) => setChangeDT(e.target.value)}
            />
          </FormField>

          <FormField label={t.reason} className="sm:col-span-2">
            <SelectInput
              options={t.reasons}
              placeholder={isAr ? "اختر السبب" : "Select reason"}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </FormField>
        </div>

        {/* Visual room change indicator */}
        {currentRoom && newRoom && (
          <div
            className="mt-5 flex items-center justify-center gap-6 p-5 rounded-xl"
            style={{ background: "rgba(34,211,238,0.03)", border: "1px solid rgba(34,211,238,0.08)" }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-xl"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)" }}
              >
                <span className="text-red-400 font-black text-xl font-['JetBrains_Mono']">{currentRoom}</span>
              </div>
              <span className="text-gray-600 text-xs font-['Inter']">{isAr ? "الحالية" : "Current"}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <i className="ri-arrow-right-line text-cyan-400 text-2xl" />
              <span className="text-gray-700 text-xs font-['Inter']">{isAr ? "تغيير" : "Change"}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-xl"
                style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}
              >
                <span className="text-green-400 font-black text-xl font-['JetBrains_Mono']">{newRoom}</span>
              </div>
              <span className="text-gray-600 text-xs font-['Inter']">{isAr ? "الجديدة" : "New"}</span>
            </div>
          </div>
        )}
      </SectionCard>

      <FormActions onCancel={onCancel} onSave={handleSave} saving={saving} isAr={isAr} />
    </div>
  );
};

export default ChangeRoomForm;
