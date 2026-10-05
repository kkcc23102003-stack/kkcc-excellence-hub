# Subject → Chapter → Topic folders

Admin → Tests → **Subjects & Chapters**.

## 1. Subject add karo
- Optional series name aur Subject name likho → **Add subject**.
- Subject ki heading click karke neeche ki list expand/collapse kar sakte ho.
- Empty subjects/chapters bhi save rehte hain.

## 2. Subject ke andar chapters list
- Expanded subject mein chapters likho: har line par ek chapter.
- **Add chapters** dabao. Numbered/bulleted lists bhi accepted hain.
- Chapter ki heading click karo: uske controls usi ke neeche khulenge.

## 3. Optional topics ya direct chapter questions
- Topic nahi chahiye? **Paste chapter questions (without topic)** dabao.
- Topics chahiye? Chapter ke andar har line par ek topic likho → **Add topics**.
- Topic expand karo → **Paste topic questions**.
- Editor usi chapter/topic ke andar khulta hai, alag global form mein nahi.
- Apne MCQs paste karo, preview/edit, Next aur confirmation karo.
- **Save folder draft**: students se hidden; **Publish my test**: selected Free/Paid settings ke saath live.
- Collapse karne par unsaved editor retain rehta hai. Doosra draft kholne par replacement confirmation aayegi.
- Saved sets dikhane ke liye **Show saved sets**; parent reopen karna zaroori nahi.

Text example:

```text
Q1. What is 2 + 3?
A) 4
B) 5
C) 6
D) 7
Answer: B
Explanation: Adding 2 and 3 gives 5.
```

Chapter/topic ke neeche multiple original question sets save ho sakte hain.
Saved sets ki corrections, rename, paid settings, unpublish/delete ke liye
**Edit in Advanced** use karo. Question set ke subject/chapter/topic metadata
badalne par uski folder location update hoti hai. Empty folder metadata alag rehti hai.

## 4. Chapterwise / selected chapters / Complete Test
- Chapter folder select → wanted sets tick → **Make test from selected sets**.
- Subject folder select → alag chapters ke wanted sets tick → same button.
- **Complete subject test** → us subject/series ke saare original manual sets
  (draft + published) se questions collect honge, including topic subfolders.
- Phir Easy preview/editor mein title, time, questions, explanation, Free/Paid
  aur prices check karke publish karo.
- Paid source ho toh combined editor Paid se start karega; apna price set karo
  ya deliberately Free choose karo. Source price automatically charge nahi hoti.
- Combination ek independent snapshot hai. Original sets ko change/delete nahi karta.
- Combined papers future combinations ke source list mein nahi aate.
- Same question/options/answer/explanation duplicate ho toh ek copy rakhi jaati hai.
  Answer/explanation conflict par error; koi answer silently choose nahi hota.
- Different subject/series mix nahi hote. Unrelated bank auto-fill nahi hota.
- Limit: 50 original sets / 200 unique questions per combined paper. Extra content
  silently cut nahi hota; limit cross hone par fewer sets select karne ko kahega.

Series name yahan grouping label hai, paid catalogue bundle/enrollment product
banane ka shortcut nahi. Students existing test cards se published tests open karte
hain; admin folder tree student permissions bypass nahi karta.

## One-time Supabase setup
Accordion UI ke liye **koi naya SQL nahi**. Neeche wala SQL pehle run kiya hai toh dobara zaroori nahi.
**KKCC-Excellence-Hub-TEST-FOLDERS.sql** SQL Editor mein run karo, phir updated app
redeploy karo. Is file mein previous Notes + Publish Fix bhi included hai; alag
Cleaner run karne ki zaroorat nahi. Back up first. Service-role key server-only rahe.
New table sirf folder paths store karti hai. Own draft/published MCQs existing saved
test tables mein rehte hain. Static bank/templates ko Supabase import nahi kiya.
SQL legacy local/S3 JSON aur old attachments migrate nahi karti.

Production SQL/deployment assistant ne execute nahi ki.

Combined paper Easy scoring defaults use karta hai: 1 mark/question, no negative
marking. Source sets ke marks/prices/timers automatically copy nahi hote; combined
paper ki settings preview aur Advanced mein check/edit karo.
