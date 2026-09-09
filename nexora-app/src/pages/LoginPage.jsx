import { Shield } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your Nexora workspace</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

