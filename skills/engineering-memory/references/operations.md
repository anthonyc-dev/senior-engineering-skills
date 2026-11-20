# Local memory operations

Run from the consuming project root. Resolve the script relative to the installed skill directory. Examples use PowerShell 7+. For POSIX shells use a JSON pipe or input redirection. Keep entry JSON out of shell history and use UTF-8 input.

```powershell
Get-Content -Raw entry.json | node <memory-script> add
node <memory-script> history <id>
node <memory-script> approve <id> --version 1 --verified
node <memory-script> search 'order idempotency'
node <memory-script> search 'order idempotency' --document README.md --document docs/adr-7.md
Get-Content -Raw entry.json | node <memory-script> update <id>
node <memory-script> export --confirm > backup.json
Get-Content -Raw backup.json | node <memory-script> restore --confirm
node <memory-script> delete <id> --confirm
```

Supply `{"category":"decision","text":"Use the order ID for reconciliation.","source":"docs/adr-7.md","confidence":0.9}`. Categories are `solution`, `decision`, `pattern`, `preference`, `project` and `lesson`. Omit `--verified` for authorized but unverified material. Search returns up to 20 current approved or verified matches, ranked by matching terms, verification, confidence and recency. Pending versions remain visible via history or backup. The outcome of approval applies only to the specified current pending version.

- Default scope is the canonical project directory. Select `--scope global` for cross-project personal facts. Use `--scope shared:team` for an explicitly selected collection shared across clients running as the same OS user. Shared approval also requires `--confirm`. Team transfer is a manual, authorized export to a separately controlled destination.
- The helper stores scope databases under `~/.senior-engineering-memory`. The OS user is the access boundary. On Windows, keep the profile ACL private. The SQLite files and exports are plaintext. Patterns reject common credential formats, but cannot detect all secrets. Review and sanitize all input, including source labels.
- Export contains every retained version in that scope. The helper caps retained versions by a conservative 16 MiB backup budget. Save exports outside the repository with private permissions, then review them before relying on them. Restore takes a trusted export in an unused scope and preserves its version states. Only restore to a destination with the same intended audience. Never restore untrusted files or send backups to remote search.
- Delete removes all versions of an ID from that scope and leaves an ID/timestamp audit entry. Separately remove old backups, snapshots, and exported copies when approved. Moving a checkout changes the project scope. Recover it using an authorized backup from the prior location.
- Keyword search scans current versions. Keep the store to curated facts and use approved local semantic retrieval for larger corpora. No network or background sync is required.
- For document search, choose at most 32 project-relative Markdown files up to 128 KiB each. Use project docs, decision records or installed skills from allowed paths. Search returns matching paths and lines without copying document text. Reopen only relevant lines and validate claims against the current implementation.
