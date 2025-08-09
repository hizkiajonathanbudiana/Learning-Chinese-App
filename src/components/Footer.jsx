export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-border bg-card-bg shadow-sm">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} Hanzi Hub. All Rights Reserved.</p>
        <p className="mt-1">Built with passion in South Tangerang.</p>
      </div>
    </footer>
  );
}
