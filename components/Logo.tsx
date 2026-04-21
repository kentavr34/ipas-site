import clsx from 'clsx';

// basePath из next.config.js попадает сюда через env.NEXT_PUBLIC_BASE_PATH.
// При деплое в корень (intpas.com) значение пустое — префикс не добавляется.
const BP = process.env.NEXT_PUBLIC_BASE_PATH || '';

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
      src={`${BP}/logo.png`}
      alt="IPAS — International Psychotherapy Association"
      width={size}
      height={size}
      className={clsx('shrink-0 object-contain', className)}
      style={{ width: size, height: size }}
    />
  );
}
