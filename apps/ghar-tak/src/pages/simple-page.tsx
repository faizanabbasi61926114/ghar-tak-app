
export default function SimplePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6 text-primary">
        A Simple Page
      </h1>
      <div className="prose lg:prose-xl dark:prose-invert bg-card p-6 rounded-lg shadow">
        <p>
          This is a simple page, rendered as HTML by Next.js when you visit
          the <code>/simple-page</code> URL.
        </p>
        <p>
          In a Next.js application, you create pages like this one using
          React components (JSX syntax, which looks a lot like HTML).
          Next.js then takes care of serving it as a regular HTML page to
          the browser.
        </p>
        <p>
          You can add any standard HTML elements here, styled with
          Tailwind CSS, and even include other React components.
        </p>
        <p>
          Because this page is placed in the <code>src/app/(main)/</code> directory,
          it automatically uses the shared layout (header, footer, etc.)
          defined in <code>src/app/(main)/layout.tsx</code>. This is how it's
          "merged" with the rest of your application.
        </p>
      </div>
    </div>
  );
}
