# Sage Juice Coming Soon Home v1.24

Status: Client-requested revision prepared for internal QA and the public review/staging route. Not published to production.

This revision preserves the verified v1.22 one-screen layout, opening motion, approved core copy, social links, address, and form behavior while implementing Lyle's November 2, 2026 requests: a Champagne and Botanical Sage popup, accessible asterisk required markers, removal of the bottom helper/error sentence, the supplied royalty-free MP3, and a centered `Opening January 2027` line without `Las Vegas Arts District` directly beneath the body copy.

It also implements Todd's November 3 visual review corrections: remove the stray divider beside/above the footer address and align the social-link row with the address heading on desktop and tablet.

## Included

- One approved Champagne + Botanical Sage visual route.
- The client-supplied Montage Serif for display typography, with Manrope retained for practical supporting copy.
- The proposed full-word underline treatment throughout this landing-page study.
- The existing approximately eleven-second cinematic opening and continuing background drift.
- An automatic centered **Something fresh is coming** prompt immediately after the opening motion, without flashing the settled hero first.
- A click-through popup form requesting name, email, and mobile number on desktop, tablet, and phone.
- The approved product line beneath the form: **Cold-pressed juice · Açaí · Wellness shots · Smoothies**.
- Mockup-only submission behavior that closes the popup and returns the visitor to the landing page. No information is stored or transmitted.
- Local-only controls to replay the opening or reopen the popup; these controls are hidden in the dedicated device preview.
- The opening logo remains vertically and horizontally centered throughout the motion, and the atmospheric interior remains visible instead of resolving to a near-solid beige frame.
- The popup teaser has a visible close button and supports normal Escape-key dismissal.
- The unrequested `Cold-pressed juice / Opening 01 · 01 · 27` hero strip has been removed.
- Client-facing display headings omit decorative ending periods and use balanced responsive wrapping.
- The hero uses Lyle's final approved heading and body copy, including the January 2027 opening line.
- The popup action reads **Be the first to know**, centered with no decorative arrow.
- The phone popup uses a compact mobile presentation rather than the desktop scale.
- Name, Email Address, and Mobile Number use visible asterisks with screen-reader-only `required` text. Native HTML required/type validation, label association, focus behavior, and browser-accessible error presentation remain intact.
- The public page is reduced to one hero; the light story and brown signup sections are removed.
- The top-right navigation link is the only public CTA outside the popup.
- The supplied Arts District address and Instagram, TikTok, and Facebook identities are placed in the hero footer.
- The popup uses Champagne as the primary surface with Botanical Sage controls and Espresso text for accessible contrast.
- The opening line is centered beneath the body copy; the duplicate `Las Vegas Arts District` line was removed from that position while the location kicker and address label remain.
- The page uses the client-supplied `monume-lofi-beats-603960.mp3`, represented by the client as royalty-free.
- The audio element requests autoplay as soon as the document begins parsing, and the script requests it again with the opening motion; it loops continuously through the popup and settled landing page until the visitor mutes the browser or device.
- Before the page finishes loading, the visitor sees only the atmospheric background; the logo remains hidden. The opening then starts from its true first frame instead of exposing a complete static logo before the animation.
- There is no visible sound-entry gate or page-level audio button. If a browser applies its own audible-autoplay policy, the soundtrack retries invisibly on the visitor's first normal tap, click, or key press, aligned to the motion's current point.
- Replaying the opening restarts both the ambient track and motion from the beginning; there is no separate visible audio control.
- The supplied address remains in the hero footer with larger, brighter type and no stray divider; the social links align with its heading on desktop and tablet.
- The popup is fitted without an internal scrollbar at the target desktop, tablet, phone, and narrow-phone sizes.

## Palette

- Espresso `#402B16`
- Champagne `#E2C9B3`
- Botanical Sage `#8F9D7E`
- Story Ivory `#FBF0E3`

## Source assets

- `../../assets/client-supplied/2026-10-09-landing-page-reference/interior-reference.png`
- `../../assets/client-supplied/2026-10-10-logo-replacement/sage-juice-logo-transparent.png`
- `../../assets/fonts/montage-serif.otf`
- `../../assets/fonts/montage-serif.ttf`
- `../../assets/client-supplied/2026-11-02-client-feedback/monume-lofi-beats-603960.mp3`

The full-word underline is a review treatment assembled non-destructively from the supplied transparent logo. The supplied master logo file itself was not overwritten.
