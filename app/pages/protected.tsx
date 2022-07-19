import Layout from '@/components/layout';
import { getSession, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Protected() {
  const { status } = useSession();
  useEffect(() => {
    const fetchSession = async () => {
      await getSession();
    };
    fetchSession();
  }, []);

  if (status === 'loading' || status === 'unauthenticated') {
    return 'Loading or not authenticated...';
  }

  return (
    <Layout title="Next.js example">
      <div>User is logged in</div>
    </Layout>
  );
}

Protected.auth = true;
