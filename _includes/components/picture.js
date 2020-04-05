
module.exports = (url, alt = "Missing alt text") => {
    return `<picture>
    <source srcset="/img/${url}?nf_resize=fit&w=320" media="(max-width: 320px)">
    <source srcset="/img/${url}?nf_resize=fit&w=375" media="(max-width: 375px)">
    <source srcset="/img/${url}?nf_resize=fit&w=414" media="(max-width: 414px)">
    <source srcset="/img/${url}?nf_resize=fit&w=756" media="(min-width: 755px)">
    <img src="/img/${url}?nf_resize=fit&w=756" alt="${alt}" />
  </picture>`;
  };
/*
module.exports = (url, alt = "Missing alt text") => {
    return `<img srcset="/img/${url}?nf_resize=fit&w=320 320w, /img/${url}?nf_resize=fit&w=756 756w" sizes="(min-width: 740px) 756px, 320px" alt="${alt}">`;
  };
*/