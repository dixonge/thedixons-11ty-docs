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
    return `<img src="/img/${url}?nf_resize=fit&w=320" srcset="/img/${url}?nf_resize=fit&w=320, /img/${url}?nf_resize=fit&w=414, /img/${url}?nf_resize=fit&w=756" sizes="(max-width: 320px) 290px, (min-width: 321px) 385px, (min-width: 757px) 737px, 756px" alt="${alt}">`;
  };