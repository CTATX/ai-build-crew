# Custom domain setup — AI Build Crew

Target address: `aibuildcrew.badlabz.com`  
Site platform: OpenAI Sites  
DNS manager: GoDaddy  
Email provider: Microsoft 365

## Safety boundary

Add only the record or records supplied by OpenAI Sites for the `aibuildcrew` subdomain.

Do not delete or edit:

- the existing `@` A records for `badlabz.com`;
- any Microsoft 365 MX record;
- autodiscover, SPF, DKIM, DMARC, or other Microsoft-related records;
- the GoDaddy nameserver records.

These existing records operate the BadLabz website and email. A new `aibuildcrew` subdomain can be connected without moving either service.

## Phase 1 — get the exact records from Sites

1. Open [ChatGPT Sites](https://chatgpt.com/sites).
2. Switch to the account/workspace where **AI Build Crew** appears.
3. Open **AI Build Crew → More actions → Settings**.
4. Select **Add domain**.
5. Enter `aibuildcrew.badlabz.com`.
6. Leave this screen open. Copy every DNS record Sites displays exactly. Do not guess the destination value.

Sites may request a CNAME record and may also request a TXT ownership-verification record. Use the exact types, names, and values shown.

## Phase 2 — add the records in GoDaddy

1. Sign in to the GoDaddy account that manages BadLabz.com.
2. Open **Domain Portfolio** and select **BadLabz.com**.
3. Select **DNS** to open the DNS records.
4. Select **Add New Record**.
5. For each record supplied by Sites, enter:
   - **Type:** exactly as Sites shows, usually `CNAME` or `TXT`.
   - **Name:** the host/prefix from Sites. For this subdomain it will commonly be `aibuildcrew`, but use the displayed value.
   - **Value:** paste the complete Sites destination or verification value.
   - **TTL:** keep GoDaddy's default, normally one hour.
6. Save the new record.
7. Confirm that no existing A, MX, Microsoft, or nameserver record changed.

## Phase 3 — verify and launch

1. Return to **AI Build Crew → Settings → Domains** in Sites.
2. Select **Refresh** or **Verify**.
3. DNS may verify within minutes, but allow up to the provider's stated propagation window.
4. When Sites reports the domain active, open `https://aibuildcrew.badlabz.com` in a private browser window.
5. Verify the Alpha loads, HTTPS is active, and the prompt, token, budget, governance, About, and artifact links work.
6. Keep the original `chatgpt.site` address as a fallback until the custom domain has been stable through the launch review.

## Rollback

If the subdomain does not work, remove only the new `aibuildcrew` CNAME/TXT record created for Sites. Do not change the root-domain or Microsoft 365 records.

Official references:

- OpenAI Sites: https://learn.chatgpt.com/docs/sites
- GoDaddy DNS records: https://www.godaddy.com/help/manage-dns-records-680
