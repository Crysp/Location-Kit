const isDebug = new URL(location.href).searchParams.has('debug');

document.addEventListener('DOMContentLoaded', () => {
  if (isDebug) {
    document.querySelector('.debug')?.classList.add('debug-enabled');
  }
});
