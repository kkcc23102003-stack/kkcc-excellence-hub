/** Keep catalogue visibility and authenticated body access identical, including inconsistent legacy rows. */
export function materialAccessMode(material: {
  access_type?: string | null;
  price?: number | null;
  coin_price?: number | null;
  course_id?: string | null;
}): "free" | "paid" | "course" {
  if (
    material.access_type === "paid" ||
    Number(material.price || 0) > 0 ||
    Number(material.coin_price || 0) > 0
  )
    return "paid";
  return material.access_type === "free" || !material.course_id ? "free" : "course";
}
