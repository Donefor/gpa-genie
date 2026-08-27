import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="text-center">
      <p className="numeric text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-3 text-xl font-semibold">This page does not exist</h1>
      <p className="mt-2 text-muted-foreground">
        The link may be out of date, or the page may have moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to the calculator</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
