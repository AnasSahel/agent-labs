# Footholds

The fixed list of what an attacker can **hold** between two risks. A risk's route `needs` one of these to start; a risk `gives` one once its asset is reached. Two risks chain when one's `gives` equals the other's `needs`. Use these ids only: never invent one. When nothing fits, pick the closest and say so in the trace; add a new id here by pull request.

The `label` is what managers read on the drawing.

| id | label | The attacker can | Example |
|---|---|---|---|
| `outside` | From outside | Reach only what is public | Anyone on the internet |
| `staff-mailbox` | Staff mailbox | Read and send email as one employee | Phished Microsoft 365 account |
| `staff-account` | Staff account | Sign in to the apps of one employee | Stolen SSO password |
| `staff-laptop` | Staff laptop | Run code on one employee's computer | Malware from a fake invoice |
| `internal-network` | Inside the network | Reach internal servers and shares | VPN access, office Wi-Fi |
| `server` | A server | Control one server or VM | Unpatched file server |
| `admin-account` | Admin account | Change any user, group or setting on premises | Domain admin |
| `cloud-admin` | Cloud admin | Change any cloud resource or identity | AWS root, Entra global admin |
| `code-repo` | Code repository | Change the code that ships | GitHub write access |
| `build-pipeline` | Build pipeline | Change what gets deployed | CI runner, deploy keys |
| `vendor-access` | Supplier access | Use a supplier's remote access to us | MSP remote tool |
| `business-app` | Business app | Act inside one business app as a user | Payroll, ERP, CRM |
| `business-app-admin` | Business app admin | Change settings or data of one business app | Payroll admin |
| `customer-data` | Customer data | Read or copy customer records | CRM export |
| `backups` | Backups | Read, change or delete backups | Backup console |
| `physical` | On site | Touch our devices or offices | Badge cloned, lost laptop |

**Picking one.** Take the widest thing the attacker truly holds at the end of the risk, not the asset itself when the asset gives nothing more (a leaked report gives nothing). A risk whose only outcome is the feared event, with nothing left to use, `gives` nothing: it can only end a chain.
