import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="bg-primary text-primary-foreground p-8 rounded-lg shadow-stellar">
        <h1 className="text-2xl font-bold">Welcome to the Stellar Design System</h1>
        <p className="mt-2 text-muted-foreground">Your custom colors are now applied!</p>
      </div>
    </div>
  );
}
