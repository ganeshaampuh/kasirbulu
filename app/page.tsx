export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Kasir Bulu</h1>
        <p className="text-lg text-gray-600 mb-8">Pet Shop POS System</p>
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}
