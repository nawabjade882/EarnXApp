export function Logo() {
  return (
    <div className="w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-lg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 8.5L12 15L22 8.5L12 2Z" />
        <path d="M2 15.5L12 22L22 15.5" />
        <path d="M2 8.5L12 15L22 8.5" style={{ opacity: 0.5 }}/>
      </svg>
    </div>
  );
}
