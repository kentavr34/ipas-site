import clsx from 'clsx';

/**
 * Официальная печать IPAS — экспорт из Logo IPAS.psd.
 * Файл лежит в public/ — доступен по корню (совместим с `output: 'export'`).
 *
 * На тёмной теме печать хорошо видна благодаря светлой кремовой подложке
 * под ней; если когда-либо понадобится версия для светлой темы — добавим
 * logo-light.png и переключим по `:root.dark` через CSS-переменные.
 */
export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="IPAS — International Psychotherapy Association"
      width={size}
      height={size}
      className={clsx('shrink-0 object-contain', className)}
      style={{ width: size, height: size }}
    />
  );
}
