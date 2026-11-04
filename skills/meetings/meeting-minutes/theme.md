# Theme

The look of every **visual** file this skill makes (docx, pdf, html), from anassahel.com. Sober, calm, print-like. `md` and the email text stay plain.

- **One accent**: electric blue `#2F5BFF` (ink `#1A2F80`, tint `#EBEFFF`). Everything else is gray. Red, amber and green only for a status: late, at risk, done.
- **Flat and square**: no gradients, no shadows, no rounded corners, no italics. Thin rules `#E3E5E8` between sections, `#111418` for section starts.
- **Type**: Geist for text (600 for headlines), Geist Mono for eyebrows, ids and dates, uppercase eyebrows with `0.08em` tracking, muted `#62686F`. In docx and pdf use Aptos, else Arial, and Consolas for mono; say once that installing Geist gives the exact look.
- **Colors**: text `#111418`, secondary `#3D434C`, surface (table headers) `#F4F5F7`, background `#FFFFFF`. html follows the system light/dark setting (dark: bg `#141516`, text `#ECEEF1`, accent `#8AA4FF`); docx and pdf stay light.

## Layout

1. **Eyebrow** in accent: `<TYPE> · MINUTES · <date>`.
2. **Title** in ink, then the main decision or outcome in accent.
3. **In short** box right after: `#EBEFFF` fill, `#1A2F80` text, no border; each line led by its label in mono accent.
4. **Sections** numbered `01 Attendees`, `02 Decisions`... each opened by a strong rule, number in mono accent, small bold label.
5. **Decisions and Actions** are tables with `surface` headers. An action past its date shows `late` in red text, nothing else colored.
