import type { Session } from 'next-auth';

export async function fetchApi<T>(url: string, session: Session, options: RequestInit = {}) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.jwt}`,
      ...options.headers,
    },
  }).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch API : ${res.statusText}`);
    return res.json() as Promise<T>;
  });
}

export function imageURL(image: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
}
