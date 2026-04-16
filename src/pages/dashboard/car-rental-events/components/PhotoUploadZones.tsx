import { useState, useRef } from "react";

interface PhotoZone {
  id: string;
  label: string;
  labelAr: string;
  icon: string;
}

const ZONES: PhotoZone[] = [
  { id: "front",  label: "Front",  labelAr: "الأمام",  icon: "ri-car-line" },
  { id: "rear",   label: "Rear",   labelAr: "الخلف",   icon: "ri-car-line" },
  { id: "left",   label: "Left Side",  labelAr: "الجانب الأيسر",  icon: "ri-car-line" },
  { id: "right",  label: "Right Side", labelAr: "الجانب الأيمن", icon: "ri-car-line" },
];

interface Props {
  isAr: boolean;
}

const PhotoUploadZones = ({ isAr }: Props) => {
  const [photos, setPhotos] = useState<Record<string, File | null>>({
    front: null, rear: null, left: null, right: null,
  });
  const [previews, setPreviews] = useState<Record<string, string | null>>({
    front: null, rear: null, left: null, right: null,
  });
  const [dragging, setDragging] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFile = (zoneId: string, file: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setPhotos((p) => ({ ...p, [zoneId]: file }));
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((p) => ({ ...p, [zoneId]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (zoneId: string) => {
    setPhotos((p) => ({ ...p, [zoneId]: null }));
    setPreviews((p) => ({ ...p, [zoneId]: null }));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg"
          style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
          <i className="ri-camera-line text-cyan-400 text-sm" />
        </div>
        <h3 className="text-white font-bold text-sm font-['Inter']">
          {isAr ? "صور حالة المركبة" : "Vehicle Condition Photos"}
        </h3>
        <span className="text-gray-500 text-xs font-['Inter'] ml-1">
          {isAr ? "(JPG/PNG، 5MB كحد أقصى)" : "(JPG/PNG, max 5MB each)"}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ZONES.map((zone) => {
          const hasPhoto = !!previews[zone.id];
          const isDraggingThis = dragging === zone.id;

          return (
            <div
              key={zone.id}
              className="relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden"
              style={{
                borderColor: isDraggingThis ? "#22D3EE" : hasPhoto ? "rgba(34,211,238,0.4)" : "rgba(34,211,238,0.2)",
                background: isDraggingThis ? "rgba(34,211,238,0.06)" : hasPhoto ? "transparent" : "rgba(10,22,40,0.6)",
                minHeight: "120px",
              }}
              onClick={() => !hasPhoto && inputRefs.current[zone.id]?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(zone.id); }}
              onDragLeave={() => setDragging(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(null);
                const file = e.dataTransfer.files[0];
                handleFile(zone.id, file);
              }}
            >
              <input
                ref={(el) => { inputRefs.current[zone.id] = el; }}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFile(zone.id, e.target.files?.[0] ?? null)}
              />

              {hasPhoto ? (
                <>
                  <img
                    src={previews[zone.id]!}
                    alt={zone.label}
                    className="w-full h-full object-cover"
                    style={{ minHeight: "120px" }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(zone.id); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                      style={{ background: "rgba(248,113,113,0.2)", border: "1px solid rgba(248,113,113,0.4)", color: "#F87171" }}
                    >
                      <i className="ri-delete-bin-line" />
                      {isAr ? "حذف" : "Remove"}
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1"
                    style={{ background: "rgba(0,0,0,0.6)" }}>
                    <p className="text-xs text-white font-['Inter'] truncate">
                      {isAr ? zone.labelAr : zone.label}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 gap-2" style={{ minHeight: "120px" }}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl"
                    style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
                    <i className="ri-image-add-line text-cyan-400 text-lg" />
                  </div>
                  <p className="text-cyan-400 text-xs font-semibold font-['Inter'] text-center">
                    {isAr ? zone.labelAr : zone.label}
                  </p>
                  <p className="text-gray-600 text-xs font-['Inter'] text-center">
                    {isAr ? "اسحب أو انقر" : "Drag or click"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoUploadZones;
