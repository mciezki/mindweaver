import sanitizeHtml from 'sanitize-html';

const safeHtmlConfig: sanitizeHtml.IOptions = {
    allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'pre', 'span',
        'br', 'img', 'u', 's', 'sub', 'sup',
    ],
    allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        span: ['style'],
    },
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    selfClosing: ['img', 'br'],
};


export const sanitizeRichText = (dirtyHtml: string | null | undefined): string => {
    if (!dirtyHtml) {
        return '';
    }
    return sanitizeHtml(dirtyHtml, safeHtmlConfig);
};