export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard Hero Section</h1>
        <p className="text-lg text-gray-600 mb-8">This is a placeholder for the HeroSection component</p>
        <div className="max-w-md mx-auto">
          <input 
            id="prompt-input"
            type="text" 
            placeholder="Enter your prompt here..." 
            className="w-full p-3 border rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}