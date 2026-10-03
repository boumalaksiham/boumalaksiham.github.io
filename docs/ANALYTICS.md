# Visitor analytics setup

The portfolio includes optional Umami visit and custom-event tracking. **It is not active until the owner supplies a real tracking configuration.** No analytics account is created by this repository.

## Activate

1. Add `boumalaksiham.github.io` as a website in your own Umami account or instance.
2. Copy the script URL and `data-website-id` from that website's tracking snippet.
3. Put those two public values in `assets/config.js`. Use an HTTPS script URL. Never put an account password or API key in the public repository.
4. Publish, visit the production site, then check the Umami dashboard for the pageview and a project click. Browser blocking, Do Not Track, Global Privacy Control, or the site's opt-out can prevent tracking.

Official references: [collect data](https://docs.umami.is/docs/collect-data), [tracker configuration](https://docs.umami.is/docs/tracker-configuration), and [tracker functions](https://docs.umami.is/docs/tracker-functions).

## Collected interactions

| Event | Attached property |
|---|---|
| `project_repository` | Repository slug |
| `project_documentation` | Repository slug |
| `evaluation_artifact` | Repository slug |
| `case_study_open` | Repository slug |
| `architecture_step` | Selected stage |
| `project_filter` | Selected category |
| `github_profile` | None |
| `contact_email` | None |
| `contact_linkedin` | None |

A contact click does not establish that a message was sent. Project search terms are not sent, and the implementation does not call `umami.identify`. It cannot tell you a visitor's name or LinkedIn identity.

Tracking is restricted to the configured production hostname. URL queries and hash fragments are excluded. The tracker respects Do Not Track; the loader also checks Global Privacy Control. A before-send hook prevents collection after a visitor opts out through the footer Privacy dialog. The opt-out is stored in that browser when local storage is available.

## Verify

Use the dashboard to confirm real production pageviews and clicks. Preview visits on localhost do not count. Account credentials and analytics dashboards belong outside the public site. If no script URL or website ID is configured, the page loads without an analytics request.

The tracking code can be prepared without an account, but visitor statistics cannot be collected or displayed to the owner until an account and website ID are connected.
