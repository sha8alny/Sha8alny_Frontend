export default function Container({ className, children }) {
  return (
    <div className={`bg-background text-primary rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
