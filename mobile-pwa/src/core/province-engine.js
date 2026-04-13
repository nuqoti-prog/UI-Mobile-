const provinces = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'An Giang', 'Cần Thơ'];

export function detectProvince(text) {
  const normalized = text.toLowerCase();
  return provinces.find((p) => normalized.includes(p.toLowerCase())) || null;
}
