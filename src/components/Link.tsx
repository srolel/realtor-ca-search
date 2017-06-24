import * as React from 'react';

export const pushState = (url?: string) => (e: React.MouseEvent<any>) => {
  e.preventDefault();
  history.pushState(null, '', url);
};

const Link = ({ href, ...rest }: React.HTMLAttributes<any>) =>
  <a href={href} onClick={pushState(href)} {...rest} />;

export default Link;