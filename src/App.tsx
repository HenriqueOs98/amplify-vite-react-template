import { useAuthenticator } from '@aws-amplify/ui-react';
import { CodeEditor } from './components/CodeEditor';

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Code Editor</h1>
          <button 
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                       transition-colors duration-200"
          >
            Sign out
          </button>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">JavaScript</h2>
            <CodeEditor language="javascript" userId={user?.username || ''} />
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">HTML</h2>
            <CodeEditor language="html" userId={user?.username || ''} />
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">CSS</h2>
            <CodeEditor language="css" userId={user?.username || ''} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;

