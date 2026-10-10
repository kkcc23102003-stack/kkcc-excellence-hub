# Storage check aur student access remove

## 1. Storage usage
Admin → **Storage usage** (`/admin/storage`) → **Check storage usage**.
- PostgreSQL database size aur Supabase bucket-wise file count/metadata bytes alag dikhte hain.
- Refresh storage usage se fresh reading aur Last checked timestamp milta hai.
- Ye read-only check hai: kuch delete/cleanup nahi hota.
- Size missing/invalid ho toh unknown count show hota hai; use measured zero nahi maana jaata.
- Remaining plan quota, backup/WAL billing, bandwidth aur external S3/R2/Drive/YouTube usage is report mein nahi hai. Provider dashboard authoritative hai.
- Database/file quotas alag hain; inhe jod kar free-plan remaining space mat calculate karo.
- Existing Space Saver cleanup ek alag, explicitly confirmed feature hai; storage check usko run nahi karta.

## 2. Selected student ka access remove
Admin → **Student access — Grant / Remove** (`/admin/students`).
1. Existing Assign Course, Test or Test Series panel mein **Enrollment student** select karo.
2. Usi panel ke neeche **Remove student access** mein sab Course/Test/Series grants dikhte hain.
3. Sahi item ke aage **Remove access** → student/item dobara check → **Confirm remove access**.
4. Row **Revoked** ho jaayegi. Cancel karne se kuch nahi badalta.
5. Student account, payment records aur history delete nahi hote. Ye refund action nahi hai.
6. Dobara access dene ke liye wahi Grant Enrollment use karo. Purani revoked row history mein rahegi; new active row ban sakti hai.
7. Free/public content ya kisi doosri active series/batch/test entitlement se access mil sakta hai. Ye ek grant revoke karta hai, student ko app se ban nahi karta. Pending offline invitations (signup se pehle) existing Admin → Offline access screen se revoke karo.

## Deployment
Existing deployment mein **KKCC-Excellence-Hub-STORAGE-USAGE.sql** Supabase SQL Editor mein run karo; then latest ZIP build/deploy karo. Access-removal panel existing revoke endpoints use karta hai—uske liye extra SQL nahi hai.
New production setup ke latest combined Production SQL mein storage RPC included hai.
Admin role checks server aur database dono par hain. SQL install sirf function add karta hai; files/users delete nahi karta.
No production SQL/deployment assistant ne execute nahi ki.

## Verification
104 unit/database tests + full 82-test browser suite passed.
Actual student access revoke/regrant, course and series lockout, unaffected direct test grant,
cancel confirmation, preserved revoked history, storage refresh and 390px layout tested.
