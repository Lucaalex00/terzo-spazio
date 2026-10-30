/**
 * Courses and workshops. EDIT THIS FILE to manage the courses shown on the
 * site. Set `open` to false to show a course as "in arrivo" / not bookable.
 */

export interface Course {
  slug: string;
  title: string;
  summary: string;
  /** Free-text schedule, e.g. "Sabato mattina" or "Date in definizione". */
  when?: string;
  open: boolean;
}

export const courses: Course[] = [
  {
    slug: "cura-di-se",
    title: "La cura di sé — rituali quotidiani",
    summary:
      "Un piccolo corso per imparare gesti semplici di cura della pelle e di benessere a casa.",
    when: "Date in definizione",
    open: false,
  },
  {
    slug: "skincare-base",
    title: "Skincare di base",
    summary: "Conoscere la propria pelle e costruire una routine davvero adatta a te.",
    when: "Su richiesta",
    open: true,
  },
];
