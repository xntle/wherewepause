export default function Home() {
  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen">
      {/* Main container */}
      <div className="text-center">
        {/* Website Title */}
        <h1 className="text-5xl text-black font-bold mb-8">wherewepause</h1>

        {/* Description */}
        <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
          This is your pause in a world that moves too fast—a space where you can
          slow down, breathe, and let the noise fade away. Here, you’ll find quiet
          guidance for life’s tangled moments, and maybe, a bit of yourself too.
        </p>

        {/* Start link */}
        <a
          href="pause"
          className="text-indigo-600 font-medium hover:underline inline-flex items-center"
        >
          start<span className="ml-1">↗</span>
        </a>
      </div>
    </div>
  );
}
