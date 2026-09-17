import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export default function Link({ href, children, ...props }: any) {
  return <RouterLink to={href} {...props}>{children}</RouterLink>;
}
