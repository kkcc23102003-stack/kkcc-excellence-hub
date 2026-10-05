# Subject → Chapter → Topic folders

Admin → Tests → **Subjects & Chapters**.

## 1. Pehle series, phir uski subjects list
- **Series name** likho → **Continue → Subjects**.
- Us series ke neeche Subject name likho → **Save subject**. Isi tarah multiple subjects add karo.
- Har saved subject ke aage **Chapters →** button dikhega. Click karne par sirf uski chapters list khulegi.
- Series aur subject grouping first subject save hone par database mein persist hoti hai; khaali unsaved series reload par nahi rahegi.
- Existing series apni alag subject lists ke saath dikhti hain; purane unassigned subjects bhi retained hain.

## 2. Subject ke andar chapters list
- Expanded subject mein chapters likho: har line par ek chapter.
- **Add chapters** dabao. Numbered/bulleted lists bhi accepted hain.
- Har saved chapter ke aage **Topics / Skip →** button click karo: optional topics list usi ke neeche khulegi.

## 3. Optional topics ya direct chapter questions
- Topic nahi chahiye? **Skip topics → Paste chapter questions** dabao.
- Topics chahiye? Chapter ke andar har line par ek topic likho → **Add topics**.
- Topic ke aage **Questions →** click karo → **Paste topic questions**.
- Editor usi chapter/topic ke andar khulta hai, alag global form mein nahi.
- Apne MCQs paste karo, preview/edit, Next aur confirmation karo.
- **Save folder draft**: students se hidden; **Publish my test**: selected Free/Paid settings ke saath live.
- Collapse karne par unsaved editor retain rehta hai. Doosra draft kholne par replacement confirmation aayegi.
- Saved sets dikhane ke liye **Show saved sets**; parent reopen karna zaroori nahi.

Paste format: apne ready MCQs/options/answer/explanation paste karne par structured questions automatically parse hote hain. Plain theory se naye AI questions generate karna is parser ka kaam nahi. Preview mein corrections karke Next → review → Save folder draft ya Publish my test karo.

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
- Subject/chapter/topic aur own-question counts par fixed product quota nahi hai.
- 50-name list, 50-source combination aur 200-question caps removed hain. Lists 100-row write batches mein save hoti hain; large reads paginated hain.
- Easy preview mein 25 questions/page aur Advanced saved list mein 50/page dikhte hain. Ye display pages hain, question-count limits nahi.
- Hosting memory, storage, request-size aur timeout limits phir bhi apply hoti hain. Bahut bade paste ko chhote saved sets mein same chapter ke andar save karo; app unrelated bank fill nahi karega.

Series name yahan grouping label hai, paid catalogue bundle/enrollment product
banane ka shortcut nahi. Students existing test cards se published tests open karte
hain; admin folder tree student permissions bypass nahi karta.

## One-time Supabase setup
**Large-question update ke liye SQL required hai.** Pehle Test Folders setup installed hai toh `KKCC-Excellence-Hub-TEST-SCALE-FIX.sql` run karo. Nayi installation ke liye latest combined Test Folders file use karo; usmein scale fix included hai.
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

## Advanced publish aur bank-mixing repair
Advanced partial updates ab sirf aapke changed fields save karte hain—bank/manual mode, price aur generation recipe default values se reset nahi hote.
Apna question add/edit ya bulk paste karne se test **Only My Questions** mode mein aata hai. Auto-bank generation ke liye separately Set Up button use karo; paste-publish par Keep Auto Bank Fill option hata diya hai.
Generated bank papers exact subject/chapter/exam aur documented aliases tak scoped hain. Unknown/custom subject ko dusre subject se silently fill nahi kiya jayega.
