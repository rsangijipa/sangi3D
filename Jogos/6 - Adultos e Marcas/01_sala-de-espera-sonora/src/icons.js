const glyph={
  chuva:'<path d="M6.5 13a4 4 0 0 1-.1-8 5.7 5.7 0 0 1 10.7 1.2A3.4 3.4 0 1 1 18.2 13ZM7 16l-1.5 2.5m6-2.5L10 18.5m6-2.5-1.5 2.5m-6 1L7.5 22m6-2.5L12 22"/>',
  lareira:'<path d="M12 19c-4 0-6-2.6-6-5.3 0-2.3 1.3-4.2 2.5-5.3-.2 1.5.1 2.4.8 2.9C11 8.5 13.1 6.4 12 2c3.7 2.3 5.1 5.3 5 8.1.6-.4 1.1-1.1 1.3-2 4.4 5.4.7 10.9-6.3 10.9Zm0 0c-2.6-1.3-2.9-3.8.7-7 2.7 2.8 3 5.4-.7 7ZM4 22h16"/>',
  vitrola:'<path d="M4 18h16v3H4zM5 15c0-2 13-2 13 0s-13 2-13 0Zm9-3 4-5 2 1m-3 .3-3-4.7m4 4.8 1.6 4.3"/><circle cx="11.5" cy="15" r=".5"/>',
  relogio:'<circle cx="12" cy="12" r="9"/><path d="M12 6.5V12l3.4 2.4"/>',
  plantas:'<path d="M6.3 14h11.4l-1.5 7H7.8Zm5.7 0V9m0 2c-4.2 0-6.7-1.9-7.2-6 3.5-.2 6.5 1.9 7.2 6Zm0-1.6C12.6 6 15.6 3.5 20 3c.2 4.2-3.4 6.4-8 6.4Z"/>',
  sound:'<path d="M4 9h3.3l4-3v12l-4-3H4zm10.7.1a4 4 0 0 1 0 5.8m2.8-8.6a8 8 0 0 1 0 11.4"/>',
  mute:'<path d="M4 9h3.3l4-3v12l-4-3H4zm11 1 5 5m0-5-5 5"/>',
  close:'<path d="m6 6 12 12m0-12L6 18"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
};
export function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph[name]}</svg>`;}

