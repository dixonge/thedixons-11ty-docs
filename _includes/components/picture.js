/*
module.exports = (url, alt = "Missing alt text") => {
    return `<picture>
    <source srcset="/img/${url}?nf_resize=fit&w=320" media="(max-width: 320px)">
    <source srcset="/img/${url}?nf_resize=fit&w=375" media="(max-width: 375px)">
    <source srcset="/img/${url}?nf_resize=fit&w=414" media="(max-width: 414px)">
    <source srcset="/img/${url}?nf_resize=fit&w=768" media="(max-width: 768px)">
    <source srcset="/img/${url}?nf_resize=fit&w=1024" media="(max-width: 1024px)">
    <img src="/img/${url}?nf_resize=fit&w=500" alt="${alt}" />
  </picture>`;
  };
*/

module.exports = (url, alt = "Missing alt text") => {
    return `<img src="/img/${url}?nf_resize=fit&w=756" srcset="/img/${url}?nf_resize=fit&w=320, /img/${url}?nf_resize=fit&w=414, /img/${url}?nf_resize=fit&w=756" sizes="(min-width: 756px) 756px, 320px" alt="${alt}">`;
  };