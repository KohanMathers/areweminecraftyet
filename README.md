# Are We Minecraft Yet: Still Waiting

Check if your server is vanilla Minecraft compliant or not.

For now, we require full vanilla compliance.

### Contributing

This repository is open to contributions.
If you find a bug or have a feature request, please open an issue.
Pull requests are welcome!

**Submitting a new server?**
Make sure to update `servers.json` with the following syntax
```json
{
  "name": "Your Server Name",
  "url": "https://your-url.com",
  "sourceLabel": "WhereIsYourSourceFrom",
  "compliance": "SeeBelow",
  "language": "WhatLanguageIsItImplementedIn",
  "type": "SeeBelow",
  "mcVersion": "x.y.z",
  "status": "SeeBelow",
  "description": "Make an amazing description of your server.",
  "forkNote": null
}
```
**IMPORTANT:**
- `compliance` must be one of:
  - `full` (All mechanics, quirks, and known vanilla bugs are matched. No intentional behavioral deviations.)
  - `mostly` (Core gameplay matches vanilla with only minor edge-case or timing differences. )
  - `partial` (Some major systems are implemented, but significant gaps or inconsistencies remain.)
  - `experimental` (Early-stage builds with limited feature coverage and frequent breaking bugs.)
  - `forked` (Intentionally diverges from vanilla behavior to change gameplay or improve performance.)
- If you include a new language, you must add it to line 1 of `script.js` and line 7 of `validate.js`
- `type` must be either `reimplementation` or `fork`
- `status` must be one of:
  - `active`
  - `wip`
  - `abandoned`
- If you are adding a fork, you must add the following text to `forkNotice`:
  - `This is a fork of vanilla Minecraft. Forks are listed for completeness but are unlikely candidates for full compliance.`

### Thanks
- [GoldenStack](https://github.com/GoldenStack) For the inspiration with [dayssincelastrustmcserver](https://github.com/GoldenStack/dayssincelastrustmcserver).
- [kermandev](https://github.com/kermandev) For the original [areweminecraftyet](https://github.com/kermandev/areweminecraftyet).
- Everyone attempting to reimplement vanilla.