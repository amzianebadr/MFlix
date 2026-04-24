import getWatchRoute from '../utils/getWatchRoute';

export default function WatchNowButton({
  item,
  season,
  episode,
  disabled = false,
  className = '',
  variant = 'primary',
}) {
  const route = getWatchRoute(item, season, episode);
  const isDisabled = disabled || !route;

  const baseStyles =
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold uppercase tracking-[0.2em] transition focus:outline-none focus:ring-2 focus:ring-brand-accent/40';
  const variantStyles =
    variant === 'secondary'
      ? 'border border-brand-accent bg-transparent text-brand-text hover:bg-brand-accent hover:text-brand-bg'
      : 'bg-brand-accent text-brand-bg hover:bg-yellow-300 active:translate-y-px';
  const disabledStyles = isDisabled ? 'cursor-not-allowed opacity-50 hover:bg-inherit hover:text-inherit' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`.trim()}
      disabled={isDisabled}
      onClick={() => {
        if (!route) {
          return;
        }

        window.location.assign(route);
      }}
      type="button"
    >
      Watch Now
    </button>
  );
}
