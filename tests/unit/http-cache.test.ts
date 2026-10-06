import { test } from "node:test";
import assert from "node:assert/strict";
import { AssetCache, acceptsGzip, matchesEtag } from "../../scripts/http-cache.mjs";
test("asset cache bounds combined compressed/raw bytes and evicts least-recently-used entries", () => {
  const cache = new AssetCache(12, 2),
    value = (n: number) => ({ raw: Buffer.alloc(n), gzipped: Buffer.alloc(1) });
  cache.set("a", value(4));
  cache.set("b", value(4));
  cache.get("a");
  cache.set("c", value(4));
  assert.equal(cache.get("b"), undefined);
  assert.ok(cache.get("a"));
  assert.equal(cache.bytes, 10);
  cache.set("a", value(20));
  assert.equal(cache.get("a"), undefined);
  assert.equal(cache.bytes, 5);
  cache.set("d", value(7));
  assert.equal(cache.get("c"), undefined);
  assert.equal(cache.bytes, 8);
});
test("gzip negotiation respects explicit exclusion and wildcard quality", () => {
  for (const header of ["gzip", "br, gzip;q=0.8", "*;q=1"]) assert.equal(acceptsGzip(header), true);
  for (const header of ["", "br", "gzip;q=0", "gzip;q=0, *;q=1", "gzip;q=oops", "gzip;q=2"])
    assert.equal(acceptsGzip(header), false);
});
test("weak conditional ETags match lists, not unrelated content", () => {
  assert.ok(matchesEtag('"other", W/"same"', 'W/"same"'));
  assert.ok(matchesEtag('"same"', 'W/"same"'));
  assert.ok(matchesEtag("*", 'W/"same"'));
  assert.equal(matchesEtag('"different"', 'W/"same"'), false);
  assert.equal(matchesEtag(undefined, 'W/"same"'), false);
});
