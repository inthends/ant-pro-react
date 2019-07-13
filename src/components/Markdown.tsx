import cx from 'classnames';
import DomPurify from 'dompurify';
import React from 'react';
import Remarkable from 'remarkable';

const isPlainText = str => /^[A-Z\s0-9!?\.]+$/gi.test(str);

export function Markdown({ source, className = '' }) {
  if (typeof source !== 'string') {
    return null;
  }

  if (isPlainText(source)) {
    // If the source text is not Markdown,
    // let's save some time and just render it.
    return <div className="markdown">{source}</div>;
  }

  const md = new Remarkable({
    html: true,
    typographer: true,
    breaks: true,
    linkify: true,
    linkTarget: '_blank',
  });

  md.core.ruler.disable(['replacements', 'smartquotes']);

  const html = md.render(source);
  const sanitized = sanitizer(html);

  if (!source || !html || !sanitized) {
    return null;
  }

  return (
    <div className={cx(className, 'markdown')} dangerouslySetInnerHTML={{ __html: sanitized }} />
  );
}
export function sanitizer(str) {
  return DomPurify.sanitize(str, {
    ADD_ATTR: ['target'],
  });
}
