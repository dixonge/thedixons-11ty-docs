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
    return `<img src="/img/${url}?nf_resize=fit&w=320" 
    srcset="/img/${url}?nf_resize=fit&w=320 320w, /img/${url}?nf_resize=fit&w=375 375w, /img/${url}?nf_resize=fit&w=414 414w, /img/${url}?nf_resize=fit&w=768 768w, /img/${url}?nf_resize=fit&w=1024 1024w"
    sizes=""
    alt="${alt}">`;
  };