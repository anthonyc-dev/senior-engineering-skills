---
name: caching
description: Design, implement, and troubleshoot caching for applications, APIs, databases, CDNs, and distributed systems. Use for cache keys, invalidation, TTLs, stale data, stampedes, consistency, or cache performance.
---

# Caching

1. Define what is cached, source of truth, freshness tolerance, cardinality, and failure behavior.
2. Design versioned keys that include every dimension affecting the value and tenant scope.
3. Select TTL, invalidation, cache-aside, write-through, or stale-while-revalidate from consistency needs.
4. Prevent stampedes with request coalescing, jitter, locks, or background refresh.
5. Do not cache secrets, authorization decisions, or private responses across users without safe partitioning.
6. Measure hit rate, latency, evictions, stale reads, and source load.
