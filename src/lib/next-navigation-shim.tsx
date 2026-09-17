import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: navigate,
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
  };
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

export function useParams_() {
  return useParams();
}
