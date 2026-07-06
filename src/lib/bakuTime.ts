/*
  Admin formalarında <input type="datetime-local"> Bakı vaxtı kimi qəbul olunur.
  Azərbaycan 2016-dan bəri sabit UTC+4-dədir (yay vaxtı yoxdur), ona görə
  sadə sabit sürüşmə kifayətdir.
*/

/** Bazadakı ISO tarixi datetime-local dəyərinə (Bakı vaxtı ilə) çevirir. */
export function toBakuLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Date(d.getTime() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

/** datetime-local dəyərini (Bakı vaxtı) bazaya yazılacaq ISO-ya çevirir. */
export function fromBakuLocalInput(value: string): string | null {
  const v = value.trim();
  return v ? `${v}:00+04:00` : null;
}
