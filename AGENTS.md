<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep supplied logo artwork in CDN asset pointers and render it through TemuLogo, so all brand placements share the original artwork.
- Keep vendor grouping in catalog and cart presentation while maintaining one shared order total and WhatsApp handoff, so multi-vendor orders remain a single transaction.
- Preserve the store React context in Vite hot-module data during development so root providers and route-split consumers share one context across preview updates; production and SSR do not use a global singleton.
