module.exports = (url, alt = "Missing alt text") => {
    return `<picture>
    <source srcset="/img/${url}?nf_resize=fit&w=320" media="(max-width: 320px)">
    <source srcset="/img/${url}?nf_resize=fit&w=375" media="(min-width: 375px)">
    <source srcset="/img/${url}?nf_resize=fit&w=414" media="(min-width: 414px)">
    <source srcset="/img/${url}?nf_resize=fit&w=768" media="(min-width: 768px)">
    <source srcset="/img/${url}?nf_resize=fit&w=1024" media="(min-width: 1024px)">
    <img src="/img/${url}?nf_resize=fit&w=500" alt="${alt}" />
  </picture>`;
  };