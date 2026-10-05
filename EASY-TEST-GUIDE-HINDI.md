# Easy Text Test — apne questions se test

Advanced setup hataaya nahi gaya. Admin → Tests par do tabs hain:
**Easy Text Test** aur **Advanced — existing setup**.

1. Easy tab mein subject aur chapter likho. Title optional hai; time default 30 min.
2. Neeche apne MCQs paste karo:

```text
Q1. 2 + 3 kitna hai?
A) 4
B) 5
C) 6
D) 7
Answer: B
Explanation: 2 aur 3 jodne par 5 aata hai.

Q2. Punjab ki capital kya hai?
A) Ludhiana
B) Amritsar
C) Chandigarh
D) Jalandhar
Answer: C
Explanation: Chandigarh Punjab ki capital hai.
```

Ek test mein apne selected subject/chapter ke questions hi paste karo—upar sirf
format dikhaya gaya hai, mixed-subject test banane ki recommendation nahi hai.
Question Hindi/Punjabi/English mein ho sakta hai. Labels Q1., A), Answer:,
Explanation: rakho. Explanation optional; system missing explanation invent nahi karta.

3. Preview: parsed count check karo. Questions/options/explanation edit kar sakte ho,
   radio button se correct answer change aur question remove kar sakte ho.
   Incomplete numbered question ho toh pehle fix karna padega.
4. Next → review. Checkbox se confirm karke **Publish my test** dabao.
   Preview/Next par kuch save nahi hota.
5. Default free test, 1 mark per question, zero negative marking. Maximum 200
   pasted questions. Paid price, timers, reorder, edit/delete etc. Advanced tab mein.
   Actual question count approved preview se set hota hai, forced 60 nahi.

Series name optional grouping label hai, existing paid test-series bundle mein
automatic enrollment/access linking nahi. Uske existing Advanced controls retained hain.
Easy Text Test raw MCQs ko test format mein convert karta hai; plain chapter prose
se naye AI questions nahi invent karta. Bank auto-fill **off** rehta hai.

## Subject bug fix
Blank subject ko SST default karna, arbitrary chapter/subject fallback, generated
synthetic filler aur manual selection mismatch par all-question fallback hataaye.
Exact scoped bank coverage nahi ho toh error/available count dikhega. Questions
ko galat subject ka label laga kar fill nahi kiya jayega. Existing saved wrong
questions automatically delete nahi kiye gaye—Admin mein review/edit karo.
Strict matching ka matlab kuch custom chapter names ko actual bank chapter names
se match karna ya apne questions add karna zaroori ho sakta hai.

## Existing live deployment: ek baar SQL
Back up first. `KKCC-Excellence-Hub-EASY-TESTS.sql` Supabase SQL Editor mein run karo,
server-only `SUPABASE_SERVICE_ROLE_KEY` check karo aur updated app redeploy karo.
Templates bank ko DB mein bulk import nahi kiya jata. **Saved test metadata aur
published question rows Supabase space use karte hain.** Legacy SQL test rows
copy hote hain; old local/S3 JSON data ho toh separately export/import karo.
Atomic publication: invalid question par poora save rollback; retry same request
se duplicates nahi. Live SQL/hosting deployment assistant ne execute nahi kiya.
