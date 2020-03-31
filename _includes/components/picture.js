module.exports = (url, alt = "Missing alt text") => {
    return `<picture>
    <source srcset="/img/${url}?nf_resize=fit&w=700" media="(min-width: 1200px)">
    <source srcset="/img/${url}?nf_resize=fit&w=600" media="(min-width: 740px)">
    <img src="/img/${url}?nf_resize=fit&w=500" alt="${alt}" />
  </picture>`;
  };