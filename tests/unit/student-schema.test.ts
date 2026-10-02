import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createFixtureDatabase,
  seedFixtureUsers,
  fixtureIds as ids,
  asRole,
} from "../fixtures/database";

for (const legacy of [false, true])
  test(`${legacy ? "Historical upgrade" : "Fresh schema"}: real roles, RLS, grants, commerce and server attempts`, async () => {
    const db = await createFixtureDatabase(legacy);
    try {
      await db.exec(readFileSync("supabase/STUDENT_ONLY_SCHEMA.sql", "utf8")); // Idempotent rerun.
      await seedFixtureUsers(db);
      const profiles = await db.query<{ count: number }>(
        "SELECT count(*)::integer count FROM public.profiles",
      );
      assert.equal(profiles.rows[0]?.count, 4, "Auth trigger creates all student profiles.");
      await asRole(db, "authenticated", ids.studentA);
      assert.equal(
        (await db.query("SELECT public.claim_admin() result")).rows[0]?.["result"],
        false,
      );
      assert.equal(
        (await db.query("SELECT * FROM public.profiles")).rows.length,
        1,
        "Only own profile visible.",
      );
      await assert.rejects(
        db.query("INSERT INTO public.user_roles(user_id,role) VALUES($1,'admin')", [ids.studentA]),
        /row-level|permission/i,
      );
      await assert.rejects(
        db.query("SELECT public.admin_grant_learning_access('test',$1,$2,'free',0,'',NULL,0)", [
          ids.test,
          ids.studentA,
        ]),
        /Forbidden/i,
      );
      await db.query(
        "UPDATE public.profiles SET email='spoof@fixture.invalid',full_name='Updated Student' WHERE id=$1",
        [ids.studentA],
      );
      assert.equal(
        (await db.query("SELECT email FROM public.profiles WHERE id=$1", [ids.studentA])).rows[0]?.[
          "email"
        ],
        "studenta@fixture.invalid",
        "Profile cannot spoof auth email.",
      );
      await asRole(db, "authenticated", ids.admin);
      for (const kind of ["course", "test", "series"]) {
        const key = kind === "course" ? ids.course : kind === "test" ? ids.test : "neet";
        await db.query(
          "SELECT public.admin_grant_learning_access($1,$2,$3,'admin free access',0,'fixture',now()+interval '1 day',$4)",
          [kind, key, ids.studentA, kind === "course" ? 50 : 0],
        );
        await db.query(
          "SELECT public.admin_grant_learning_access($1,$2,$3,'admin free access',0,'fixture',now()+interval '2 days',$4)",
          [kind, key, ids.studentA, kind === "course" ? 50 : 0],
        );
      }
      assert.equal(
        (await db.query("SELECT public.get_23kaat_balance($1) result", [ids.studentA])).rows[0]?.[
          "result"
        ],
        50,
        "Duplicate enrollment must not award bonus twice.",
      );
      await asRole(db, "authenticated", ids.studentA);
      for (const table of ["course_enrollments", "test_access_grants", "series_access_grants"])
        assert.equal((await db.query(`SELECT * FROM public.${table}`)).rows.length, 1);
      await assert.rejects(
        db
          .query(
            "UPDATE public.course_enrollments SET expires_at=NULL WHERE user_id=$1 RETURNING *",
            [ids.studentA],
          )
          .then((result) => {
            if (!result.rows.length) throw new Error("permission denied by RLS");
          }),
        /permission|row-level/i,
      );
      await assert.rejects(
        db.query("SELECT public.purchase_learning_item($1,'course',$2,0)", [
          ids.studentA,
          ids.course,
        ]),
        /permission|Server only/i,
      );
      await assert.rejects(
        db.query("SELECT public.get_23kaat_balance($1)", [ids.studentB]),
        /Forbidden/,
      );
      await asRole(db, "authenticated", ids.studentB);
      for (const table of ["course_enrollments", "test_access_grants", "series_access_grants"])
        assert.equal(
          (await db.query(`SELECT * FROM public.${table}`)).rows.length,
          0,
          "Student B cannot read A's grants.",
        );
      await asRole(db, "service_role");
      await db.query(
        "INSERT INTO public.coin_transactions(user_id,amount,source,reason) VALUES($1,100,'admin_grant','fixture')",
        [ids.studentB],
      );
      await db.query("SELECT public.purchase_learning_item($1,'test',$2,40)", [
        ids.studentB,
        ids.test,
      ]);
      await db.query("SELECT public.purchase_learning_item($1,'test',$2,40)", [
        ids.studentB,
        ids.test,
      ]);
      assert.equal(
        (await db.query("SELECT public.get_23kaat_balance($1) result", [ids.studentB])).rows[0]?.[
          "result"
        ],
        60,
        "Repeated purchase debits once.",
      );
      await assert.rejects(
        db.query("SELECT public.purchase_learning_item($1,'series','another',1000)", [
          ids.studentB,
        ]),
        /Not enough/,
      );
      await assert.rejects(
        db.query("SELECT public.purchase_learning_item($1,'test',$2,0)", [ids.blocked, ids.test]),
        /unavailable|blocked/i,
      );
      await db.query(
        "INSERT INTO public.coupon_codes(code,title,discount_percent,max_uses) VALUES('FIXTURE100','Free',100,1)",
      );
      const coupon = await db.query(
        "SELECT public.redeem_project_course_coupon($1,'FIXTURE100',$2,500) result",
        [ids.studentB, ids.course],
      );
      assert.equal((coupon.rows[0]?.["result"] as { enrolled: boolean }).enrolled, true);
      await db.query("SELECT public.redeem_project_course_coupon($1,'FIXTURE100',$2,500)", [
        ids.studentB,
        ids.course,
      ]);
      assert.equal(
        (await db.query("SELECT used_count FROM public.coupon_codes WHERE code='FIXTURE100'"))
          .rows[0]?.["used_count"],
        1,
      );
      await assert.rejects(
        db.query("SELECT public.redeem_project_course_coupon($1,'FIXTURE100',$2,500)", [
          ids.studentA,
          ids.course,
        ]),
        /limit/,
      );
      await db.query(
        "INSERT INTO public.learning_attempts(id,user_id,test_id,duration_seconds,question_count,source_refs) VALUES($1,$2,$3,60,2,ARRAY['q1','q2'])",
        [ids.attempt, ids.studentA, ids.test],
      );
      await asRole(db, "authenticated", ids.studentA);
      await assert.rejects(
        db
          .query(
            "UPDATE public.learning_attempts SET score=999,status='submitted' WHERE id=$1 RETURNING *",
            [ids.attempt],
          )
          .then((result) => {
            if (!result.rows.length) throw new Error("permission denied by RLS");
          }),
        /permission|row-level/,
      );
      await assert.rejects(
        db.query("SELECT public.save_learning_attempt_answers($1,$2,'{}')", [
          ids.studentA,
          ids.attempt,
        ]),
        /permission|Server only/,
      );
      await asRole(db, "service_role");
      await db.query("SELECT public.save_learning_attempt_answers($1,$2,'{\"q1\":0}')", [
        ids.studentA,
        ids.attempt,
      ]);
      await assert.rejects(
        db.query("SELECT public.save_learning_attempt_answers($1,$2,'{\"not-part-of-test\":1}')", [
          ids.studentA,
          ids.attempt,
        ]),
        /Invalid answer/,
      );
      await db.query(
        "UPDATE public.learning_attempts SET started_at=now()-interval '2 minutes' WHERE id=$1",
        [ids.attempt],
      );
      const late = await db.query(
        "SELECT public.save_learning_attempt_answers($1,$2,'{\"q1\":2}') result",
        [ids.studentA, ids.attempt],
      );
      assert.equal(
        (late.rows[0]?.["result"] as { ok: boolean }).ok,
        false,
        "Late autosave cannot alter answers.",
      );
      const freshGrade = { score: -1, totalMarks: 2, correct: 0, attempted: 1 };
      const savedGrade = { score: 1, totalMarks: 2, correct: 1, attempted: 1 };
      const result = await db.query(
        "SELECT public.finalize_learning_attempt($1,$2,$3::jsonb,$4::jsonb,$5::jsonb,$6::jsonb) result",
        [
          ids.studentA,
          ids.attempt,
          JSON.stringify({ q1: 2 }),
          JSON.stringify({ q1: 0 }),
          JSON.stringify(freshGrade),
          JSON.stringify(savedGrade),
        ],
      );
      assert.equal(
        (result.rows[0]?.["result"] as { score: number }).score,
        1,
        "Expired submission grades only previously saved answers.",
      );
      const repeated = await db.query(
        "SELECT public.finalize_learning_attempt($1,$2,'{}','{}',$3::jsonb,$3::jsonb) result",
        [ids.studentA, ids.attempt, JSON.stringify(freshGrade)],
      );
      assert.equal(
        (repeated.rows[0]?.["result"] as { score: number }).score,
        1,
        "Submitted result is immutable and idempotent.",
      );
      await assert.rejects(
        db.query("SELECT public.finalize_learning_attempt($1,$2,'{}','{}',$3::jsonb,$3::jsonb)", [
          ids.studentB,
          ids.attempt,
          JSON.stringify(freshGrade),
        ]),
        /not found/,
      );
      await asRole(db, "authenticated", ids.studentB);
      assert.equal((await db.query("SELECT * FROM public.learning_attempts")).rows.length, 0);
      await asRole(db, "authenticated", ids.admin);
      await db.query("UPDATE public.voucher_types SET daily_quota=1 WHERE id='amazon'");
      await asRole(db, "authenticated", ids.studentA);
      const claim = await db.query("SELECT public.claim_reward_voucher('amazon',1000000) result");
      assert.equal((claim.rows[0]?.["result"] as { status: string }).status, "pending");
      await assert.rejects(
        db.query(
          "INSERT INTO public.voucher_claims(voucher_type,user_id,claim_day,status,code) VALUES('amazon',$1,current_date,'fulfilled','fake')",
          [ids.studentA],
        ),
        /row-level|permission/i,
      );
      await asRole(db, "authenticated", ids.studentB);
      await assert.rejects(
        db.query("SELECT public.claim_reward_voucher('amazon',1000000)"),
        /claimed today/,
      );
      await asRole(db, "anon");
      await assert.rejects(db.query("SELECT * FROM public.profiles"), /permission/);
      if (legacy) {
        await assert.rejects(db.query("SELECT * FROM public.test_questions"), /permission/);
        await asRole(db, "authenticated", ids.studentA);
        await assert.rejects(
          db.query("SELECT public.get_my_material_access_url($1)", [ids.course]),
          /permission/,
        );
        await db.exec("RESET ROLE");
        assert.ok(
          (await db.query("SELECT * FROM public.site_settings")).rows.length > 0,
          "Legacy education/config retained for owner export.",
        );
      } else {
        await db.exec("RESET ROLE");
        assert.equal(
          (await db.query("SELECT to_regclass('public.test_questions') present")).rows[0]?.[
            "present"
          ],
          null,
          "Fresh Supabase contains no educational bank.",
        );
      }
    } finally {
      await db.close();
    }
  });
