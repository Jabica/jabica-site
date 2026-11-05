type InlineArrowProps = {
  direction?: "upRight" | "right" | "down";
  size?: number | string;
};

export function InlineArrow({ direction = "upRight", size = 16 }: InlineArrowProps) {
  const paths = {
    upRight: <path d="M3 13 13 3M5 3h8v8" />,
    right: <path d="M2 8h12m-5-5 5 5-5 5" />,
    down: <path d="M8 2v12m-5-5 5 5 5-5" />,
  };

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      {paths[direction]}
    </svg>
  );
}
