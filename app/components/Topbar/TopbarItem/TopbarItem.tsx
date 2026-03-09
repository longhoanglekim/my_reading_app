interface Props {
  children: React.ReactNode;
}

export default function TopbarItem({ children }: Props) {
  return (
    <div
      className={`
        px-4 py-2 rounded-lg cursor-pointer transition-colors
        text-gray-700 hover:bg-gray-100
        dark:text-gray-200 dark:hover:bg-gray-800
      `}
    >
      {children}
    </div>
  );
}